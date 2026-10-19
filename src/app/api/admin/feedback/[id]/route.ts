import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { feedback } from '@/db/schema'
import { isAdmin } from '@/lib/auth/cookie'
import { requireSameOrigin } from '@/lib/same-origin'
import { adminUpdateFeedbackSchema } from '@/lib/validators'

export const runtime = 'nodejs'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!requireSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const parsed = adminUpdateFeedbackSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
  }

  const { id } = await params
  const [row] = await db
    .update(feedback)
    .set({ handledAt: parsed.data.handled ? new Date() : null })
    .where(eq(feedback.id, id))
    .returning({ id: feedback.id })

  if (!row) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
