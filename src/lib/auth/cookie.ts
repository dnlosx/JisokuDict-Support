import { createHmac, timingSafeEqual } from 'crypto'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

import { db } from '@/db'
import { userTokens } from '@/db/schema'
import { hashToken } from './tokens'

// ----------------------------------------------------------------------------
// User identity (anonymous): raw token in HTTP-only cookie, sha256 hash in DB
// ----------------------------------------------------------------------------

export const USER_COOKIE = 'jsk_user'
const USER_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 365 * 5 // 5 years

const cookieFlags = {
  httpOnly: true as const,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export function setUserCookie(res: NextResponse, rawToken: string) {
  res.cookies.set(USER_COOKIE, rawToken, {
    ...cookieFlags,
    maxAge: USER_COOKIE_TTL_SECONDS,
  })
}

export function clearUserCookie(res: NextResponse) {
  res.cookies.set(USER_COOKIE, '', { ...cookieFlags, maxAge: 0 })
}

export async function getUserToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(USER_COOKIE)?.value ?? null
}

export async function getUserTokenRecord(): Promise<{ id: string } | null> {
  const raw = await getUserToken()
  if (!raw) return null
  const [row] = await db
    .select({ id: userTokens.id })
    .from(userTokens)
    .where(eq(userTokens.tokenHash, hashToken(raw)))
    .limit(1)
  if (!row) return null
  // best-effort last_seen_at update; do not block on failure
  void db
    .update(userTokens)
    .set({ lastSeenAt: new Date() })
    .where(eq(userTokens.id, row.id))
    .catch(() => undefined)
  return row
}

// ----------------------------------------------------------------------------
// Admin identity: HMAC-signed cookie minted after password gate
// ----------------------------------------------------------------------------

export const ADMIN_COOKIE = 'jsk_admin'
const ADMIN_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days

type AdminPayload = { role: 'admin'; iat: number; exp: number }

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set and at least 32 characters long')
  }
  return secret
}

function base64urlEncode(s: string): string {
  return Buffer.from(s).toString('base64url')
}

function base64urlDecode(s: string): string {
  return Buffer.from(s, 'base64url').toString('utf8')
}

function hmac(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function signAdminCookie(ttlSeconds = ADMIN_COOKIE_TTL_SECONDS): string {
  const now = Math.floor(Date.now() / 1000)
  const payload: AdminPayload = { role: 'admin', iat: now, exp: now + ttlSeconds }
  const payloadB64 = base64urlEncode(JSON.stringify(payload))
  return `${payloadB64}.${hmac(payloadB64)}`
}

export function verifyAdminCookie(token: string | undefined | null): boolean {
  if (!token) return false
  const dot = token.indexOf('.')
  if (dot < 0) return false
  const payloadB64 = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = hmac(payloadB64)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  try {
    const payload = JSON.parse(base64urlDecode(payloadB64)) as AdminPayload
    if (payload.role !== 'admin') return false
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

export function setAdminCookie(res: NextResponse, token: string, ttlSeconds = ADMIN_COOKIE_TTL_SECONDS) {
  res.cookies.set(ADMIN_COOKIE, token, { ...cookieFlags, maxAge: ttlSeconds })
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.set(ADMIN_COOKIE, '', { ...cookieFlags, maxAge: 0 })
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return verifyAdminCookie(store.get(ADMIN_COOKIE)?.value)
}

export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_SECRET
  if (!expected || expected.length === 0) return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
