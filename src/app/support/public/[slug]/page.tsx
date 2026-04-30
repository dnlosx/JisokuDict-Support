import { and, asc, desc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PublicReplyForm } from '@/components/PublicReplyForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TicketCategoryBadge } from '@/components/TicketBadges'
import { TicketThread } from '@/components/TicketThread'
import { db } from '@/db'
import { ticketMessages, tickets } from '@/db/schema'
import { getUserTokenRecord } from '@/lib/auth/cookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const [t] = await db
    .select({ title: tickets.title })
    .from(tickets)
    .where(and(eq(tickets.publicId, slug), eq(tickets.visibility, 'public')))
    .limit(1)

  return {
    title: t ? `${t.title} - JisokuDict Support` : 'Public ticket - JisokuDict Support',
  }
}

const FMT = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

export default async function PublicTicketPage({ params }: Params) {
  const { slug } = await params

  const [ticket] = await db
    .select()
    .from(tickets)
    .where(and(eq(tickets.publicId, slug), eq(tickets.visibility, 'public')))
    .limit(1)

  if (!ticket) notFound()

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticket.id))
    .orderBy(asc(ticketMessages.createdAt))

  const threadMessages = messages.map((m) => ({
    id: m.id,
    authorRole: m.authorRole,
    authorDisplayName:
      m.authorRole === 'admin'
        ? 'JisokuDict Support'
        : m.authorUsername || ticket.authorUsername,
    body: m.body,
    createdAt: m.createdAt,
  }))

  const owner = await getUserTokenRecord()
  const hasCookie = !!owner
  // Pre-fill the username with the most recent name they've used on this browser.
  let defaultUsername: string | undefined
  if (owner) {
    const recent = await db
      .select({ authorUsername: tickets.authorUsername })
      .from(tickets)
      .where(eq(tickets.userTokenId, owner.id))
      .orderBy(desc(tickets.createdAt))
      .limit(1)
    defaultUsername = recent[0]?.authorUsername
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/support/public"
            className="text-sm text-ink-500 hover:text-ink-900 transition inline-block mb-4"
          >
            ← Back to public Q&amp;A
          </Link>

          <div className="mb-2 flex flex-wrap items-center gap-2">
            <TicketCategoryBadge category={ticket.category} />
          </div>

          <h1 className="text-3xl font-bold text-ink-900 mb-2 break-words">{ticket.title}</h1>

          <p className="text-sm text-ink-500 mb-6">
            by <span className="font-medium text-ink-700">{ticket.authorUsername}</span>
            {ticket.publishedAt ? <> · {FMT.format(new Date(ticket.publishedAt))}</> : null}
          </p>

          <TicketThread messages={threadMessages} />

          <section className="mt-8 border-t border-ink-100 pt-6">
            <h2 className="text-lg font-semibold text-ink-900 mb-3">Add a reply</h2>
            <p className="text-sm text-ink-500 mb-4">
              Anyone can reply on the public knowledge base. Replies from JisokuDict show a{' '}
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-sakura-600 text-white align-middle">
                Staff
              </span>{' '}
              badge.
            </p>
            <PublicReplyForm
              endpoint={`/api/tickets/${ticket.publicId}/messages`}
              hasCookie={hasCookie}
              defaultUsername={defaultUsername}
            />
          </section>

          <div className="mt-8 border-t border-ink-100 pt-6">
            <p className="text-sm text-ink-500">
              Have a different question?{' '}
              <Link href="/support/tickets/new" className="text-sakura-600 hover:text-sakura-700 underline">
                Submit a new ticket
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
