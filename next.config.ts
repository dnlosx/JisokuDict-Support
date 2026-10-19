import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    // The old ticket system (threads, public KB, recovery links) was replaced by
    // a one-way contact form; send bookmarked links to the support page.
    return [
      { source: '/support/tickets/:path*', destination: '/support#contact', permanent: true },
      { source: '/support/public/:path*', destination: '/support', permanent: true },
      { source: '/admin/tickets/:path*', destination: '/admin', permanent: false },
    ]
  },
}

export default nextConfig
