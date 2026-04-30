type Status = 'open' | 'in_progress' | 'resolved' | 'closed'
type Category = 'bug' | 'feature' | 'account' | 'other'
type Visibility = 'private' | 'public'

const STATUS_LABELS: Record<Status, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

const STATUS_CLASSES: Record<Status, string> = {
  open: 'bg-sakura-100 text-sakura-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-ink-100 text-ink-600',
}

const CATEGORY_LABELS: Record<Category, string> = {
  bug: 'Bug',
  feature: 'Feature request',
  account: 'Account',
  other: 'Other',
}

export function TicketStatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${STATUS_CLASSES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function TicketCategoryBadge({ category }: { category: Category }) {
  return (
    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-ink-100 text-ink-700">
      {CATEGORY_LABELS[category]}
    </span>
  )
}

export function TicketVisibilityBadge({ visibility }: { visibility: Visibility }) {
  if (visibility === 'private') return null
  return (
    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
      Public
    </span>
  )
}
