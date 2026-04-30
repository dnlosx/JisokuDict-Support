import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { ticketMessages, tickets } from '@/db/schema'
import { getUserTokenRecord, isAdmin } from '@/lib/auth/cookie'
import { checkAndIncrement } from '@/lib/rate-limit'
import { requireSameOrigin } from '@/lib/same-origin'
import { replyMessageSchema } from '@/lib/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, ctx: Params) {
  if (!requireSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const [admin, owner] = await Promise.all([isAdmin(), getUserTokenRecord()])
  if (!admin && !owner) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { slug } = await ctx.params
  const [ticket] = await db.select().from(tickets).where(eq(tickets.publicId, slug)).limit(1)
  if (!ticket) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const isOwner = owner?.id === ticket.userTokenId
  if (!admin && !isOwner) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const rateKey = admin ? `admin:message_create` : `user:${owner!.id}:message_create`
  const bucket = await checkAndIncrement(rateKey, 20, 3600)
  if (!bucket.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = replyMessageSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
  }

  const role: 'user' | 'admin' = admin ? 'admin' : 'user'

  db.transaction((tx) => {
    tx.insert(ticketMessages)
      .values({
        ticketId: ticket.id,
        authorRole: role,
        body: parsed.data.body,
      })
      .run()
    tx.update(tickets)
      .set({ updatedAt: new Date() })
      .where(eq(tickets.id, ticket.id))
      .run()
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
