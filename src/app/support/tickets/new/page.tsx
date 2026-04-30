import { desc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { db } from '@/db'
import { tickets } from '@/db/schema'
import { getUserTokenRecord } from '@/lib/auth/cookie'

import { NewTicketForm } from './NewTicketForm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'New ticket - JisokuDict Support',
}

export default async function NewTicketPage() {
  const owner = await getUserTokenRecord()

  let lockedUsername: string | null = null
  if (owner) {
    const recent = await db
      .select({ authorUsername: tickets.authorUsername })
      .from(tickets)
      .where(eq(tickets.userTokenId, owner.id))
      .orderBy(desc(tickets.createdAt))
      .limit(1)
    lockedUsername = recent[0]?.authorUsername ?? null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">Submit a ticket</h1>
          <p className="text-ink-600 mb-8">
            We&apos;ll respond on this site. After submitting, you&apos;ll get a private bookmark URL to
            access your ticket from any device.
          </p>
          <NewTicketForm lockedUsername={lockedUsername} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
