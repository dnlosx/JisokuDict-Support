'use client'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Admin error</h1>
          <p className="text-ink-600 mb-6">Something went wrong loading this page.</p>
          <button
            type="button"
            onClick={() => reset()}
            className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-700 transition"
          >
            Try again
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
