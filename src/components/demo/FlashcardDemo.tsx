'use client'

import { useState } from 'react'

import { parseFurigana, toRomaji } from '@/lib/demo/kana'
import { demoStrings, type DemoLocale } from '@/lib/demo/labels'
import { headword } from '@/lib/demo/types'

import { FEATURED } from './sample'
import { SpeakButton } from './SpeakButton'

const DECK = ['食べる', '桜', '静か']

/** A three-card review session: flip, then Know or Don't Know. */
export function FlashcardDemo({ locale }: { locale: DemoLocale }) {
  const t = demoStrings(locale)
  const [queue, setQueue] = useState(DECK)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)

  const current = queue[0]
  const word = current ? FEATURED.words.find((w) => headword(w) === current)! : null
  const sentence = current ? FEATURED.sentences[current]?.[0] : null

  const answer = (knew: boolean) => {
    setFlipped(false)
    if (knew) setKnown((k) => k + 1)
    // A card you didn't know comes back at the end of the session.
    window.setTimeout(() => setQueue((q) => (knew ? q.slice(1) : [...q.slice(1), q[0]])), 180)
  }

  return (
    <div className="rounded-3xl bg-app-bg p-4 shadow-xl shadow-ai-900/5 ring-1 ring-ink-100 sm:p-6">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink-900">{word ? t.remaining(queue.length) : t.sessionDone}</span>
        <span className="flex gap-1.5" aria-hidden>
          {DECK.map((_, i) => (
            <span key={i} className={`h-2 w-6 rounded-full ${i < known ? 'bg-emerald-500' : 'bg-ink-200'}`} />
          ))}
        </span>
      </div>

      {word ? (
        <>
          <div className="mt-4 [perspective:1200px]">
            <div
              role="button"
              tabIndex={0}
              aria-label={t.tapToFlip}
              onClick={() => setFlipped((f) => !f)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setFlipped((f) => !f)
                }
              }}
              className={`relative h-64 w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center shadow-sm [backface-visibility:hidden]" aria-hidden={flipped}>
                <span className="font-japanese text-5xl font-semibold text-ink-900" lang="ja">{current}</span>
                <span className="mt-6 text-sm text-ink-400">{t.tapToFlip}</span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden={!flipped}>
                <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-ink-400">
                  {t.word}
                  {flipped && <SpeakButton size="sm" text={current} label={t.listen(current)} unavailable={t.noVoice} />}
                </span>
                <span className="mt-1 font-japanese text-2xl font-semibold text-ink-900" lang="ja">{current}</span>
                <span className="font-japanese text-ink-500" lang="ja">{word.r[0]} · <span lang="en">{toRomaji(word.r[0])}</span></span>
                <span className="mt-0.5 text-ink-700">{word.s[0].g[0]}</span>
                {sentence && (
                  <span className="mt-3 block w-full border-t border-ink-100 pt-3">
                    <span className="block font-japanese text-[15px] leading-loose text-ink-900" lang="ja">
                      {parseFurigana(sentence.f).map((part, i) =>
                        part.ruby ? <ruby key={i}>{part.text}<rt className="text-[9px] text-ink-500">{part.ruby}</rt></ruby> : <span key={i}>{part.text}</span>,
                      )}
                    </span>
                    <span className="block text-sm text-ink-500">{sentence.e}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={`mt-4 grid grid-cols-2 gap-3 transition-opacity ${flipped ? '' : 'pointer-events-none opacity-40'}`}>
            <button type="button" disabled={!flipped} onClick={() => answer(false)} className="h-12 rounded-xl bg-rose-500 font-semibold text-white transition active:scale-[0.98]">
              ✕ {t.dontKnow}
            </button>
            <button type="button" disabled={!flipped} onClick={() => answer(true)} className="h-12 rounded-xl bg-emerald-500 font-semibold text-white transition active:scale-[0.98]">
              {t.know} ✓
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4 flex h-[21.75rem] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center">
          <span className="font-mincho text-6xl text-sakura-500" lang="ja" aria-hidden>桜</span>
          <p className="mt-4 text-xl font-bold text-ink-900">{t.sessionDone}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">{t.sessionBody}</p>
          <button
            type="button"
            onClick={() => {
              setQueue(DECK)
              setKnown(0)
              setFlipped(false)
            }}
            className="mt-5 rounded-full bg-app-soft px-5 py-2.5 text-sm font-semibold text-app"
          >
            {t.again}
          </button>
        </div>
      )}
    </div>
  )
}
