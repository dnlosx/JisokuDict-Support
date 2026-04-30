'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

type Props = {
  onToken: (token: string) => void
  onExpire?: () => void
  className?: string
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
        }
      ) => string
      reset: (widgetId?: string) => void
    }
  }
}

export function TurnstileWidget({ onToken, onExpire, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const callbackRef = useRef({ onToken, onExpire })
  callbackRef.current = { onToken, onExpire }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) return
    let cancelled = false

    function tryRender() {
      if (cancelled) return
      if (!window.turnstile || !containerRef.current) {
        setTimeout(tryRender, 100)
        return
      }
      if (widgetIdRef.current) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey!,
        callback: (token) => callbackRef.current.onToken(token),
        'expired-callback': () => callbackRef.current.onExpire?.(),
        'error-callback': () => callbackRef.current.onExpire?.(),
        theme: 'light',
      })
    }

    tryRender()
    return () => {
      cancelled = true
    }
  }, [siteKey])

  if (!siteKey) {
    return (
      <div className={className}>
        <p className="text-xs text-ink-500">Turnstile is not configured.</p>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="afterInteractive"
      />
      <div ref={containerRef} className={className} />
    </>
  )
}
