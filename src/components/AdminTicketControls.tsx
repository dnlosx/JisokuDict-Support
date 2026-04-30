'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Status = 'open' | 'in_progress' | 'resolved' | 'closed'
type Visibility = 'private' | 'public'

type Props = {
  slug: string
  status: Status
  visibility: Visibility
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

export function AdminTicketControls({ slug, status, visibility }: Props) {
  const router = useRouter()
  const [pending, setPending] = useState<'status' | 'visibility' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function patch(payload: { status?: Status; visibility?: Visibility }, kind: 'status' | 'visibility') {
    setPending(kind)
    setError(null)
    try {
      const res = await fetch(`/api/admin/tickets/${slug}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        setError('Update failed')
        return
      }
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="rounded-lg border border-ink-100 bg-ink-50/50 p-4 space-y-3">
      <h2 className="text-sm font-semibold text-ink-900">Admin controls</h2>

      <div className="flex items-center gap-3">
        <label htmlFor="status" className="text-sm text-ink-700 w-20">
          Status
        </label>
        <select
          id="status"
          value={status}
          disabled={pending === 'status'}
          onChange={(e) => patch({ status: e.target.value as Status }, 'status')}
          className="flex-1 px-3 py-1.5 border border-ink-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-700 w-20">Visibility</span>
        <button
          type="button"
          disabled={pending === 'visibility'}
          onClick={() =>
            patch(
              { visibility: visibility === 'public' ? 'private' : 'public' },
              'visibility'
            )
          }
          className={
            visibility === 'public'
              ? 'flex-1 text-sm px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md hover:bg-emerald-200 transition'
              : 'flex-1 text-sm px-3 py-1.5 bg-white border border-ink-200 text-ink-700 rounded-md hover:bg-ink-50 transition'
          }
        >
          {visibility === 'public' ? 'Public — click to make private' : 'Private — click to publish'}
        </button>
      </div>

      {error ? <p className="text-sm text-sakura-700">{error}</p> : null}
    </div>
  )
}
