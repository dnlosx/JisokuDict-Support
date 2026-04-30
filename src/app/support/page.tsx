import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export const metadata: Metadata = {
  title: 'Support - JisokuDict',
  description: 'Get help with JisokuDict. Submit a support ticket, browse common questions, or read frequently asked answers.',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />

      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-ink-900 mb-2">Support</h1>
          <p className="text-ink-600 mb-8">
            Need help with JisokuDict? Submit a ticket and we&apos;ll get back to you by email.
          </p>

          <section className="mb-12 grid sm:grid-cols-2 gap-4">
            <Link
              href="/support/tickets/new"
              className="block rounded-xl border border-ink-100 p-6 hover:border-sakura-300 hover:bg-ink-50/40 transition"
            >
              <h2 className="text-lg font-semibold text-ink-900 mb-2">Submit a ticket</h2>
              <p className="text-ink-600 text-sm">
                Report a bug, request a feature, or ask a question. We&apos;ll reply by email.
              </p>
            </Link>
            <Link
              href="/support/public"
              className="block rounded-xl border border-ink-100 p-6 hover:border-sakura-300 hover:bg-ink-50/40 transition"
            >
              <h2 className="text-lg font-semibold text-ink-900 mb-2">Browse public Q&amp;A</h2>
              <p className="text-ink-600 text-sm">
                Read answers to questions other users have asked.
              </p>
            </Link>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Before you submit</h2>
            <div className="bg-ink-50 p-4 rounded-lg">
              <p className="text-ink-700 font-medium mb-2">When reporting a bug, please include:</p>
              <ul className="list-disc list-inside text-ink-600 space-y-1">
                <li>Device model (e.g., iPhone 15, iPad Pro)</li>
                <li>iOS/macOS version</li>
                <li>App version</li>
                <li>Steps to reproduce the issue</li>
                <li>Screenshots if applicable (use a public image URL — Markdown supported)</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-ink-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <FaqItem
                question="Why does the app take time to load on first launch?"
                answer="JisokuDict includes a comprehensive offline dictionary. On first launch, it needs to prepare the database, which may take a few seconds."
              />
              <FaqItem
                question="How do I remove ads?"
                answer={'You can purchase "Remove Ads" from the Settings screen to permanently remove all banner ads.'}
              />
              <FaqItem
                question="How do I restore my purchase on a new device?"
                answer={'Go to Settings and tap "Restore Purchases" to restore your previous purchases.'}
              />
              <FaqItem
                question="Are my favorites backed up?"
                answer="Yes, if you're signed into iCloud, your favorites automatically sync across all your devices."
              />
              <FaqItem
                question="Does the app work offline?"
                answer="Yes! The entire dictionary is stored on your device. No internet connection is required to search."
              />
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-ink-100 pb-6">
      <h3 className="text-lg font-semibold text-ink-900 mb-2">{question}</h3>
      <p className="text-ink-600">{answer}</p>
    </div>
  )
}
