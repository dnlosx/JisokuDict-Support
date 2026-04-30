import { eq } from 'drizzle-orm'
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

  // Staff-stamping requires BOTH a valid signed admin cookie (`admin`, from
  // `isAdmin()` → HMAC verify against AUTH_SECRET) AND an explicit opt-in
  // from the form (`asAdmin: true`). The flag alone is not a credential —
  // without the cookie it's ignored. The opt-in lets an admin who also owns
  // a ticket reply as themselves from the owner form.
  const role: 'user' | 'admin' = parsed.data.asAdmin && admin ? 'admin' : 'user'

  let userTokenId: string | null = owner?.id ?? null
  let issuedRawToken: string | null = null
  let username = ''

  if (role === 'user') {
    if (typeof parsed.data.username === 'string') {
      username = parsed.data.username
    } else if (isOwner) {
      // Owner clicked the simple reply form (no username field). Reuse the
      // username they registered the ticket with.
      username = ticket.authorUsername
    } else {
      // Non-admin, non-owner with no username supplied: the form is
      // misconfigured. Surface as invalid input rather than silently dropping.
      return NextResponse.json(
        { error: 'invalid_input', details: { fieldErrors: { username: ['Required'] } } },
        { status: 400 }
      )
    }

    // Anyone replying without a `jsk_user` cookie has to pass Turnstile, after
    // which we issue them one. Subsequent posts from the same browser skip it.
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
  }

  const rateKey =
    role === 'admin'
      ? `admin:message_create`
      : `user:${userTokenId ?? 'unknown'}:message_create`
  const bucket = await checkAndIncrement(rateKey, 20, 3600)
  if (!bucket.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  db.transaction((tx) => {
    tx.insert(ticketMessages)
      .values({
        ticketId: ticket.id,
        authorRole: role,
        authorUsername: role === 'admin' ? '' : username,
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
