import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export default function AdminTicketNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Ticket not found</h1>
          <p className="text-ink-600 mb-6">No ticket matches that ID, or you don&apos;t have access.</p>
          <Link
            href="/admin"
            className="inline-block bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-700 transition"
          >
            Back to admin
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
