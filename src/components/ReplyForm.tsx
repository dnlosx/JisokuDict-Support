'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  endpoint: string
}

export function ReplyForm({ endpoint }: Props) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    if (!body.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/support/auth?next=${encodeURIComponent(window.location.pathname)}`)
          return
        }
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setError(data?.error ?? 'Failed to send.')
        setSubmitting(false)
        return
      }
      setBody('')
      setSubmitting(false)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" aria-busy={submitting}>
      <label htmlFor="reply-body" className="block text-sm font-medium text-ink-700">
        Reply
      </label>
      <textarea
        id="reply-body"
        required
        minLength={1}
        maxLength={8 * 1024}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        className="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 font-mono text-sm"
        placeholder="Markdown supported. Images must use HTTPS URLs."
      />
      {error && (
        <p className="text-sm text-sakura-700" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting || !body.trim()}
        className="bg-ink-900 text-white px-5 py-2 rounded-lg hover:bg-ink-700 transition disabled:bg-ink-300 disabled:cursor-not-allowed"
      >
        {submitting ? 'Sending…' : 'Send reply'}
      </button>
    </form>
  )
}
