'use client'

import { useEffect, useRef, useState } from 'react'

import { demoStrings, type DemoLocale } from '@/lib/demo/labels'
import { jlptLabel } from '@/lib/demo/types'

import { FEATURED, useKanji } from './sample'
import { StrokeCanvas, useStrokePlayback } from './StrokeCanvas'

const CHOICES = Object.keys(FEATURED.kanji)

/** Pick a kanji and watch it brushed stroke by stroke. */
export function StrokePlayer({ locale }: { locale: DemoLocale }) {
  const t = demoStrings(locale)
  const [ch, setCh] = useState(CHOICES[0])
  const kanji = useKanji(ch)
  const info = FEATURED.kanji[ch]
  const strokes = kanji?.st ?? []
  const playback = useStrokePlayback(strokes.length, ch)
  const { play } = playback
  const root = useRef<HTMLDivElement>(null)
  const autoplayed = useRef(false)
  const [picked, setPicked] = useState(false)

  // Plays once when the section scrolls into view, and whenever a kanji is picked.
  useEffect(() => {
    const el = root.current
    if (!el || autoplayed.current || !strokes.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        autoplayed.current = true
        observer.disconnect()
        play()
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [play, strokes.length])

  useEffect(() => {
    if (picked && strokes.length) play()
  }, [picked, ch, strokes.length, play])

  const position = playback.playing ? Math.min(strokes.length, playback.drawn + 1) : playback.drawn

  return (
    <div ref={root} className="rounded-3xl border border-ink-100 bg-white p-4 shadow-xl shadow-ai-900/5 sm:p-6">
      <div role="group" aria-label={t.kanji} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {CHOICES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={c === ch}
            onClick={() => {
              setPicked(true)
              setCh(c)
            }}
            className={`h-12 w-12 shrink-0 rounded-xl font-mincho text-2xl transition ${c === ch ? 'bg-app text-white' : 'bg-app-bg text-ink-800 hover:bg-ai-100'}`}
            lang="ja"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center">
        <div className="mx-auto aspect-square w-full max-w-[15rem] rounded-2xl bg-app-bg p-3">
          {strokes.length > 0 && <StrokeCanvas strokes={strokes} {...playback} label={`${ch}: ${t.strokes(strokes.length)}`} className="h-full w-full" />}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold capitalize text-ink-900">{info.m.slice(0, 3).join(', ')}</p>
          <p className="mt-1 text-sm text-ink-500">{[t.strokes(info.sc), jlptLabel(info.j), info.g ? t.grade(info.g) : null].filter(Boolean).join(' · ')}</p>
          <dl className="mt-3 grid grid-cols-[5rem_1fr] gap-y-1 text-[15px]">
            {info.on.length > 0 && (<><dt className="text-ink-500">{t.onyomi}</dt><dd className="font-japanese" lang="ja">{info.on.join('、')}</dd></>)}
            {info.kun.length > 0 && (<><dt className="text-ink-500">{t.kunyomi}</dt><dd className="font-japanese" lang="ja">{info.kun.slice(0, 4).join('、')}</dd></>)}
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => playback.step(-1)} aria-label={t.previous} disabled={!strokes.length} className="flex h-11 w-11 items-center justify-center rounded-full bg-app-soft text-app transition hover:bg-ai-100 disabled:opacity-40">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5l-5 5 5 5" /></svg>
            </button>
            <button type="button" onClick={play} disabled={!strokes.length} className="flex h-11 items-center gap-2 rounded-full bg-app px-5 text-sm font-semibold text-white transition hover:bg-ai-800 disabled:opacity-40">
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden><path d="M2.5 1.2v9.6L10.5 6z" /></svg>
              {t.play}
            </button>
            <button type="button" onClick={() => playback.step(1)} aria-label={t.next} disabled={!strokes.length} className="flex h-11 w-11 items-center justify-center rounded-full bg-app-soft text-app transition hover:bg-ai-100 disabled:opacity-40">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 5l5 5-5 5" /></svg>
            </button>
            <span className="ml-1 whitespace-nowrap text-sm tabular-nums text-ink-500" aria-live="polite">{strokes.length ? t.stroke(position, strokes.length) : ''}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
