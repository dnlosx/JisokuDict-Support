import { type NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { feedback } from '@/db/schema'
import { checkAndIncrement } from '@/lib/rate-limit'
import { getClientIp, requireSameOrigin } from '@/lib/same-origin'
import { verifyTurnstile } from '@/lib/turnstile'
import { createFeedbackSchema } from '@/lib/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!requireSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const ipBucket = await checkAndIncrement(`ip:${ip ?? 'unknown'}:feedback`, 10, 3600)
  if (!ipBucket.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = createFeedbackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { turnstileToken, ...fields } = parsed.data

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ error: 'captcha_failed' }, { status: 400 })
  }

  await db.insert(feedback).values(fields)

  return NextResponse.json({ ok: true }, { status: 201 })
}
