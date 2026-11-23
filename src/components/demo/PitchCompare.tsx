'use client'

import { useState } from 'react'

import { pitchClass } from '@/lib/demo/kana'
import { demoStrings, pitchHint, pitchLabel, type DemoLocale } from '@/lib/demo/labels'
import { headword } from '@/lib/demo/types'

import { PitchGraph } from './PitchGraph'
import { FEATURED } from './sample'
import { SpeakButton } from './SpeakButton'

// Words spelled the same in kana and told apart only by pitch.
const SETS: { romaji: string; words: string[] }[] = [
  { romaji: 'hashi', words: ['箸', '橋', '端'] },
  { romaji: 'ame', words: ['雨', '飴'] },
  { romaji: 'hana', words: ['花', '鼻'] },
]

export function PitchCompare({ locale }: { locale: DemoLocale }) {
  const t = demoStrings(locale)
  const [set, setSet] = useState(0)
  const words = SETS[set].words.map((w) => FEATURED.words.find((f) => headword(f) === w)!)

  return (
    <div className="rounded-3xl border border-ink-100 bg-white p-4 shadow-xl shadow-ai-900/5 sm:p-6">
      <div role="group" className="flex gap-2">
        {SETS.map((s, i) => (
          <button
            key={s.romaji}
            type="button"
            aria-pressed={i === set}
            onClick={() => setSet(i)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${i === set ? 'bg-app text-white' : 'bg-app-bg text-ink-700 hover:bg-ai-100'}`}
          >
            {s.romaji}
          </button>
        ))}
      </div>
      <ul className="mt-4 divide-y divide-ink-100">
        {words.map((w) => {
          const reading = w.r[0]
          const pattern = w.p![0]
          const cls = pitchClass(reading, pattern)
          return (
            <li key={w.id} className="flex items-center gap-3 py-3.5 sm:gap-5">
              <span className="w-12 shrink-0 text-center font-mincho text-4xl text-ink-900 sm:w-14 sm:text-5xl" lang="ja">{headword(w)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-ink-900">{w.s[0].g[0]}</span>
                <span className="block text-sm text-ink-500">
                  {pitchLabel(cls, locale)} <span className="hidden sm:inline">· {pitchHint(cls, locale)}</span>
                </span>
              </span>
              <PitchGraph reading={reading} pattern={pattern} particle step={30} />
              <SpeakButton text={headword(w)} label={t.listen(headword(w))} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
