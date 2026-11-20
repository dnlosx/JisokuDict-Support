'use client'

import { useState } from 'react'

import { hasClip, speak, useJapaneseVoice } from './speech'

type Props = {
  text: string
  label: string
  /** shown as the tooltip when the browser has no Japanese voice */
  unavailable: string
  className?: string
  size?: 'sm' | 'md'
}

export function SpeakButton({ text, label, unavailable, className = '', size = 'md' }: Props) {
  const [active, setActive] = useState(false)
  const voice = useJapaneseVoice()
  const disabled = voice === false && !hasClip(text)

  return (
    <button
      type="button"
      aria-label={label}
      title={disabled ? unavailable : label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        setActive(true)
        if (!speak(text, () => setActive(false))) setActive(false)
        // Some browsers never fire onend.
        window.setTimeout(() => setActive(false), 6000)
      }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition active:scale-95 disabled:opacity-35 ${
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
      } ${active ? 'bg-app text-white' : 'bg-app-soft text-app hover:bg-ai-100'} ${className}`}
    >
      <svg viewBox="0 0 24 24" className={size === 'sm' ? 'h-[18px] w-[18px]' : 'h-5 w-5'} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor" stroke="none" />
        <path d="M15.5 9a4.2 4.2 0 010 6" />
        <path d="M18 6.5a7.8 7.8 0 010 11" className={active ? 'animate-pulse' : undefined} />
      </svg>
    </button>
  )
}
