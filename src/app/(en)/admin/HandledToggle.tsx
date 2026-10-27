'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function HandledToggle({ id, handled }: { id: string; handled: boolean }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function toggle() {
    setPending(true)
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ handled: !handled }),
      })
      if (res.ok) router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={
        handled
          ? 'rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-600 transition hover:border-ink-300 disabled:opacity-50'
          : 'rounded-full bg-ink-900 px-3 py-1 text-xs text-white transition hover:bg-ink-700 disabled:opacity-50'
      }
    >
      {pending ? '…' : handled ? 'Reopen' : 'Mark handled'}
    </button>
  )
}
