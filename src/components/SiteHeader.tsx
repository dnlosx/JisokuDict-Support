import Link from 'next/link'

import { localePath, type Locale, type TranslatedPath } from '@/lib/i18n'

export const APP_STORE_URL = 'https://apps.apple.com/us/app/jisokudict/id6757970596'
const APP_STORE_URL_MX = 'https://apps.apple.com/mx/app/jisokudict/id6757970596'

const LABELS = {
  en: { support: 'Support', privacy: 'Privacy', download: 'Download', switchTo: 'Español', switchLang: 'es' },
  es: { support: 'Soporte', privacy: 'Privacidad', download: 'Descargar', switchTo: 'English', switchLang: 'en' },
} as const

type Props = {
  active?: 'support' | 'privacy'
  locale?: Locale
  /** The current page's path when it also exists in the other language; shows a language switch. */
  translatedPath?: TranslatedPath
}

export function SiteHeader({ active, locale = 'en', translatedPath }: Props) {
  const t = LABELS[locale]
  const prefix = locale === 'es' ? '/es' : ''
  const linkClass = (name: Props['active']) =>
    active === name
      ? 'text-ink-900 font-medium'
      : 'text-ink-500 hover:text-ink-900 transition'

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/80 bg-white/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-ink-900 font-semibold tracking-tight">
          <img src="/app-icon.png" alt="" width={32} height={32} className="rounded-[9px] shadow-sm" />
          JisokuDict
        </Link>
        <div className="flex items-center gap-5 sm:gap-7 text-sm">
          <Link href={`${prefix}/support`} className={linkClass('support')} aria-current={active === 'support' ? 'page' : undefined}>
            {t.support}
          </Link>
          <Link href={`${prefix}/privacy`} className={linkClass('privacy')} aria-current={active === 'privacy' ? 'page' : undefined}>
            {t.privacy}
          </Link>
          {translatedPath && (
            <Link
              href={localePath(t.switchLang, translatedPath)}
              hrefLang={t.switchLang}
              lang={t.switchLang}
              className="text-ink-500 hover:text-ink-900 transition"
            >
              {t.switchTo}
            </Link>
          )}
          <a
            href={locale === 'es' ? APP_STORE_URL_MX : APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex bg-ink-900 text-white px-4 py-2 rounded-full hover:bg-ink-700 transition"
          >
            {t.download}
          </a>
        </div>
      </nav>
    </header>
  )
}
