'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminAuthForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.status === 429) {
        setError('Too many attempts. Try again in an hour.')
        setSubmitting(false)
        return
      }
      if (!res.ok) {
        setError('Wrong password.')
        setSubmitting(false)
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-busy={submitting}>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400"
        />
      </div>
      {error && (
        <p className="text-sm text-sakura-700" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting || !password}
        className="w-full bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-700 transition disabled:bg-ink-300 disabled:cursor-not-allowed"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
