import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    // The demo's data and the screenshots only change with a deploy; let
    // browsers keep them for a day instead of revalidating on every visit.
    const cache = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }]
    return [
      { source: '/demo/:path*', headers: cache },
      { source: '/shots/:path*', headers: cache },
      { source: '/og/:path*', headers: cache },
    ]
  },
  async redirects() {
    // The old ticket system (threads, public KB, recovery links) was replaced by
    // a one-way contact form; send bookmarked links to the support page.
    return [
      { source: '/support/tickets/:path*', destination: '/support#contact', permanent: true },
      { source: '/support/public/:path*', destination: '/support', permanent: true },
      { source: '/admin/tickets/:path*', destination: '/admin', permanent: false },
      // No Spanish landing page yet; temporary so one can take over /es later.
      { source: '/es', destination: '/es/support', permanent: false },
    ]
  },
}

export default nextConfig
