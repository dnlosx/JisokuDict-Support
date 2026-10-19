import { timingSafeEqual } from 'crypto'
import { and, asc, gte, isNull, lt } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { feedback } from '@/db/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Read-only summary for the weekly digest job. Authenticated with a bearer
 * token (DIGEST_TOKEN) rather than the admin cookie so a scheduled job can call
 * it without holding the admin password. Disabled when DIGEST_TOKEN is unset.
 */
function authorized(req: NextRequest): boolean {
  const expected = process.env.DIGEST_TOKEN
  if (!expected || expected.length < 32) return false
  const header = req.headers.get('authorization') ?? ''
  const a = Buffer.from(header)
  const b = Buffer.from(`Bearer ${expected}`)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get('days')) || 7, 1), 90)
  const since = new Date(Date.now() - days * DAY_MS)

  const recent = await db
    .select()
    .from(feedback)
    .where(gte(feedback.createdAt, since))
    .orderBy(asc(feedback.createdAt))

  const olderUnhandled = await db
    .select({ id: feedback.id })
    .from(feedback)
    .where(and(lt(feedback.createdAt, since), isNull(feedback.handledAt)))

  return NextResponse.json({
    since: since.toISOString(),
    count: recent.length,
    olderUnhandled: olderUnhandled.length,
    items: recent.map((f) => ({
      id: f.id,
      topic: f.topic,
      message: f.message,
      email: f.email,
      device: f.device,
      appVersion: f.appVersion,
      createdAt: f.createdAt.toISOString(),
      handled: f.handledAt !== null,
    })),
  })
}
