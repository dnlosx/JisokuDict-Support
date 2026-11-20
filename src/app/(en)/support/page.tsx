import type { Metadata } from 'next'

import { SupportView } from '@/components/SupportView'
import { alternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Support - Jisoku',
  description:
    'Answers to common Jisoku questions about purchases, iCloud sync, study and search, plus a form to reach the developer.',
  alternates: alternates('en', '/support'),
}

export default function SupportPage() {
  return <SupportView locale="en" />
}
