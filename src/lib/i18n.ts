export type Locale = 'en' | 'es'

export const SITE_URL = 'https://jisoku.app'

// Pages that exist in Spanish. The app itself is English/Japanese only, so the
// Spanish pages translate the site, not the app's UI.
export const TRANSLATED_PATHS = ['/support', '/privacy'] as const
export type TranslatedPath = (typeof TRANSLATED_PATHS)[number]

export function localePath(locale: Locale, path: TranslatedPath): string {
  return locale === 'es' ? `/es${path}` : path
}

/** canonical + hreflang alternates for a page that exists in both languages. */
export function alternates(locale: Locale, path: TranslatedPath) {
  return {
    canonical: `${SITE_URL}${localePath(locale, path)}`,
    languages: {
      en: `${SITE_URL}${path}`,
      es: `${SITE_URL}/es${path}`,
      'x-default': `${SITE_URL}${path}`,
    },
  }
}
