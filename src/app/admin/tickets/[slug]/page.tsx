import { asc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { AdminTicketControls } from '@/components/AdminTicketControls'
import { ReplyForm } from '@/components/ReplyForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TicketCategoryBadge, TicketStatusBadge, TicketVisibilityBadge } from '@/components/TicketBadges'
import { TicketThread } from '@/components/TicketThread'
import { db } from '@/db'
import { ticketMessages, tickets } from '@/db/schema'
import { isAdmin } from '@/lib/auth/cookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export const metadata: Metadata = {
  title: 'Admin ticket - JisokuDict Support',
  robots: { index: false, follow: false },
}

export default async function AdminTicketPage({ params }: Params) {
  const { slug } = await params

  if (!(await isAdmin())) {
    redirect(`/admin/auth`)
  }

  const [ticket] = await db.select().from(tickets).where(eq(tickets.publicId, slug)).limit(1)
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

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/admin"
            className="text-sm text-ink-500 hover:text-ink-900 transition inline-block mb-4"
          >
            ← Back to admin
          </Link>

          <div className="mb-2 flex flex-wrap items-center gap-2">
            <TicketStatusBadge status={ticket.status} />
            <TicketCategoryBadge category={ticket.category} />
            <TicketVisibilityBadge visibility={ticket.visibility} />
          </div>

          <h1 className="text-3xl font-bold text-ink-900 mb-2 break-words">{ticket.title}</h1>

          <p className="text-sm text-ink-500 mb-6">
            From <span className="font-medium text-ink-700">{ticket.authorUsername}</span>
          </p>

          <div className="mb-6">
            <AdminTicketControls
              slug={ticket.publicId}
              status={ticket.status}
              visibility={ticket.visibility}
            />
          </div>

          <TicketThread messages={threadMessages} />

          <div className="mt-8 border-t border-ink-100 pt-6">
            <ReplyForm endpoint={`/api/tickets/${ticket.publicId}/messages`} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
