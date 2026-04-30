import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { tickets } from '@/db/schema'
import { isAdmin } from '@/lib/auth/cookie'
import { requireSameOrigin } from '@/lib/same-origin'
import { adminUpdateTicketSchema } from '@/lib/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function PATCH(req: NextRequest, ctx: Params) {
  if (!requireSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { slug } = await ctx.params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = adminUpdateTicketSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
  }

  const updates: {
    status?: 'open' | 'in_progress' | 'resolved' | 'closed'
    visibility?: 'private' | 'public'
    publishedAt?: Date | null
  } = {}
  if (parsed.data.status) updates.status = parsed.data.status
  if (parsed.data.visibility) updates.visibility = parsed.data.visibility

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true })
  }

  const [existing] = await db.select().from(tickets).where(eq(tickets.publicId, slug)).limit(1)
  if (!existing) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  if (
    parsed.data.visibility === 'public' &&
    existing.visibility !== 'public' &&
    !existing.publishedAt
  ) {
    updates.publishedAt = new Date()
  }

  await db
    .update(tickets)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(tickets.id, existing.id))

  return NextResponse.json({ ok: true })
}
