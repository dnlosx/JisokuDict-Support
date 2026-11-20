import type { Metadata } from 'next'

import { LANDING_COPY } from '@/components/landing/copy'
import { LandingPage } from '@/components/landing/LandingPage'
import { landingAlternates, SITE_URL } from '@/lib/site'

const { meta } = LANDING_COPY.ja
const image = { url: '/og/ja.png', width: 1200, height: 630, alt: meta.ogAlt }

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: landingAlternates('ja'),
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: `${SITE_URL}/ja`,
    siteName: 'Jisoku',
    type: 'website',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
    images: [image],
  },
  twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: [image] },
}

export default function JapaneseHomePage() {
  return <LandingPage locale="ja" />
}
