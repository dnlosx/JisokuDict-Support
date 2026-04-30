'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { TurnstileWidget } from '@/components/TurnstileWidget'

type Category = 'bug' | 'feature' | 'account' | 'other'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature request' },
  { value: 'account', label: 'Account' },
  { value: 'other', label: 'Other' },
]

type Props = {
  lockedUsername: string | null
}

type Success = {
  publicId: string
  recoveryUrl?: string
}

export function NewTicketForm({ lockedUsername }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('bug')
  const [body, setBody] = useState('')
  const [username, setUsername] = useState(lockedUsername ?? '')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Success | null>(null)
  const [copied, setCopied] = useState(false)

  const onTurnstileToken = useCallback((token: string) => setTurnstileToken(token), [])
  const onTurnstileExpire = useCallback(() => setTurnstileToken(null), [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    if (!turnstileToken) {
      setError('Please complete the bot check.')
      return
    }
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title, category, body, username, turnstileToken }),
      })

      if (res.status === 429) {
        setError('Too many submissions. Please wait an hour.')
        setSubmitting(false)
        return
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setError(humanizeError(data?.error))
        setSubmitting(false)
        return
      }
      const data = (await res.json()) as Success
      setSuccess(data)
      setSubmitting(false)
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h2 className="text-lg font-semibold text-emerald-900 mb-1">Ticket submitted</h2>
          <p className="text-sm text-emerald-800">
            We&apos;ll respond here. You can come back any time to add more details.
          </p>
        </div>

        {success.recoveryUrl && (
          <div className="rounded-lg border border-sakura-200 bg-sakura-50/60 p-4">
            <h3 className="font-semibold text-ink-900 mb-2">Save this recovery URL</h3>
            <p className="text-sm text-ink-700 mb-3">
              Bookmark this URL to access your tickets from another device or browser.
              <strong> We don&apos;t store your email and can&apos;t recover this link for you</strong> —
              keep it private and somewhere safe.
            </p>
            <div className="flex items-stretch gap-2">
              <input
                readOnly
                value={success.recoveryUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 px-3 py-2 border border-sakura-300 rounded-lg font-mono text-xs bg-white"
              />
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(success.recoveryUrl!)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1800)
                }}
                className="shrink-0 px-3 py-2 bg-sakura-500 text-white text-sm rounded-lg hover:bg-sakura-600 transition"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/support/tickets/${success.publicId}`}
            onClick={() => router.refresh()}
            className="bg-ink-900 text-white px-5 py-2 rounded-lg hover:bg-ink-700 transition"
          >
            Open ticket →
          </Link>
          <Link
            href="/support/tickets"
            className="px-5 py-2 border border-ink-200 text-ink-700 rounded-lg hover:bg-ink-50 transition"
          >
            All my tickets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-busy={submitting}>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ink-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          minLength={3}
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400"
          placeholder="Brief summary"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-ink-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-ink-700 mb-1">
          Display name
        </label>
        <input
          id="username"
          type="text"
          required
          minLength={2}
          maxLength={60}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={lockedUsername !== null}
          className="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 disabled:bg-ink-50 disabled:text-ink-500"
          placeholder="What others should call you"
        />
        <p className="mt-1 text-xs text-ink-500">
          {lockedUsername
            ? 'Your display name is fixed across tickets. Shown only if a ticket is published.'
            : 'Shown only if a ticket is published to the public knowledge base.'}
        </p>
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-ink-700 mb-1">
          Description
        </label>
        <textarea
          id="body"
          required
          minLength={1}
          maxLength={8 * 1024}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 font-mono text-sm"
          placeholder="Describe the issue, steps to reproduce, device, app version, etc.&#10;&#10;Markdown is supported. To attach a screenshot, upload it elsewhere and link to it: ![alt](https://...)."
        />
        <p className="mt-1 text-xs text-ink-500">Markdown supported. Images must use HTTPS URLs.</p>
      </div>

      <TurnstileWidget onToken={onTurnstileToken} onExpire={onTurnstileExpire} />

      {error && (
        <p className="text-sm text-sakura-700" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !turnstileToken}
        className="bg-ink-900 text-white px-5 py-2 rounded-lg hover:bg-ink-700 transition disabled:bg-ink-300 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting…' : 'Submit ticket'}
      </button>
    </form>
  )
}

function humanizeError(code: string | undefined): string {
  switch (code) {
    case 'invalid_input':
      return 'Please check the form for errors.'
    case 'captcha_failed':
      return 'Bot check failed. Please try again.'
    case 'forbidden':
      return 'Request blocked. Refresh and try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}
