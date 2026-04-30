import { desc, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { ticketMessages, tickets, userTokens } from '@/db/schema'
import {
  getUserToken,
  getUserTokenRecord,
  isAdmin,
  setUserCookie,
} from '@/lib/auth/cookie'
import { generateUserToken } from '@/lib/auth/tokens'
import { checkAndIncrement } from '@/lib/rate-limit'
import { getClientIp, requireSameOrigin } from '@/lib/same-origin'
import { verifyTurnstile } from '@/lib/turnstile'
import { replyMessageSchema } from '@/lib/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, ctx: Params) {
  if (!requireSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { slug } = await ctx.params
  const [ticket] = await db.select().from(tickets).where(eq(tickets.publicId, slug)).limit(1)
  if (!ticket) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const [admin, owner, existingRawToken] = await Promise.all([
    isAdmin(),
    getUserTokenRecord(),
    getUserToken(),
  ])
  const isOwner = !!owner && owner.id === ticket.userTokenId
  const isPublic = ticket.visibility === 'public'

  // Permission gate:
  //   - admin: always allowed
  //   - ticket owner: always allowed
  //   - anyone else: only on public tickets
  if (!admin && !isOwner && !isPublic) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = replyMessageSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // Branch by replier kind. We use this to decide username, rate-limit key,
  // and whether to auto-issue a cookie + recovery URL.
  type ReplierKind = 'admin' | 'owner' | 'community'
  const kind: ReplierKind = admin ? 'admin' : isOwner ? 'owner' : 'community'

  let userTokenId: string | null = owner?.id ?? null
  let issuedRawToken: string | null = null
  let username = ''

  if (kind === 'community') {
    // Community replies on public tickets must include a username.
    if (!parsed.data.username) {
      return NextResponse.json(
        { error: 'invalid_input', details: { fieldErrors: { username: ['Required'] } } },
        { status: 400 }
      )
    }
    username = parsed.data.username

    // First-time poster (no cookie) must pass Turnstile; subsequent posts skip it.
    if (!existingRawToken || !owner) {
      if (!parsed.data.turnstileToken) {
        return NextResponse.json({ error: 'captcha_required' }, { status: 400 })
      }
      const ok = await verifyTurnstile(parsed.data.turnstileToken, getClientIp(req))
      if (!ok) {
        return NextResponse.json({ error: 'captcha_failed' }, { status: 400 })
      }

      const { raw, hash } = generateUserToken()
      const [created] = await db
        .insert(userTokens)
        .values({ tokenHash: hash })
        .returning({ id: userTokens.id })
      userTokenId = created.id
      issuedRawToken = raw
    }
  } else if (kind === 'owner') {
    // Owner replies reuse the ticket's username for consistency, ignoring any
    // username they pass in the body.
    username = ticket.authorUsername
  }

  const rateKey =
    kind === 'admin'
      ? `admin:message_create`
      : `user:${userTokenId ?? 'unknown'}:message_create`
  const bucket = await checkAndIncrement(rateKey, 20, 3600)
  if (!bucket.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  // After auto-issuing for a community reply, prefill the username from the most
  // recent thing this cookie has authored — but only if they didn't pass one in.
  // (We always require username for community, so this is only for symmetry.)
  if (kind === 'community' && !username && userTokenId) {
    const recent = await db
      .select({ authorUsername: tickets.authorUsername })
      .from(tickets)
      .where(eq(tickets.userTokenId, userTokenId))
      .orderBy(desc(tickets.createdAt))
      .limit(1)
    username = recent[0]?.authorUsername ?? ''
  }

  db.transaction((tx) => {
    tx.insert(ticketMessages)
      .values({
        ticketId: ticket.id,
        authorRole: kind === 'admin' ? 'admin' : 'user',
        authorUsername: kind === 'admin' ? '' : username,
        body: parsed.data.body,
      })
      .run()
    tx.update(tickets)
      .set({ updatedAt: new Date() })
      .where(eq(tickets.id, ticket.id))
      .run()
  })

  const response: { ok: true; recoveryUrl?: string } = { ok: true }
  if (issuedRawToken) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin
    const recoveryUrl = new URL('/support/restore', siteUrl)
    recoveryUrl.searchParams.set('t', issuedRawToken)
    response.recoveryUrl = recoveryUrl.toString()
  }

  const res = NextResponse.json(response, { status: 201 })
  if (issuedRawToken) setUserCookie(res, issuedRawToken)
  return res
}
