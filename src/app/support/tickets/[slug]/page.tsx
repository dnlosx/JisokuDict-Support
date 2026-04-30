import { asc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ReplyForm } from '@/components/ReplyForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TicketCategoryBadge, TicketStatusBadge, TicketVisibilityBadge } from '@/components/TicketBadges'
import { TicketThread } from '@/components/TicketThread'
import { db } from '@/db'
import { ticketMessages, tickets } from '@/db/schema'
import { getUserTokenRecord, isAdmin } from '@/lib/auth/cookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export const metadata: Metadata = {
  title: 'Ticket - JisokuDict Support',
}

export default async function AuthorTicketPage({ params }: Params) {
  const { slug } = await params

  const [ticket] = await db.select().from(tickets).where(eq(tickets.publicId, slug)).limit(1)
  if (!ticket) notFound()

  const [admin, owner] = await Promise.all([isAdmin(), getUserTokenRecord()])
  const isOwner = owner?.id === ticket.userTokenId
  if (!admin && !isOwner) notFound()

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticket.id))
    .orderBy(asc(ticketMessages.createdAt))

  const threadMessages = messages.map((m) => ({
    id: m.id,
    authorRole: m.authorRole,
    authorDisplayName: m.authorRole === 'admin' ? 'JisokuDict Support' : ticket.authorUsername,
    body: m.body,
    createdAt: m.createdAt,
  }))

  const canReply = ticket.status !== 'closed'

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/support/tickets"
            className="text-sm text-ink-500 hover:text-ink-900 transition inline-block mb-4"
          >
            ← Back to your tickets
          </Link>

          <div className="mb-2 flex flex-wrap items-center gap-2">
            <TicketStatusBadge status={ticket.status} />
            <TicketCategoryBadge category={ticket.category} />
            <TicketVisibilityBadge visibility={ticket.visibility} />
          </div>

          <h1 className="text-3xl font-bold text-ink-900 mb-6 break-words">{ticket.title}</h1>

          <TicketThread messages={threadMessages} />

          <div className="mt-8 border-t border-ink-100 pt-6">
            {canReply ? (
              <ReplyForm endpoint={`/api/tickets/${ticket.publicId}/messages`} />
            ) : (
              <p className="text-sm text-ink-500">This ticket is closed. You can&apos;t reply.</p>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
