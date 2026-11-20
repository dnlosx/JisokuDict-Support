'use client'

import { useEffect, useState } from 'react'

import clips from '@/content/demo-audio.json'

// Pronunciation for the demo. Words with a clip in public/demo/audio (the app's
// own voice, fetched by scripts/fetch-demo-audio.mjs) play that; everything
// else uses the browser's Japanese voice.
const CLIPS = clips as Record<string, string>

let playing: HTMLAudioElement | null = null

// Standard voices first. macOS also lists novelty voices (Eddy, Grandma, …)
// under ja-JP, and they come before Kyoko alphabetically.
const PREFERRED = /kyoko|o-ren|otoya|hattori|nanami|haruka|ayumi|keita|sayaka|ichiro|google/i
const NOVELTY = /eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley/i

function japaneseVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis?.getVoices() ?? []
  const ja = voices.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('ja'))
  return ja.find((v) => PREFERRED.test(v.name)) ?? ja.find((v) => !NOVELTY.test(v.name)) ?? ja[0]
}

function synthesize(text: string, onEnd: () => void): boolean {
  const synth = window.speechSynthesis
  if (!synth) return false
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  utterance.rate = 0.9
  const voice = japaneseVoice()
  if (voice) utterance.voice = voice
  utterance.onend = onEnd
  utterance.onerror = onEnd
  synth.speak(utterance)
  return true
}

/** Says `text` aloud. Returns false when the browser can't. */
export function speak(text: string, onEnd: () => void = () => {}): boolean {
  if (typeof window === 'undefined') return false
  playing?.pause()
  playing = null
  window.speechSynthesis?.cancel()

  const clip = CLIPS[text]
  if (clip) {
    const audio = new Audio(clip)
    playing = audio
    audio.onended = onEnd
    audio.play().catch(() => {
      if (!synthesize(text, onEnd)) onEnd()
    })
    return true
  }
  return synthesize(text, onEnd)
}

export const hasClip = (text: string) => text in CLIPS

/** Whether the browser has a Japanese voice: undefined until its voice list has loaded. */
export function useJapaneseVoice(): boolean | undefined {
  const [available, setAvailable] = useState<boolean>()
  useEffect(() => {
    const synth = window.speechSynthesis
    if (!synth) {
      setAvailable(false)
      return
    }
    const check = () => {
      if (synth.getVoices().length) setAvailable(Boolean(japaneseVoice()))
    }
    check()
    synth.addEventListener?.('voiceschanged', check)
    return () => synth.removeEventListener?.('voiceschanged', check)
  }, [])
  return available
}
