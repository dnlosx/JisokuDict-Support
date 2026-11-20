import type { Metadata } from 'next'

import { LANDING_COPY } from '@/components/landing/copy'
import { LandingPage } from '@/components/landing/LandingPage'
import { landingAlternates, SITE_URL } from '@/lib/site'

const { meta } = LANDING_COPY.en
const image = { url: '/og/en.png', width: 1200, height: 630, alt: meta.ogAlt }

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: landingAlternates('en'),
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: SITE_URL,
    siteName: 'Jisoku',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ja_JP',
    images: [image],
  },
  twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: [image] },
}

export default function HomePage() {
  return <LandingPage locale="en" />
}
