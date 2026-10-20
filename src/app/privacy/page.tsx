import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export const metadata: Metadata = {
  title: 'Privacy Policy - JisokuDict',
  description: 'Privacy policy for JisokuDict Japanese dictionary app and the JisokuDict Support service.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="privacy" />

      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 prose prose-ink">
          <h1 className="text-4xl font-bold text-ink-900 mb-2">Privacy Policy</h1>
          <p className="text-ink-500 mb-8">Last updated: October 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Introduction</h2>
            <p className="text-ink-600 mb-4">
              JisokuDict (&quot;the App&quot;) is a Japanese-English dictionary application. This Privacy Policy explains how we collect, use, and protect your information when you use the App or the JisokuDict Support service at jisoku.app/support.
            </p>
            <p className="text-ink-600">
              We are committed to protecting your privacy and being transparent about our data practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">Local Data (Stored on Your Device)</h3>
            <p className="text-ink-600 mb-4">The App stores the following data locally on your device:</p>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li><strong>Search History</strong> - Your recent dictionary searches to provide quick access to previous lookups</li>
              <li><strong>Favorites</strong> - Words and kanji you mark as favorites for easy reference</li>
            </ul>
            <p className="text-ink-600 mb-6">
              This data is stored only on your device and is not transmitted to our servers or any third party.
            </p>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">iCloud Sync</h3>
            <p className="text-ink-600 mb-6">
              If you are signed into iCloud, your favorites, flashcards, notes, study history and search history may be synced across your devices using Apple&apos;s iCloud service. This data is protected by Apple&apos;s privacy policies and is not accessible to us.
            </p>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">Advertising Data</h3>
            <p className="text-ink-600 mb-2">The App uses Google AdMob to display advertisements. AdMob may collect:</p>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li>Device identifiers (such as advertising ID)</li>
              <li>General location data (country/region level)</li>
              <li>App usage and interaction data</li>
              <li>Ad viewing and interaction data</li>
            </ul>
            <p className="text-ink-600">
              This data is collected by Google and is subject to Google&apos;s Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Support Messages (jisoku.app/support)</h2>
            <p className="text-ink-600 mb-4">
              When you send a message through the contact form on this website, we store the following in our database (SQLite, hosted on Railway with a persistent volume):
            </p>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li>The topic and the message you write</li>
              <li>Your device and app version, if you choose to enter them</li>
              <li>Your email address, <strong>only if you choose to enter it</strong></li>
            </ul>
            <p className="text-ink-600 mb-4">
              The email field is optional. If you leave it, we use it only to reply to that message. We never add it to a mailing list or share it. You don&apos;t need an account, and the form sets no cookies.
            </p>
            <p className="text-ink-600 mb-4">
              Messages are private. Only the developer can read them, and they are never published.
            </p>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">Subprocessors</h3>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li><strong>Cloudflare Turnstile</strong> - bot protection on the contact form. Cloudflare may collect browser signals according to their policy.</li>
              <li><strong>Railway</strong> - hosts the application and database.</li>
            </ul>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">Retention</h3>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li>Messages are retained for <strong>2 years</strong>, then purged. This includes tickets sent through the earlier ticket system on this site.</li>
              <li>You can ask us to delete your messages sooner by sending a request through the contact form.</li>
            </ul>

            <p className="text-ink-600">
              No third-party analytics or tracking is loaded on the support pages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">How We Use Your Information</h2>
            <p className="text-ink-600 mb-4">
              <strong>Local Data:</strong> Your search history and favorites are used solely to improve your experience within the App by providing quick access to your recent and saved items.
            </p>
            <p className="text-ink-600 mb-4">
              <strong>Support Messages:</strong> Used to fix bugs, answer your questions and, if you left an email, reply to you.
            </p>
            <p className="text-ink-600">
              <strong>Advertising Data:</strong> Data collected by AdMob is used to serve relevant advertisements and to measure ad performance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Data Sharing</h2>
            <p className="text-ink-600 mb-4">
              We do not sell, trade, or transfer your personal information to third parties beyond the subprocessors listed above (which act on our behalf to operate the service).
            </p>
            <p className="text-ink-600">
              Outside the App, the only third-party service that receives device data is Google AdMob for advertising purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Your Rights</h2>
            <p className="text-ink-600 mb-2">You have the right to:</p>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li><strong>Access</strong> your data stored in the App (visible in search history and favorites)</li>
              <li><strong>Delete</strong> your search history and favorites at any time</li>
              <li><strong>Request access to or deletion</strong> of your support messages through the <Link href="/support#contact" className="text-sakura-600 hover:text-sakura-700 underline">contact form</Link></li>
              <li><strong>Opt out</strong> of personalized advertising through your device settings</li>
            </ul>
            <p className="text-ink-600">
              To limit ad tracking on iOS, go to <strong>Settings &gt; Privacy &amp; Security &gt; Tracking</strong>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Children&apos;s Privacy</h2>
            <p className="text-ink-600">
              The App is not directed at children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Third-Party Links</h2>
            <p className="text-ink-600">
              The App may contain links to external websites (such as the EDRDG dictionary project). We are not responsible for the privacy practices of these external sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Changes to This Policy</h2>
            <p className="text-ink-600">
              We may update this Privacy Policy from time to time. Any changes will be reflected in the App with an updated revision date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Third-Party Privacy Policies</h2>
            <ul className="list-disc list-inside text-ink-600 space-y-2">
              <li>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sakura-600 hover:text-sakura-700 underline"
                >
                  Google AdMob Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://support.google.com/admob/answer/6128543"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sakura-600 hover:text-sakura-700 underline"
                >
                  Google Ads Data Collection
                </a>
              </li>
              <li>
                <a
                  href="https://www.cloudflare.com/privacypolicy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sakura-600 hover:text-sakura-700 underline"
                >
                  Cloudflare Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://railway.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sakura-600 hover:text-sakura-700 underline"
                >
                  Railway Privacy Policy
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
