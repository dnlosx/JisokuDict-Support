import { type NextRequest, NextResponse } from 'next/server'

import { setAdminCookie, signAdminCookie, verifyAdminPassword } from '@/lib/auth/cookie'
import { checkAndIncrement } from '@/lib/rate-limit'
import { getClientIp, requireSameOrigin } from '@/lib/same-origin'
import { adminAuthSchema } from '@/lib/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!requireSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const bucket = await checkAndIncrement(`ip:${ip ?? 'unknown'}:admin_auth`, 5, 3600)
  if (!bucket.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = adminAuthSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const token = signAdminCookie()
  const res = NextResponse.json({ ok: true })
  setAdminCookie(res, token)
  return res
}
