import { NextRequest, NextResponse } from 'next/server'

import { banIp, isBanned, isProbePath } from '@/lib/ip-ban'

// User agents are self-reported: this filters known bots, not disguised traffic.
const searchCrawler = /(?:^|[\s;(])(?:Googlebot(?:-Image|-Video|-News)?|bingbot|DuckDuckBot)(?:[\/\s;)]|$)/i
const adsCrawler = /(?:^|[\s;(])Google-adstxt(?:[\/\s;)]|$)/i
const knownBot = /bot|spider|crawler|slurp|scrapy|headlesschrome|facebookexternalhit|facebot|meta-externalagent|meta-externalfetcher|bytespider|censysinspect|netcraft|palo alto networks|visionheight\.com\/scan|python-requests|python-urllib|go-http-client|curl\/|wget\/|googleother|google-adstxt|mediapartners-google|adsbot-google|google-inspectiontool|google-storebot|sellers\.json/i

const LEGACY_HOST = 'jisoku.sukoshi.net'
const CANONICAL_HOST = 'jisoku.app'

function forbidden() {
  return new NextResponse('Forbidden', {
    status: 403,
    headers: { 'Cache-Control': 'private, no-store', Vary: 'User-Agent' },
  })
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Railway's edge sets X-Real-IP; X-Forwarded-For is client-controllable, so a
  // ban keyed on it could be aimed at someone else's IP. No header (local dev) = no bans.
  const ip = request.headers.get('x-real-ip')?.trim()
  if (ip) {
    if (isProbePath(path)) {
      banIp(ip, path)
      return forbidden()
    }
    if (isBanned(ip)) return forbidden()
  }

  // The site moved to jisoku.app. app-ads.txt stays on the old host for AdMob, and
  // /api stays so callers with the old URL (the digest job) aren't broken by a
  // cross-origin redirect dropping their Authorization header.
  if (
    request.headers.get('host') === LEGACY_HOST &&
    path !== '/app-ads.txt' &&
    !path.startsWith('/api/')
  ) {
    return NextResponse.redirect(`https://${CANONICAL_HOST}${path}${request.nextUrl.search}`, 308)
  }

  // Even blocked crawlers need to be able to read the crawl policy.
  if (path === '/robots.txt') return NextResponse.next()

  const ua = request.headers.get('user-agent') ?? ''
  if (searchCrawler.test(ua)) return NextResponse.next()
  if (path === '/app-ads.txt' && adsCrawler.test(ua)) return NextResponse.next()

  if (knownBot.test(ua)) return forbidden()

  return NextResponse.next()
}

// Node runtime so the ban list can be read from SQLite.
export const config = { matcher: '/:path*', runtime: 'nodejs' }
