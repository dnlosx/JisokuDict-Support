import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JisokuDict - Japanese Dictionary for iOS',
  description: 'A fast, offline Japanese-English dictionary with over 200,000 entries. Features smart search, romaji support, kanji lookup, and iCloud sync.',
  keywords: ['Japanese dictionary', 'iOS app', 'kanji', 'Japanese learning', 'offline dictionary'],
  openGraph: {
    title: 'JisokuDict - Japanese Dictionary for iOS',
    description: 'A fast, offline Japanese-English dictionary with over 200,000 entries.',
    type: 'website',
  },
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
