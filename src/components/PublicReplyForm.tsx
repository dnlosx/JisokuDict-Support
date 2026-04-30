'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { TurnstileWidget } from './TurnstileWidget'

type Props = {
  endpoint: string
  /** True when the visitor already has a `jsk_user` cookie. Drives whether
   *  Turnstile is shown and whether the recovery URL appears on success. */
  hasCookie: boolean
  /** Pre-filled username for visitors who have already posted before. */
  defaultUsername?: string
}

export function PublicReplyForm({ endpoint, hasCookie, defaultUsername }: Props) {
  const router = useRouter()
  const [username, setUsername] = useState(defaultUsername ?? '')
  const [body, setBody] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recoveryUrl, setRecoveryUrl] = useState<string | null>(null)

  const requiresTurnstile = !hasCookie
  const ready =
    body.trim().length > 0 &&
    username.trim().length >= 2 &&
    (!requiresTurnstile || !!turnstileToken)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting || !ready) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          body,
          username,
          ...(turnstileToken ? { turnstileToken } : {}),
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        const code = data?.error
        const friendly =
          code === 'captcha_required' || code === 'captcha_failed'
            ? 'CAPTCHA failed — please try again.'
            : code === 'rate_limited'
            ? 'Too many replies. Please wait a bit and try again.'
            : code === 'invalid_input'
            ? 'Please check your username and message.'
            : 'Failed to send. Please try again.'
        setError(friendly)
        setSubmitting(false)
        return
      }
      const data = (await res.json().catch(() => null)) as
        | { ok: true; recoveryUrl?: string }
        | null
      setBody('')
      setSubmitting(false)
      if (data?.recoveryUrl) {
        setRecoveryUrl(data.recoveryUrl)
      }
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" aria-busy={submitting}>
      <div>
        <label htmlFor="reply-username" className="block text-sm font-medium text-ink-700 mb-1">
          Your name
        </label>
        <input
          id="reply-username"
          type="text"
          required
          minLength={2}
          maxLength={60}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 text-sm"
          placeholder="Display name shown publicly"
        />
      </div>

      <div>
        <label htmlFor="reply-body" className="block text-sm font-medium text-ink-700 mb-1">
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
      </div>

      {requiresTurnstile && (
        <TurnstileWidget
          onToken={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
        />
      )}

      {error && (
        <p className="text-sm text-sakura-700" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {recoveryUrl && (
        <div className="rounded-lg border border-sakura-200 bg-sakura-50/50 p-3 text-sm text-ink-700 space-y-2">
          <p>
            <strong>Bookmark this URL</strong> to keep replying from another device:
          </p>
          <code className="block break-all bg-white border border-ink-100 rounded px-2 py-1 text-xs">
            {recoveryUrl}
          </code>
          <p className="text-xs text-ink-500">
            Anyone with this link can post under your name. We can&apos;t recover it for you.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !ready}
        className="bg-ink-900 text-white px-5 py-2 rounded-lg hover:bg-ink-700 transition disabled:bg-ink-300 disabled:cursor-not-allowed"
      >
        {submitting ? 'Sending…' : 'Post reply'}
      </button>
    </form>
  )
}
