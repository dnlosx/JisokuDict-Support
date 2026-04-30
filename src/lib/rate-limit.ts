import { sql } from 'drizzle-orm'

import { db } from '@/db'

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: Date
}

/**
 * Sliding window-ish counter, fixed-window per key.
 * Single SQL upsert: if the existing window has expired, reset it; otherwise increment.
 * Returns the post-increment count and whether it exceeded the limit.
 */
export async function checkAndIncrement(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const nowMs = Date.now()
  const cutoffMs = nowMs - windowSeconds * 1000

  const rows = db.all<{ count: number; window_start: number }>(sql`
    INSERT INTO rate_limits (key, window_start, count)
    VALUES (${key}, ${nowMs}, 1)
    ON CONFLICT(key) DO UPDATE SET
      window_start = CASE WHEN window_start < ${cutoffMs} THEN ${nowMs} ELSE window_start END,
      count        = CASE WHEN window_start < ${cutoffMs} THEN 1 ELSE count + 1 END
    RETURNING count, window_start
  `)

  const row = rows[0]
  if (!row) {
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: new Date(nowMs + windowSeconds * 1000),
    }
  }

  const count = Number(row.count)
  const windowStartMs = Number(row.window_start)
  const resetAt = new Date(windowStartMs + windowSeconds * 1000)
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt,
  }
}
