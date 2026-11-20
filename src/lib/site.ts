export const SITE_URL = 'https://jisoku.app'
export const APP_NAME = 'Jisoku'
export const APP_STORE_ID = '6757970596'

/** App Store page in the storefront that matches the page's language. */
export const APP_STORE_URLS = {
  en: `https://apps.apple.com/us/app/jisokudict/id${APP_STORE_ID}`,
  ja: `https://apps.apple.com/jp/app/jisokudict/id${APP_STORE_ID}`,
  es: `https://apps.apple.com/mx/app/jisokudict/id${APP_STORE_ID}`,
} as const

export type SiteLocale = keyof typeof APP_STORE_URLS

/** canonical + hreflang for the landing page, which exists in English and Japanese. */
export function landingAlternates(locale: 'en' | 'ja') {
  return {
    canonical: locale === 'ja' ? `${SITE_URL}/ja` : SITE_URL,
    languages: { en: SITE_URL, ja: `${SITE_URL}/ja`, 'x-default': SITE_URL },
  }
}
