import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="animate-pulse space-y-4" aria-busy="true" aria-live="polite">
            <div className="h-8 w-48 bg-ink-100 rounded" />
            <div className="h-4 w-72 bg-ink-100 rounded" />
            <div className="h-32 w-full bg-ink-100 rounded mt-6" />
          </div>
          <span className="sr-only">Loading…</span>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
