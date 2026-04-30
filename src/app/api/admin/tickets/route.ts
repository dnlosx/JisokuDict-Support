import { and, desc, eq, type SQL } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { tickets } from '@/db/schema'
import { isAdmin } from '@/lib/auth/cookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'] as const

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const url = new URL(req.url)
  const statusParam = url.searchParams.get('status')
  const conditions: SQL[] = []
  if (statusParam && (STATUSES as readonly string[]).includes(statusParam)) {
    conditions.push(eq(tickets.status, statusParam as (typeof STATUSES)[number]))
  }

  const rows = await db
    .select({
      publicId: tickets.publicId,
      title: tickets.title,
      category: tickets.category,
      status: tickets.status,
      visibility: tickets.visibility,
      authorUsername: tickets.authorUsername,
      updatedAt: tickets.updatedAt,
    })
    .from(tickets)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(tickets.updatedAt))
    .limit(200)

  return NextResponse.json({ tickets: rows })
}
