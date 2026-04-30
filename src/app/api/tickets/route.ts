import { desc, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { ticketMessages, tickets, userTokens } from '@/db/schema'
import {
  getUserToken,
  getUserTokenRecord,
  setUserCookie,
} from '@/lib/auth/cookie'
import { generateUserToken } from '@/lib/auth/tokens'
import { checkAndIncrement } from '@/lib/rate-limit'
import { getClientIp, requireSameOrigin } from '@/lib/same-origin'
import { generateTicketSlug } from '@/lib/slug'
import { verifyTurnstile } from '@/lib/turnstile'
import { createTicketSchema } from '@/lib/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const owner = await getUserTokenRecord()
  if (!owner) {
    return NextResponse.json({ tickets: [] })
  }
  const rows = await db
    .select({
      publicId: tickets.publicId,
      title: tickets.title,
      category: tickets.category,
      status: tickets.status,
      visibility: tickets.visibility,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
    })
    .from(tickets)
    .where(eq(tickets.userTokenId, owner.id))
    .orderBy(desc(tickets.updatedAt))
    .limit(100)

  return NextResponse.json({ tickets: rows })
}

export async function POST(req: NextRequest) {
  if (!requireSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const ipBucket = await checkAndIncrement(`ip:${ip ?? 'unknown'}:ticket_create`, 10, 3600)
  if (!ipBucket.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = createTicketSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { title, category, body: messageBody, username, turnstileToken } = parsed.data

  const captchaOk = await verifyTurnstile(turnstileToken, ip)
  if (!captchaOk) {
    return NextResponse.json({ error: 'captcha_failed' }, { status: 400 })
  }

  // Resolve or create the user identity.
  const existingToken = await getUserToken()
  let userTokenId: string | null = null
  let issuedRawToken: string | null = null

  if (existingToken) {
    const existing = await getUserTokenRecord()
    if (existing) userTokenId = existing.id
  }

  if (!userTokenId) {
    const { raw, hash } = generateUserToken()
    const [created] = await db
      .insert(userTokens)
      .values({ tokenHash: hash })
      .returning({ id: userTokens.id })
    userTokenId = created.id
    issuedRawToken = raw
  }

  // Username rule: reuse the most recent username for this user_token if any.
  const recent = await db
    .select({ authorUsername: tickets.authorUsername })
    .from(tickets)
    .where(eq(tickets.userTokenId, userTokenId))
    .orderBy(desc(tickets.createdAt))
    .limit(1)
  const finalUsername = recent[0]?.authorUsername ?? username

  const publicId = generateTicketSlug()

  const created = db.transaction((tx) => {
    const [t] = tx
      .insert(tickets)
      .values({
        publicId,
        userTokenId: userTokenId!,
        authorUsername: finalUsername,
        title,
        category,
      })
      .returning({ id: tickets.id, publicId: tickets.publicId })
      .all()

    tx.insert(ticketMessages)
      .values({
        ticketId: t.id,
        authorRole: 'user',
        body: messageBody,
      })
      .run()

    return t
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin
  const response: { publicId: string; recoveryUrl?: string } = { publicId: created.publicId }

  if (issuedRawToken) {
    const recoveryUrl = new URL('/support/restore', siteUrl)
    recoveryUrl.searchParams.set('t', issuedRawToken)
    response.recoveryUrl = recoveryUrl.toString()
  }

  const res = NextResponse.json(response, { status: 201 })
  if (issuedRawToken) setUserCookie(res, issuedRawToken)
  return res
}
