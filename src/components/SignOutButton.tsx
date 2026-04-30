'use client'

import { useState } from 'react'

export function SignOutButton() {
  const [busy, setBusy] = useState(false)

  async function onClick() {
    if (busy) return
    setBusy(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      window.location.href = '/admin/auth'
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="text-sm text-ink-600 hover:text-ink-900 transition disabled:text-ink-300"
    >
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
