import { asc, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { ticketMessages, tickets } from '@/db/schema'
import { getUserTokenRecord, isAdmin } from '@/lib/auth/cookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, ctx: Params) {
  const { slug } = await ctx.params
  const [ticket] = await db.select().from(tickets).where(eq(tickets.publicId, slug)).limit(1)
  if (!ticket) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const [admin, owner] = await Promise.all([isAdmin(), getUserTokenRecord()])
  const isOwner = owner?.id === ticket.userTokenId
  const isPublic = ticket.visibility === 'public'

  if (!admin && !isOwner && !isPublic) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticket.id))
    .orderBy(asc(ticketMessages.createdAt))

  return NextResponse.json({
    ticket: {
      publicId: ticket.publicId,
      title: ticket.title,
      category: ticket.category,
      status: ticket.status,
      visibility: ticket.visibility,
      authorUsername: ticket.authorUsername,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      publishedAt: ticket.publishedAt,
    },
    messages: messages.map((m) => ({
      id: m.id,
      authorRole: m.authorRole,
      body: m.body,
      createdAt: m.createdAt,
    })),
  })
}
