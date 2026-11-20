import type { Metadata, Viewport } from 'next'
import '../globals.css'

import { APP_STORE_ID, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Jisoku - Japanese Dictionary for iPhone, iPad & Mac',
  description:
    'A fast, offline Japanese-English dictionary with over 200,000 words. Smart search, romaji, kanji stroke order, pitch accent, flashcards and iCloud sync.',
  applicationName: 'Jisoku',
  // Safari's Smart App Banner: offers the app, or opens it when installed.
  itunes: { appId: APP_STORE_ID },
  openGraph: { siteName: 'Jisoku', type: 'website', locale: 'en_US' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f8fd',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-ink-900 antialiased">
        {children}
      </body>
    </html>
  )
}
