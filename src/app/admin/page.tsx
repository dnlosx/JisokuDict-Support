import { and, desc, eq, type SQL } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { SignOutButton } from '@/components/SignOutButton'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TicketCategoryBadge, TicketStatusBadge, TicketVisibilityBadge } from '@/components/TicketBadges'
import { db } from '@/db'
import { tickets } from '@/db/schema'
import { isAdmin } from '@/lib/auth/cookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin - JisokuDict Support',
  robots: { index: false, follow: false },
}

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'] as const
type StatusFilter = (typeof STATUSES)[number] | 'all'

const FMT = new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' })

type Props = {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminPage({ searchParams }: Props) {
  if (!(await isAdmin())) {
    redirect('/admin/auth')
  }

  const { status: statusParam } = await searchParams
  const filter: StatusFilter =
    statusParam && (STATUSES as readonly string[]).includes(statusParam)
      ? (statusParam as StatusFilter)
      : 'all'

  const conditions: SQL[] = []
  if (filter !== 'all') {
    conditions.push(eq(tickets.status, filter))
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

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-ink-900">Admin</h1>
            <SignOutButton />
          </div>

          <nav className="flex flex-wrap items-center gap-2 mb-6 text-sm">
            <FilterTab label="All" href="/admin" active={filter === 'all'} />
            {STATUSES.map((s) => (
              <FilterTab
                key={s}
                label={s.replace('_', ' ')}
                href={`/admin?status=${s}`}
                active={filter === s}
              />
            ))}
          </nav>

          {rows.length === 0 ? (
            <p className="text-ink-500 text-center py-12">No tickets match this filter.</p>
          ) : (
            <div className="overflow-hidden border border-ink-100 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 text-ink-700 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">Title</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Category</th>
                    <th className="px-4 py-2 font-medium">Author</th>
                    <th className="px-4 py-2 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {rows.map((t) => (
                    <tr key={t.publicId} className="hover:bg-ink-50/40">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/tickets/${t.publicId}`}
                          className="text-ink-900 hover:text-sakura-700 transition font-medium"
                        >
                          {t.title}
                        </Link>
                        {t.visibility === 'public' ? (
                          <span className="ml-2 align-middle">
                            <TicketVisibilityBadge visibility={t.visibility} />
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <TicketStatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3">
                        <TicketCategoryBadge category={t.category} />
                      </td>
                      <td className="px-4 py-3 text-ink-900">{t.authorUsername}</td>
                      <td className="px-4 py-3 text-ink-600 text-xs whitespace-nowrap">
                        {FMT.format(new Date(t.updatedAt))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function FilterTab({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'px-3 py-1 rounded-full bg-ink-900 text-white capitalize'
          : 'px-3 py-1 rounded-full bg-ink-50 text-ink-700 hover:bg-ink-100 transition capitalize'
      }
    >
      {label}
    </Link>
  )
}
