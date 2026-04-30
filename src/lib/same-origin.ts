import type { NextRequest } from 'next/server'

/**
 * CSRF defense: ensure the request's Origin header matches the request's host.
 * Returns true if the request is same-origin or if no Origin header is provided
 * but Sec-Fetch-Site indicates same-origin (some clients omit Origin on GET, but
 * we only call this from mutating handlers).
 */
export function requireSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (!host) return false

  if (!origin) {
    // Some non-browser clients omit Origin. Allow only if Sec-Fetch-Site is same-origin.
    const fetchSite = req.headers.get('sec-fetch-site')
    return fetchSite === 'same-origin'
  }

  try {
    const originUrl = new URL(origin)
    return originUrl.host === host
  } catch {
    return false
  }
}

export function getClientIp(req: NextRequest): string | undefined {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || undefined
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return undefined
}
