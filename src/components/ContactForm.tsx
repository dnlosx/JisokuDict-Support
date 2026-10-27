'use client'

import { useCallback, useState } from 'react'

import { TurnstileWidget } from '@/components/TurnstileWidget'
import type { Locale } from '@/lib/i18n'

type Topic = 'bug' | 'feature' | 'purchase' | 'question' | 'other'

const TOPIC_VALUES: Topic[] = ['bug', 'feature', 'purchase', 'question', 'other']

const MESSAGE_MAX = 5000

const STRINGS = {
  en: {
    topics: {
      bug: 'Something’s broken',
      feature: 'Idea',
      purchase: 'Purchase',
      question: 'Question',
      other: 'Other',
    },
    placeholders: {
      bug: 'What happened, and what did you expect? Steps to reproduce help a lot.',
      feature: 'What would you like JisokuDict to do?',
      purchase: 'What did you buy, and what’s going wrong? (Never include card details.)',
      question: 'Ask away.',
      other: 'What’s on your mind?',
    },
    topicLegend: 'What’s this about?',
    message: 'Message',
    optional: '(optional)',
    device: 'Device',
    devicePlaceholder: 'iPhone 16, iOS 26',
    appVersion: 'App version',
    appVersionPlaceholder: 'Shown at the bottom of Settings',
    email: 'Email',
    emailHint: '(optional, only if you’d like a reply)',
    emailPlaceholder: 'you@example.com',
    send: 'Send message',
    sending: 'Sending…',
    sentTitle: 'Thanks, message received',
    sentWithEmail: (email: string) => `If a reply is needed, it’ll go to ${email}.`,
    sentNoEmail: 'You didn’t leave an email, so we can’t reply, but every message gets read.',
    waitForCheck: 'Please wait for the bot check to finish.',
    network: 'Network error. Please check your connection and try again.',
    rateLimited: 'Too many messages from this network. Please try again in an hour.',
    invalid: 'Please check the form and try again.',
    captcha: 'The bot check failed. Please refresh the page and try again.',
    forbidden: 'Request blocked. Refresh the page and try again.',
    server: 'Something went wrong on our side. Please try again.',
  },
  es: {
    topics: {
      bug: 'Algo no funciona',
      feature: 'Idea',
      purchase: 'Compra',
      question: 'Pregunta',
      other: 'Otro',
    },
    placeholders: {
      bug: '¿Qué pasó y qué esperabas que pasara? Los pasos para reproducirlo ayudan mucho.',
      feature: '¿Qué te gustaría que hiciera JisokuDict?',
      purchase: '¿Qué compraste y qué está fallando? (Nunca incluyas datos de tu tarjeta).',
      question: 'Pregunta lo que quieras.',
      other: '¿Qué tienes en mente?',
    },
    topicLegend: '¿De qué se trata?',
    message: 'Mensaje',
    optional: '(opcional)',
    device: 'Dispositivo',
    devicePlaceholder: 'iPhone 16, iOS 26',
    appVersion: 'Versión de la app',
    appVersionPlaceholder: 'Aparece al final de Settings',
    email: 'Correo electrónico',
    emailHint: '(opcional, solo si quieres una respuesta)',
    emailPlaceholder: 'tu@ejemplo.com',
    send: 'Enviar mensaje',
    sending: 'Enviando…',
    sentTitle: 'Gracias, recibimos tu mensaje',
    sentWithEmail: (email: string) => `Si hace falta responder, escribiremos a ${email}.`,
    sentNoEmail: 'No dejaste un correo, así que no podremos responderte, pero leemos todos los mensajes.',
    waitForCheck: 'Espera a que termine la verificación antibots.',
    network: 'Error de red. Revisa tu conexión e inténtalo de nuevo.',
    rateLimited: 'Se enviaron demasiados mensajes desde esta red. Inténtalo de nuevo en una hora.',
    invalid: 'Revisa el formulario e inténtalo de nuevo. El mensaje debe tener al menos 10 caracteres.',
    captcha: 'La verificación antibots falló. Recarga la página e inténtalo de nuevo.',
    forbidden: 'Solicitud bloqueada. Recarga la página e inténtalo de nuevo.',
    server: 'Algo salió mal de nuestro lado. Inténtalo de nuevo.',
  },
}

type Strings = (typeof STRINGS)['en']

const inputClass =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-ink-900 placeholder:text-ink-300 transition focus:border-sakura-400 focus:outline-none focus:ring-4 focus:ring-sakura-100'

export function ContactForm({ locale = 'en' }: { locale?: Locale }) {
  const t: Strings = STRINGS[locale]
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
      setError(t.waitForCheck)
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
      setError(humanizeError(res.status, data, t, locale))
    } catch {
      setError(t.network)
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
        <h3 className="mt-5 text-xl font-semibold text-ink-900">{t.sentTitle}</h3>
        <p className="mt-2 text-ink-600 max-w-sm mx-auto">{email ? t.sentWithEmail(email) : t.sentNoEmail}</p>
        <p className="mt-6 font-japanese text-sm text-ink-400" lang="ja">ありがとうございます</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" aria-busy={submitting}>
      <fieldset>
        <legend className="mb-2.5 text-sm font-medium text-ink-800">{t.topicLegend}</legend>
        <div className="flex flex-wrap gap-2">
          {TOPIC_VALUES.map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={value}
                checked={topic === value}
                onChange={() => setTopic(value)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-ink-200 px-3.5 py-1.5 text-sm text-ink-600 transition hover:border-ink-300 peer-checked:border-sakura-500 peer-checked:bg-sakura-500 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-sakura-100">
                {t.topics[value]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-800">
          {t.message}
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
          placeholder={t.placeholders[topic]}
        />
        <p className="mt-1 text-right text-xs text-ink-400 tabular-nums">
          {message.length.toLocaleString(locale)} / {MESSAGE_MAX.toLocaleString(locale)}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="device" className="mb-1.5 block text-sm font-medium text-ink-800">
            {t.device} <span className="font-normal text-ink-400">{t.optional}</span>
          </label>
          <input
            id="device"
            type="text"
            maxLength={100}
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className={inputClass}
            placeholder={t.devicePlaceholder}
          />
        </div>
        <div>
          <label htmlFor="appVersion" className="mb-1.5 block text-sm font-medium text-ink-800">
            {t.appVersion} <span className="font-normal text-ink-400">{t.optional}</span>
          </label>
          <input
            id="appVersion"
            type="text"
            maxLength={30}
            value={appVersion}
            onChange={(e) => setAppVersion(e.target.value)}
            className={inputClass}
            placeholder={t.appVersionPlaceholder}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">
          {t.email} <span className="font-normal text-ink-400">{t.emailHint}</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder={t.emailPlaceholder}
        />
      </div>

      <TurnstileWidget onToken={onTurnstileToken} onExpire={onTurnstileExpire} language={locale} />

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
        {submitting ? t.sending : t.send}
      </button>
    </form>
  )
}

function humanizeError(
  status: number,
  data: { error?: string; details?: Record<string, string[] | undefined> } | null,
  t: Strings,
  locale: Locale
): string {
  if (status === 429) return t.rateLimited
  switch (data?.error) {
    case 'invalid_input': {
      // The API's validation messages are English, so only show them on the English form.
      const first = locale === 'en' && data.details && Object.values(data.details).flat().find(Boolean)
      return first || t.invalid
    }
    case 'captcha_failed':
      return t.captcha
    case 'forbidden':
      return t.forbidden
    default:
      return t.server
  }
}
