'use client'

import { useCallback, useState } from 'react'

import { TurnstileWidget } from '@/components/TurnstileWidget'

type Topic = 'bug' | 'feature' | 'purchase' | 'question' | 'other'

const TOPICS: { value: Topic; label: string }[] = [
  { value: 'bug', label: 'Something’s broken' },
  { value: 'feature', label: 'Idea' },
  { value: 'purchase', label: 'Purchase' },
  { value: 'question', label: 'Question' },
  { value: 'other', label: 'Other' },
]

const MESSAGE_MAX = 5000

const inputClass =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-ink-900 placeholder:text-ink-300 transition focus:border-sakura-400 focus:outline-none focus:ring-4 focus:ring-sakura-100'

export function ContactForm() {
  const [topic, setTopic] = useState<Topic>('bug')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [device, setDevice] = useState('')
  const [appVersion, setAppVersion] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const onTurnstileToken = useCallback((token: string) => setTurnstileToken(token), [])
  const onTurnstileExpire = useCallback(() => setTurnstileToken(null), [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    if (!turnstileToken) {
      setError('Please wait for the bot check to finish.')
      return
    }
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic, message, email, device, appVersion, turnstileToken }),
      })
      if (res.ok) {
        setSent(true)
        return
      }
      const data = (await res.json().catch(() => null)) as
        | { error?: string; details?: Record<string, string[] | undefined> }
        | null
      setError(humanizeError(res.status, data))
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="py-10 text-center" role="status">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sakura-50 text-sakura-600">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
            <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 text-xl font-semibold text-ink-900">Thanks, message received</h3>
        <p className="mt-2 text-ink-600 max-w-sm mx-auto">
          {email
            ? `If a reply is needed, it’ll go to ${email}.`
            : 'You didn’t leave an email, so we can’t reply, but every message gets read.'}
        </p>
        <p className="mt-6 font-japanese text-sm text-ink-400">ありがとうございます</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" aria-busy={submitting}>
      <fieldset>
        <legend className="mb-2.5 text-sm font-medium text-ink-800">What&apos;s this about?</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <label key={t.value} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t.value}
                checked={topic === t.value}
                onChange={() => setTopic(t.value)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-ink-200 px-3.5 py-1.5 text-sm text-ink-600 transition hover:border-ink-300 peer-checked:border-sakura-500 peer-checked:bg-sakura-500 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-sakura-100">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-800">
          Message
        </label>
        <textarea
          id="message"
          required
          minLength={10}
          maxLength={MESSAGE_MAX}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-y leading-relaxed`}
          placeholder={PLACEHOLDERS[topic]}
        />
        <p className="mt-1 text-right text-xs text-ink-400 tabular-nums">
          {message.length.toLocaleString()} / {MESSAGE_MAX.toLocaleString()}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="device" className="mb-1.5 block text-sm font-medium text-ink-800">
            Device <span className="font-normal text-ink-400">(optional)</span>
          </label>
          <input
            id="device"
            type="text"
            maxLength={100}
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className={inputClass}
            placeholder="iPhone 16, iOS 26"
          />
        </div>
        <div>
          <label htmlFor="appVersion" className="mb-1.5 block text-sm font-medium text-ink-800">
            App version <span className="font-normal text-ink-400">(optional)</span>
          </label>
          <input
            id="appVersion"
            type="text"
            maxLength={30}
            value={appVersion}
            onChange={(e) => setAppVersion(e.target.value)}
            className={inputClass}
            placeholder="Shown at the bottom of Settings"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">
          Email <span className="font-normal text-ink-400">(optional, only if you&apos;d like a reply)</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      <TurnstileWidget onToken={onTurnstileToken} onExpire={onTurnstileExpire} />

      {error && (
        <p className="rounded-xl bg-sakura-50 px-4 py-3 text-sm text-sakura-800" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !turnstileToken}
        className="w-full sm:w-auto rounded-full bg-ink-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:bg-ink-300"
      >
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

const PLACEHOLDERS: Record<Topic, string> = {
  bug: 'What happened, and what did you expect? Steps to reproduce help a lot.',
  feature: 'What would you like JisokuDict to do?',
  purchase: 'What did you buy, and what’s going wrong? (Never include card details.)',
  question: 'Ask away.',
  other: 'What’s on your mind?',
}

function humanizeError(
  status: number,
  data: { error?: string; details?: Record<string, string[] | undefined> } | null
): string {
  if (status === 429) return 'Too many messages from this network. Please try again in an hour.'
  switch (data?.error) {
    case 'invalid_input': {
      const first = data.details && Object.values(data.details).flat().find(Boolean)
      return first ?? 'Please check the form and try again.'
    }
    case 'captcha_failed':
      return 'The bot check failed. Please refresh the page and try again.'
    case 'forbidden':
      return 'Request blocked. Refresh the page and try again.'
    default:
      return 'Something went wrong on our side. Please try again.'
  }
}
