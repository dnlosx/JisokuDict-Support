import { and, asc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TicketCategoryBadge } from '@/components/TicketBadges'
import { TicketThread } from '@/components/TicketThread'
import { db } from '@/db'
import { ticketMessages, tickets } from '@/db/schema'

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
    authorDisplayName: m.authorRole === 'admin' ? 'JisokuDict Support' : ticket.authorUsername,
    body: m.body,
    createdAt: m.createdAt,
  }))

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

          <div className="mt-8 border-t border-ink-100 pt-6">
            <p className="text-sm text-ink-500">
              Have a similar question?{' '}
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
