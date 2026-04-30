import { and, desc, eq, type SQL } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TicketCategoryBadge } from '@/components/TicketBadges'
import { db } from '@/db'
import { tickets } from '@/db/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Public Q&A - JisokuDict Support',
  description: 'Browse answers to common questions about JisokuDict, the Japanese-English dictionary for iOS and macOS.',
}

const CATEGORIES = ['bug', 'feature', 'account', 'other'] as const
type Category = (typeof CATEGORIES)[number]
type Filter = Category | 'all'

const PAGE_SIZE = 20
const FMT = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

type Props = {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function PublicKBPage({ searchParams }: Props) {
  const params = await searchParams
  const filter: Filter =
    params.category && (CATEGORIES as readonly string[]).includes(params.category)
      ? (params.category as Filter)
      : 'all'

  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const conditions: SQL[] = [eq(tickets.visibility, 'public')]
  if (filter !== 'all') conditions.push(eq(tickets.category, filter))

  const rows = await db
    .select({
      publicId: tickets.publicId,
      title: tickets.title,
      category: tickets.category,
      authorUsername: tickets.authorUsername,
      publishedAt: tickets.publishedAt,
    })
    .from(tickets)
    .where(and(...conditions))
    .orderBy(desc(tickets.publishedAt))
    .limit(PAGE_SIZE + 1)
    .offset(offset)

  const hasNext = rows.length > PAGE_SIZE
  const items = hasNext ? rows.slice(0, PAGE_SIZE) : rows

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">Public Q&amp;A</h1>
          <p className="text-ink-600 mb-8">
            Resolved tickets we&apos;ve published. Looking for help?{' '}
            <Link href="/support/tickets/new" className="text-sakura-600 hover:text-sakura-700 underline">
              Submit a new ticket
            </Link>
            .
          </p>

          <nav className="flex flex-wrap items-center gap-2 mb-6 text-sm">
            <CategoryTab label="All" href="/support/public" active={filter === 'all'} />
            <CategoryTab label="Bug" href="/support/public?category=bug" active={filter === 'bug'} />
            <CategoryTab
              label="Feature request"
              href="/support/public?category=feature"
              active={filter === 'feature'}
            />
            <CategoryTab
              label="Account"
              href="/support/public?category=account"
              active={filter === 'account'}
            />
            <CategoryTab
              label="Other"
              href="/support/public?category=other"
              active={filter === 'other'}
            />
          </nav>

          {items.length === 0 ? (
            <p className="text-ink-500 text-center py-12">No published Q&amp;A yet.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((t) => (
                <li
                  key={t.publicId}
                  className="border border-ink-100 rounded-lg p-4 hover:border-sakura-300 hover:bg-ink-50/50 transition"
                >
                  <Link href={`/support/public/${t.publicId}`} className="block">
                    <h2 className="text-lg font-medium text-ink-900 mb-2">{t.title}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
                      <TicketCategoryBadge category={t.category} />
                      <span>by {t.authorUsername}</span>
                      {t.publishedAt ? <span>· {FMT.format(new Date(t.publishedAt))}</span> : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {(page > 1 || hasNext) && (
            <div className="mt-8 flex items-center justify-between">
              {page > 1 ? (
                <Link
                  href={buildHref(filter, page - 1)}
                  className="text-sm text-ink-600 hover:text-ink-900 transition"
                >
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              {hasNext ? (
                <Link
                  href={buildHref(filter, page + 1)}
                  className="text-sm text-ink-600 hover:text-ink-900 transition"
                >
                  Next →
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function CategoryTab({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'px-3 py-1 rounded-full bg-ink-900 text-white'
          : 'px-3 py-1 rounded-full bg-ink-50 text-ink-700 hover:bg-ink-100 transition'
      }
    >
      {label}
    </Link>
  )
}

function buildHref(filter: Filter, page: number): string {
  const params = new URLSearchParams()
  if (filter !== 'all') params.set('category', filter)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/support/public?${qs}` : '/support/public'
}
