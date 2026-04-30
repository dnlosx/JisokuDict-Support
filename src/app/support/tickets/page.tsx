import { desc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TicketCard } from '@/components/TicketCard'
import { db } from '@/db'
import { tickets } from '@/db/schema'
import { getUserTokenRecord } from '@/lib/auth/cookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your tickets - JisokuDict Support',
}

export default async function TicketsPage() {
  const owner = await getUserTokenRecord()

  const myTickets = owner
    ? await db
        .select({
          publicId: tickets.publicId,
          title: tickets.title,
          category: tickets.category,
          status: tickets.status,
          visibility: tickets.visibility,
          updatedAt: tickets.updatedAt,
        })
        .from(tickets)
        .where(eq(tickets.userTokenId, owner.id))
        .orderBy(desc(tickets.updatedAt))
        .limit(100)
    : []

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">Your tickets</h1>
          <p className="text-sm text-ink-500 mb-8">
            Tickets are tied to a private cookie on this browser. If you have a recovery URL from
            another device,{' '}
            <Link href="/support/tickets/new" className="text-sakura-600 hover:text-sakura-700 underline">
              start a new ticket
            </Link>{' '}
            or paste the URL in your address bar to restore access.
          </p>

          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/support/tickets/new"
              className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-700 transition"
            >
              New ticket
            </Link>
            <Link href="/support/public" className="text-sm text-ink-600 hover:text-ink-900 transition">
              Browse public Q&amp;A →
            </Link>
          </div>

          {myTickets.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-ink-200 rounded-lg">
              <p className="text-ink-500 mb-4">
                {owner
                  ? "You haven't submitted any tickets yet."
                  : 'No tickets found on this browser.'}
              </p>
              <Link
                href="/support/tickets/new"
                className="text-sakura-600 hover:text-sakura-700 underline"
              >
                Submit your first ticket
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myTickets.map((t) => (
                <TicketCard
                  key={t.publicId}
                  href={`/support/tickets/${t.publicId}`}
                  title={t.title}
                  category={t.category}
                  status={t.status}
                  visibility={t.visibility}
                  updatedAt={t.updatedAt}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
