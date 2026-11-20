import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const landing = { en: SITE_URL, ja: `${SITE_URL}/ja`, 'x-default': SITE_URL }
  const translated = (path: string) => ({ en: `${SITE_URL}${path}`, es: `${SITE_URL}/es${path}` })
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1, alternates: { languages: landing } },
    { url: `${SITE_URL}/ja`, changeFrequency: 'monthly', priority: 1, alternates: { languages: landing } },
    { url: `${SITE_URL}/support`, changeFrequency: 'monthly', priority: 0.6, alternates: { languages: translated('/support') } },
    { url: `${SITE_URL}/es/support`, changeFrequency: 'monthly', priority: 0.5, alternates: { languages: translated('/support') } },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3, alternates: { languages: translated('/privacy') } },
    { url: `${SITE_URL}/es/privacy`, changeFrequency: 'yearly', priority: 0.3, alternates: { languages: translated('/privacy') } },
  ]
}
