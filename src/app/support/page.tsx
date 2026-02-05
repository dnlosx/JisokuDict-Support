import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support - JisokuDict',
  description: 'Get help with JisokuDict. Find answers to frequently asked questions, report bugs, or request features.',
}

const APP_STORE_URL = 'https://apps.apple.com/us/app/jisokudict/id6757970596'

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-ink-100">
        <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-ink-900">
            JisokuDict
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/support" className="text-sakura-600 font-medium">
              Support
            </Link>
            <Link href="/privacy" className="text-ink-600 hover:text-ink-900 transition">
              Privacy
            </Link>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-700 transition"
            >
              Download
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-ink-900 mb-8">Support</h1>

          {/* Getting Help */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Getting Help</h2>
            <p className="text-ink-600 mb-4">
              If you encounter any issues or have suggestions for improvements, please{' '}
              <a
                href="https://github.com/dnlosx/JisokuDict-Support/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sakura-600 hover:text-sakura-700 underline"
              >
                open an issue
              </a>{' '}
              on GitHub.
            </p>
            <div className="bg-ink-50 p-4 rounded-lg">
              <p className="text-ink-700 font-medium mb-2">When reporting a bug, please include:</p>
              <ul className="list-disc list-inside text-ink-600 space-y-1">
                <li>Device model (e.g., iPhone 15, iPad Pro)</li>
                <li>iOS/macOS version</li>
                <li>Steps to reproduce the issue</li>
                <li>Screenshots if applicable</li>
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-ink-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <FaqItem
                question="Why does the app take time to load on first launch?"
                answer="JisokuDict includes a comprehensive offline dictionary. On first launch, it needs to prepare the database, which may take a few seconds."
              />
              <FaqItem
                question="How do I remove ads?"
                answer='You can purchase "Remove Ads" from the Settings screen to permanently remove all banner ads.'
              />
              <FaqItem
                question="How do I restore my purchase on a new device?"
                answer='Go to Settings and tap "Restore Purchases" to restore your previous purchases.'
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

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Contact</h2>
            <p className="text-ink-600">
              For bug reports and feature requests, please use{' '}
              <a
                href="https://github.com/dnlosx/JisokuDict-Support/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sakura-600 hover:text-sakura-700 underline"
              >
                GitHub Issues
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ink-500 text-sm">
            © {new Date().getFullYear()} JisokuDict
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/support" className="text-ink-500 hover:text-ink-900 transition">
              Support
            </Link>
            <Link href="/privacy" className="text-ink-500 hover:text-ink-900 transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
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
