import Link from 'next/link'

import type { Locale } from '@/lib/i18n'

const LABELS = {
  en: { support: 'Support', privacy: 'Privacy Policy' },
  es: { support: 'Soporte', privacy: 'Política de privacidad' },
} as const

export function SiteFooter({ locale = 'en' }: { locale?: Locale }) {
  const t = LABELS[locale]
  const prefix = locale === 'es' ? '/es' : ''
  return (
    <footer className="border-t border-ink-100 py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-ink-500 text-sm">© {new Date().getFullYear()} JisokuDict</p>
        <div className="flex items-center gap-6 text-sm">
          <Link href={`${prefix}/support`} className="text-ink-500 hover:text-ink-900 transition">
            {t.support}
          </Link>
          <Link href={`${prefix}/privacy`} className="text-ink-500 hover:text-ink-900 transition">
            {t.privacy}
          </Link>
        </div>
      </div>
    </footer>
  )
}
