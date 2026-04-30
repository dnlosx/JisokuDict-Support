import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { db } from '@/db'
import { userTokens } from '@/db/schema'
import { USER_COOKIE } from '@/lib/auth/cookie'
import { hashToken } from '@/lib/auth/tokens'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Restore access - JisokuDict Support',
}

type Props = {
  searchParams: Promise<{ t?: string }>
}

export default async function RestorePage({ searchParams }: Props) {
  const params = await searchParams
  const raw = typeof params.t === 'string' ? params.t : ''

  if (!raw) {
    return <FailureView />
  }

  const [row] = await db
    .select({ id: userTokens.id })
    .from(userTokens)
    .where(eq(userTokens.tokenHash, hashToken(raw)))
    .limit(1)

  if (!row) {
    return <FailureView />
  }

  const store = await cookies()
  store.set(USER_COOKIE, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 5,
  })

  redirect('/support/tickets')
}

function FailureView() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Invalid recovery link</h1>
          <p className="text-ink-600 mb-6">
            This link doesn&apos;t match any account. Recovery links are case-sensitive and never expire.
          </p>
          <Link
            href="/support/tickets/new"
            className="inline-block bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-700 transition"
          >
            Submit a new ticket
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
