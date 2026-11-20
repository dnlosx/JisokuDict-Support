import Link from 'next/link'

import type { SiteLocale } from '@/lib/site'

const LABELS = {
  en: { home: '/', support: 'Support', privacy: 'Privacy Policy', other: ['日本語', '/ja', 'ja'] },
  ja: { home: '/ja', support: 'サポート', privacy: 'プライバシーポリシー', other: ['English', '/', 'en'] },
  es: { home: '/', support: 'Soporte', privacy: 'Política de privacidad', other: ['English', '/', 'en'] },
} as const

const CREDITS = {
  en: 'Dictionary data: JMdict and KANJIDIC2 © EDRDG (CC BY-SA 4.0). Stroke order: KanjiVG © Ulrich Apel (CC BY-SA 3.0) and animCJK © FM-SH (Arphic Public License). Pitch accents: Kanjium (CC BY-SA 4.0). Example sentences: Tatoeba (CC BY 2.0 FR).',
  ja: '辞書データ：JMdict・KANJIDIC2 © EDRDG（CC BY-SA 4.0）。書き順：KanjiVG © Ulrich Apel（CC BY-SA 3.0）、animCJK © FM-SH（Arphic Public License）。アクセント：Kanjium（CC BY-SA 4.0）。例文：Tatoeba（CC BY 2.0 FR）。',
} as const

type Props = {
  locale?: SiteLocale
  /** On the landing pages, where the page shows dictionary data: its sources and licenses. */
  credits?: boolean
}

export function SiteFooter({ locale = 'en', credits = false }: Props) {
  const t = LABELS[locale]
  const prefix = locale === 'es' ? '/es' : ''
  const [otherLabel, otherHref, otherLang] = t.other
  return (
    <footer className="border-t border-ink-100 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-ink-500">© {new Date().getFullYear()} Jisoku</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href={`${prefix}/support`} className="text-ink-600 transition hover:text-ink-900">
              {t.support}
            </Link>
            <Link href={`${prefix}/privacy`} className="text-ink-600 transition hover:text-ink-900">
              {t.privacy}
            </Link>
            <Link href={otherHref} hrefLang={otherLang} lang={otherLang} className="text-ink-600 transition hover:text-ink-900">
              {otherLabel}
            </Link>
          </div>
        </div>
        {credits && locale !== 'es' && (
          <p className="mt-6 border-t border-ink-100 pt-6 text-xs leading-relaxed text-ink-500">{CREDITS[locale]}</p>
        )}
      </div>
    </footer>
  )
}
