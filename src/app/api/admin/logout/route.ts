import { type NextRequest, NextResponse } from 'next/server'

import { clearAdminCookie } from '@/lib/auth/cookie'
import { requireSameOrigin } from '@/lib/same-origin'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!requireSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const res = NextResponse.json({ ok: true })
  clearAdminCookie(res)
  return res
}
