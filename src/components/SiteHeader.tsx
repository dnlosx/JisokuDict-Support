import Link from 'next/link'

import { localePath, type TranslatedPath } from '@/lib/i18n'
import { APP_STORE_URLS, type SiteLocale } from '@/lib/site'

export const APP_STORE_URL = APP_STORE_URLS.en

const LABELS = {
  en: { home: '/', features: 'Features', support: 'Support', privacy: 'Privacy', download: 'Get the app' },
  ja: { home: '/ja', features: '機能', support: 'サポート', privacy: 'プライバシー', download: 'アプリを入手' },
  es: { home: '/', features: '', support: 'Soporte', privacy: 'Privacidad', download: 'Descargar' },
} as const

type Props = {
  active?: 'support' | 'privacy'
  locale?: SiteLocale
  /** The current page's path when it also exists in Spanish; shows a language switch. */
  translatedPath?: TranslatedPath
  /** On the landing pages: link to the page's own sections and to its other language. */
  landing?: boolean
}

export function SiteHeader({ active, locale = 'en', translatedPath, landing = false }: Props) {
  const t = LABELS[locale]
  // Support and privacy exist in English and Spanish; Japanese visitors get the English pages.
  const prefix = locale === 'es' ? '/es' : ''
  const linkClass = (name: Props['active']) =>
    active === name ? 'text-ink-900 font-medium' : 'text-ink-600 hover:text-ink-900 transition'

  return (
    <header className="sticky top-0 z-30 border-b border-ink-900/5 bg-white/80 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16">
        <Link href={t.home} className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight text-ink-900">
          <img src="/app-icon.png" alt="" width={32} height={32} className="rounded-[9px] shadow-sm" />
          Jisoku
        </Link>
        <div className="flex items-center gap-4 text-sm sm:gap-7">
          {landing && (
            <a href="#features" className="hidden text-ink-600 transition hover:text-ink-900 sm:inline">
              {t.features}
            </a>
          )}
          <Link
            href={`${prefix}/support`}
            className={`${linkClass('support')} ${landing ? 'hidden sm:inline' : ''}`}
            aria-current={active === 'support' ? 'page' : undefined}
          >
            {t.support}
          </Link>
          <Link
            href={`${prefix}/privacy`}
            className={`${linkClass('privacy')} ${landing ? 'hidden sm:inline' : ''}`}
            aria-current={active === 'privacy' ? 'page' : undefined}
          >
            {t.privacy}
          </Link>
          {translatedPath && locale !== 'ja' && (
            <Link
              href={localePath(locale === 'es' ? 'en' : 'es', translatedPath)}
              hrefLang={locale === 'es' ? 'en' : 'es'}
              lang={locale === 'es' ? 'en' : 'es'}
              className="text-ink-600 transition hover:text-ink-900"
            >
              {locale === 'es' ? 'English' : 'Español'}
            </Link>
          )}
          {landing && (
            <Link
              href={locale === 'ja' ? '/' : '/ja'}
              hrefLang={locale === 'ja' ? 'en' : 'ja'}
              lang={locale === 'ja' ? 'en' : 'ja'}
              className="text-ink-600 transition hover:text-ink-900"
            >
              {locale === 'ja' ? 'English' : '日本語'}
            </Link>
          )}
          <a
            href={APP_STORE_URLS[locale]}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full bg-ink-900 px-4 py-2 font-semibold text-white transition hover:bg-ink-700 ${landing ? '' : 'hidden sm:inline-flex'}`}
          >
            {t.download}
          </a>
        </div>
      </nav>
    </header>
  )
}
