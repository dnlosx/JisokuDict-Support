import Link from 'next/link'

import { TicketCategoryBadge, TicketStatusBadge, TicketVisibilityBadge } from './TicketBadges'

type Props = {
  href: string
  title: string
  category: 'bug' | 'feature' | 'account' | 'other'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  visibility: 'private' | 'public'
  updatedAt: Date
}

const RELATIVE = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

function formatRelative(d: Date): string {
  const diffMs = d.getTime() - Date.now()
  const diffMin = Math.round(diffMs / (60 * 1000))
  const diffH = Math.round(diffMs / (3600 * 1000))
  const diffD = Math.round(diffMs / (86400 * 1000))
  if (Math.abs(diffMin) < 60) return RELATIVE.format(diffMin, 'minute')
  if (Math.abs(diffH) < 24) return RELATIVE.format(diffH, 'hour')
  return RELATIVE.format(diffD, 'day')
}

export function TicketCard({ href, title, category, status, visibility, updatedAt }: Props) {
  return (
    <Link
      href={href}
      className="block border border-ink-100 rounded-lg p-4 hover:border-sakura-300 hover:bg-ink-50/50 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-medium text-ink-900 line-clamp-2">{title}</h3>
        <span className="text-xs text-ink-500 shrink-0">{formatRelative(new Date(updatedAt))}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TicketStatusBadge status={status} />
        <TicketCategoryBadge category={category} />
        <TicketVisibilityBadge visibility={visibility} />
      </div>
    </Link>
  )
}
