import { count, desc, isNotNull, isNull } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { SignOutButton } from '@/components/SignOutButton'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { db } from '@/db'
import { type Feedback, feedback } from '@/db/schema'
import { isAdmin } from '@/lib/auth/cookie'

import { HandledToggle } from './HandledToggle'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Inbox - JisokuDict Support',
  robots: { index: false, follow: false },
}

const FILTERS = ['new', 'handled', 'all'] as const
type Filter = (typeof FILTERS)[number]

const TOPIC_LABELS: Record<Feedback['topic'], string> = {
  bug: 'Bug',
  feature: 'Idea',
  purchase: 'Purchase',
  question: 'Question',
  other: 'Other',
}

const TOPIC_STYLES: Record<Feedback['topic'], string> = {
  bug: 'bg-sakura-50 text-sakura-700 ring-sakura-200',
  feature: 'bg-ai-50 text-ai-700 ring-ai-200',
  purchase: 'bg-amber-50 text-amber-800 ring-amber-200',
  question: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  other: 'bg-ink-50 text-ink-700 ring-ink-200',
}

const FMT = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })

type Props = {
  searchParams: Promise<{ filter?: string }>
}

export default async function AdminPage({ searchParams }: Props) {
  if (!(await isAdmin())) {
    redirect('/admin/auth')
  }

  const { filter: filterParam } = await searchParams
  const filter: Filter = (FILTERS as readonly string[]).includes(filterParam ?? '')
    ? (filterParam as Filter)
    : 'new'

  const where =
    filter === 'new' ? isNull(feedback.handledAt) : filter === 'handled' ? isNotNull(feedback.handledAt) : undefined

  const [rows, [{ value: newCount }]] = await Promise.all([
    db.select().from(feedback).where(where).orderBy(desc(feedback.createdAt)).limit(200),
    db.select({ value: count() }).from(feedback).where(isNull(feedback.handledAt)),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-ink-50/50">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink-900">Inbox</h1>
              <p className="mt-1 text-sm text-ink-500">
                {newCount === 0 ? 'All caught up.' : `${newCount} new ${newCount === 1 ? 'message' : 'messages'}`}
              </p>
            </div>
            <SignOutButton />
          </div>

          <nav className="mb-6 inline-flex rounded-full border border-ink-200 bg-white p-1 text-sm">
            {FILTERS.map((f) => (
              <Link
                key={f}
                href={f === 'new' ? '/admin' : `/admin?filter=${f}`}
                className={
                  filter === f
                    ? 'rounded-full bg-ink-900 px-4 py-1.5 capitalize text-white'
                    : 'rounded-full px-4 py-1.5 capitalize text-ink-600 transition hover:text-ink-900'
                }
              >
                {f}
              </Link>
            ))}
          </nav>

          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-center text-ink-500">
              {filter === 'new' ? 'No new messages.' : 'Nothing here yet.'}
            </div>
          ) : (
            <ul className="space-y-3">
              {rows.map((f) => (
                <li
                  key={f.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm ${f.handledAt ? 'border-ink-100 opacity-70' : 'border-ink-200'}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${TOPIC_STYLES[f.topic]}`}>
                        {TOPIC_LABELS[f.topic]}
                      </span>
                      <time dateTime={f.createdAt.toISOString()} className="text-xs text-ink-500">
                        {FMT.format(f.createdAt)}
                      </time>
                    </div>
                    <HandledToggle id={f.id} handled={f.handledAt !== null} />
                  </div>

                  <p className="mt-4 whitespace-pre-wrap break-words text-ink-800 leading-relaxed">{f.message}</p>

                  {(f.email || f.device || f.appVersion) && (
                    <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-ink-100 pt-3 text-xs text-ink-500">
                      {f.email && (
                        <div className="flex gap-1.5">
                          <dt>Email</dt>
                          <dd>
                            <a href={`mailto:${f.email}?subject=${encodeURIComponent('Re: your JisokuDict message')}`} className="link">
                              {f.email}
                            </a>
                          </dd>
                        </div>
                      )}
                      {f.device && (
                        <div className="flex gap-1.5">
                          <dt>Device</dt>
                          <dd className="text-ink-700">{f.device}</dd>
                        </div>
                      )}
                      {f.appVersion && (
                        <div className="flex gap-1.5">
                          <dt>Version</dt>
                          <dd className="text-ink-700">{f.appVersion}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
