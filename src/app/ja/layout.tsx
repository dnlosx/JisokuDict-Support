import type { Metadata, Viewport } from 'next'
import '../globals.css'

import { APP_STORE_ID, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Jisoku',
  itunes: { appId: APP_STORE_ID },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f8fd',
}

export default function JapaneseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white font-japanese text-ink-900 antialiased">{children}</body>
    </html>
  )
}
