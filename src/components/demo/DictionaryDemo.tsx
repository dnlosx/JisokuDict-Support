'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { displayConjugation } from '@/lib/demo/conjugate'
import { parseFurigana } from '@/lib/demo/kana'
import { demoStrings, formLabel, posLabels, type DemoLocale, type DemoStrings } from '@/lib/demo/labels'
import { search, wordsWithKanji, type Inflection, type SearchIndex } from '@/lib/demo/search'
import { headword, jlptLabel, type Word } from '@/lib/demo/types'

import { PitchGraph } from './PitchGraph'
import { FEATURED, useDemoQuery, useKanji, useSearchIndex } from './sample'
import { SpeakButton } from './SpeakButton'
import { StrokeCanvas, useStrokePlayback } from './StrokeCanvas'

type View =
  | { type: 'search' }
  | { type: 'word'; id: number; inflection?: Inflection }
  | { type: 'kanji'; ch: string }

type Props = { locale: DemoLocale; appStoreUrl: string }

const SUGGESTIONS = ['eat', 'taberu', '食べました', 'hashi', 'school', '新しい']
const WORD_OF_THE_DAY = '桜'
const KANJI_OF_THE_DAY = '語'

const isKanji = (ch: string) => /\p{Script=Han}/u.test(ch) && ch !== '々'

export function DictionaryDemo({ locale, appStoreUrl }: Props) {
  const t = demoStrings(locale)
  const { index, byId } = useSearchIndex()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'words' | 'kanji'>('all')
  const [stack, setStack] = useState<View[]>([{ type: 'search' }])
  const view = stack[stack.length - 1]
  const scroller = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const results = useMemo(() => search(index, query), [index, query])

  const push = useCallback((next: View) => setStack((s) => [...s, next]), [])
  const pop = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), [])

  const runQuery = useCallback((q: string) => {
    setQuery(q)
    setFilter('all')
    setStack([{ type: 'search' }])
  }, [])
  useDemoQuery(runQuery)

  // Each screen starts at its top, like a pushed view in the app.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [stack.length, view])

  const word = view.type === 'word' ? byId.get(view.id) : undefined
  const wordOfDay = FEATURED.words.find((w) => headword(w) === WORD_OF_THE_DAY)!

  return (
    <div className="flex h-full flex-col bg-app-bg text-ink-900" lang={locale}>
      {view.type === 'search' ? (
        <>
          <div className="shrink-0 border-b border-black/5 bg-white/70 pt-[var(--safe-top,0px)]">
            <div className="flex h-11 items-center justify-center text-[15px] font-semibold">{t.search}</div>
          </div>
          {results.best && (
            <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-black/5 bg-white/70 px-3 py-2 text-[13px]">
              {(
                [
                  ['all', t.all, 1 + results.words.length + results.kanji.length],
                  ['words', t.words, 1 + results.words.length],
                  ['kanji', t.kanji, results.kanji.length],
                ] as const
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={`shrink-0 rounded-full border px-3 py-1 transition ${
                    filter === key ? 'border-app bg-app-soft text-app' : 'border-ink-200 bg-white text-ink-700'
                  }`}
                >
                  {label} <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>
          )}
          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            {!query.trim() ? (
              <Home t={t} word={wordOfDay} onWord={(w) => push({ type: 'word', id: w.id })} onKanji={(ch) => push({ type: 'kanji', ch })} onQuery={runQuery} />
            ) : results.best ? (
              <Results t={t} locale={locale} index={index} results={results} filter={filter} onWord={(w, inflection) => push({ type: 'word', id: w.id, inflection })} onKanji={(ch) => push({ type: 'kanji', ch })} />
            ) : (
              <div className="px-3 py-10 text-center">
                <p className="font-semibold">{t.noResults(query.trim())}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{t.noResultsBody}</p>
                <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-full bg-app px-4 py-2 text-sm font-semibold text-white">
                  {t.getApp}
                </a>
              </div>
            )}
          </div>
          <div className="shrink-0 px-3 pb-2 pt-1.5">
            <div className="flex h-11 items-center gap-2 rounded-xl bg-black/[0.06] px-3">
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-ink-400" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="M13 13l4 4" strokeLinecap="round" />
              </svg>
              <input
                ref={input}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setFilter('all')
                }}
                placeholder={t.placeholder}
                aria-label={t.search}
                enterKeyHint="search"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="demo-search min-w-0 flex-1 bg-transparent text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  aria-label={t.clear}
                  onClick={() => {
                    setQuery('')
                    input.current?.focus()
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-400 text-white"
                >
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                    <path d="M2 2l8 8M10 2l-8 8" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="shrink-0 border-b border-black/5 bg-white pt-[var(--safe-top,0px)]">
            <div className="flex h-11 items-center gap-2 px-3">
              <button type="button" onClick={pop} aria-label={t.back} className="flex h-9 w-9 items-center justify-center rounded-full bg-app-bg text-ink-900 active:scale-95">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12.5 4L6.5 10l6 6" />
                </svg>
              </button>
              <span className="min-w-0 flex-1 truncate text-[15px] font-semibold font-japanese" lang="ja">
                {view.type === 'kanji' ? view.ch : word ? headword(word) : ''}
              </span>
              {word && <SpeakButton size="sm" text={headword(word)} label={t.listen(headword(word))} />}
            </div>
          </div>
          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto bg-white">
            {view.type === 'word' && word && (
              <WordDetail t={t} locale={locale} word={word} inflection={view.inflection} onKanji={(ch) => push({ type: 'kanji', ch })} />
            )}
            {view.type === 'kanji' && (
              <KanjiDetail key={view.ch} t={t} index={index} ch={view.ch} onWord={(w) => push({ type: 'word', id: w.id })} />
            )}
          </div>
        </>
      )}
      <TabBar t={t} />
    </div>
  )
}

function Home({ t, word, onWord, onKanji, onQuery }: { t: DemoStrings; word: Word; onWord: (w: Word) => void; onKanji: (ch: string) => void; onQuery: (q: string) => void }) {
  const kanji = FEATURED.kanji[KANJI_OF_THE_DAY]
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => onWord(word)} className="block w-full rounded-2xl bg-white p-4 text-left shadow-sm active:bg-ink-50">
        <span className="text-xs text-ink-500">{t.wordOfDay}</span>
        <span className="mt-1 flex items-baseline gap-2">
          <span className="font-japanese text-3xl font-semibold" lang="ja">{headword(word)}</span>
          <span className="font-japanese text-ink-500" lang="ja">{word.r[0]}</span>
        </span>
        <span className="mt-1 block text-sm text-ink-600">{word.s[0].g.slice(0, 2).join('; ')}</span>
      </button>
      <button type="button" onClick={() => onKanji(KANJI_OF_THE_DAY)} className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm active:bg-ink-50">
        <span className="font-mincho text-4xl" lang="ja">{KANJI_OF_THE_DAY}</span>
        <span>
          <span className="block text-xs text-ink-500">{t.kanjiOfDay}</span>
          <span className="block text-sm text-ink-700">{kanji?.m.slice(0, 2).join(', ')}</span>
        </span>
      </button>
      <div className="px-1 pt-2">
        <p className="text-sm font-semibold">{t.recent}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => onQuery(s)} className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-800 active:bg-ink-50">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-ink-200 px-2 py-0.5 text-[11px] text-ink-600">{children}</span>
}

function JlptBadge({ level }: { level?: number }) {
  const label = jlptLabel(level)
  if (!label) return null
  const color = level === 4 ? 'bg-emerald-500' : level === 3 ? 'bg-teal-500' : level === 2 ? 'bg-amber-500' : 'bg-rose-500'
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold text-white ${color}`}>{label}</span>
}

function Results({
  t, locale, index, results, filter, onWord, onKanji,
}: {
  t: DemoStrings
  locale: DemoLocale
  index: SearchIndex
  results: ReturnType<typeof search>
  filter: 'all' | 'words' | 'kanji'
  onWord: (w: Word, inflection?: Inflection) => void
  onKanji: (ch: string) => void
}) {
  const best = results.best!
  return (
    <div className="space-y-4">
      {filter !== 'kanji' && (
        <button type="button" onClick={() => onWord(best.word, best.inflection)} className="block w-full rounded-2xl border border-ai-300 bg-white p-4 text-left active:bg-ink-50">
          <span className="text-xs text-ink-500">{t.bestMatch}</span>
          {best.inflection && (
            <span className="mt-1 flex items-center gap-1.5 text-[13px] text-app">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 3L2.5 6.5 6 10M2.5 6.5H10a3.5 3.5 0 010 7H8" />
              </svg>
              <span className="font-japanese" lang="ja">{best.inflection.typed}</span> · {formLabel(best.inflection.form, locale)}
            </span>
          )}
          <span className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="font-japanese text-[28px] font-semibold leading-tight" lang="ja">{headword(best.word)}</span>
            {best.word.k && <span className="font-japanese text-ink-500" lang="ja">{best.word.r[0]}</span>}
          </span>
          <span className="mt-1.5 block text-[15px] leading-snug text-ink-800">
            {best.word.s.length === 1
              ? best.word.s[0].g.join('; ')
              : best.word.s.slice(0, 2).map((s, i) => <span key={i} className="block">{i + 1}. {s.g.slice(0, 3).join('; ')}</span>)}
          </span>
          <span className="mt-2.5 flex flex-wrap gap-1.5">
            {posLabels(best.word.s[0].p, locale).slice(0, 1).map((p) => <Badge key={p}>{p}</Badge>)}
            <Badge>{t.common}</Badge>
          </span>
        </button>
      )}

      {filter !== 'words' && results.kanji.length > 0 && (
        <section>
          <h3 className="px-1 text-sm font-semibold text-ink-500">{t.kanji}</h3>
          <div className="-mx-3 mt-2 flex gap-2 overflow-x-auto px-3 pb-1">
            {results.kanji.map((ch) => (
              <button key={ch} type="button" onClick={() => onKanji(ch)} className="flex w-[84px] shrink-0 flex-col items-center rounded-xl bg-white px-2 py-2.5 shadow-sm active:bg-ink-50">
                <span className="font-japanese text-3xl" lang="ja">{ch}</span>
                <span className="mt-1 w-full truncate text-center text-xs text-ink-500">{index.kanji[ch]?.m[0]}</span>
                <span className="mt-1.5"><JlptBadge level={index.kanji[ch]?.j} /></span>
              </button>
            ))}
          </div>
        </section>
      )}

      {filter !== 'kanji' && results.words.length > 0 && (
        <section>
          <h3 className="px-1 text-sm font-semibold text-ink-500">{t.moreWords}</h3>
          <ul className="mt-2 divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white">
            {results.words.map((w) => (
              <li key={w.id}>
                <button type="button" onClick={() => onWord(w)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-ink-50">
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="font-japanese text-[17px] font-semibold" lang="ja">{headword(w)}</span>
                      {w.k && <span className="truncate font-japanese text-sm text-ink-500" lang="ja">{w.r[0]}</span>}
                    </span>
                    <span className="block truncate text-sm text-ink-500">{w.s[0].g.slice(0, 3).join('; ')}</span>
                  </span>
                  <Chevron />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 8 14" className="h-3 w-2 shrink-0 text-ink-300" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 1l6 6-6 6" />
    </svg>
  )
}

function SectionLabel({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <h3 className="text-[11px] font-medium uppercase tracking-wide text-ink-500">
      {children}
      {note && <span className="ml-2 normal-case tracking-normal text-ink-300">({note})</span>}
    </h3>
  )
}

function WordDetail({ t, locale, word, inflection, onKanji }: { t: DemoStrings; locale: DemoLocale; word: Word; inflection?: Inflection; onKanji: (ch: string) => void }) {
  const head = headword(word)
  const kanji = [...new Set([...head].filter(isKanji))]
  const groups = displayConjugation(head, word.s[0].p)
  const sentences = FEATURED.sentences[head] ?? []
  const usuallyKana = word.k && word.s[0].m?.includes('word usually written using kana alone')
  const groupLabel = { plain: t.plain, polite: t.polite, other: t.other }

  return (
    <div className="divide-y divide-ink-100 px-4">
      <section className="py-4">
        {inflection && (
          <p className="mb-2 text-[13px] text-app">
            <span className="font-japanese" lang="ja">{inflection.typed}</span> · {formLabel(inflection.form, locale)}
          </p>
        )}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-japanese text-[34px] font-semibold leading-tight" lang="ja">{head}</p>
            {word.k && !word.p && <p className="font-japanese text-ink-500" lang="ja">{word.r[0]}</p>}
          </div>
          {word.p && <PitchGraph reading={word.r[0]} pattern={word.p[0]} />}
        </div>
        <div className="mt-4">
          <SectionLabel>{t.definitions}</SectionLabel>
          <ol className="mt-1.5 space-y-2">
            {word.s.map((sense, i) => {
              const pos = posLabels(sense.p, locale).join(', ')
              const showPos = i === 0 || pos !== posLabels(word.s[i - 1].p, locale).join(', ')
              return (
                <li key={i}>
                  {showPos && pos && <p className="text-xs text-ink-500">{pos}</p>}
                  <p className="flex gap-2 text-[16px] leading-snug">
                    {word.s.length > 1 && <span className="w-4 shrink-0 text-ink-400">{i + 1}</span>}
                    <span>{sense.g.join('; ')}</span>
                  </p>
                </li>
              )
            })}
          </ol>
          {usuallyKana && <p className="mt-2 text-xs text-ink-500">{t.usuallyKana}: <span className="font-japanese" lang="ja">{word.r[0]}</span></p>}
        </div>
      </section>

      {kanji.length > 0 && (
        <section className="py-4">
          <SectionLabel note={t.tapToView}>{t.kanji}</SectionLabel>
          <div className="mt-1 flex gap-3">
            {kanji.map((ch) => (
              <button key={ch} type="button" onClick={() => onKanji(ch)} className="rounded-lg font-japanese text-[34px] leading-tight underline decoration-ai-200 decoration-2 underline-offset-8 active:text-app" lang="ja">
                {ch}
              </button>
            ))}
          </div>
        </section>
      )}

      {groups && (
        <section className="py-4">
          <SectionLabel>{t.conjugations}</SectionLabel>
          {groups.map(({ group, forms }) => (
            <div key={group} className="mt-3">
              <span className="rounded-md bg-app px-2 py-0.5 text-xs font-medium text-white">{groupLabel[group]}</span>
              <dl className="mt-2 grid grid-cols-[7.5rem_1fr] gap-y-1.5 text-[15px]">
                {forms.map((f) => (
                  <div key={f.key} className="contents">
                    <dt className="text-ink-500">{formLabel(f.key, locale)}</dt>
                    <dd className="font-japanese" lang="ja">{f.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </section>
      )}

      <section className="py-4">
        <SectionLabel>{t.examples}</SectionLabel>
        {sentences.length > 0 ? (
          <ul className="mt-2 space-y-4">
            {sentences.map((s) => (
              <li key={s.id} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-japanese text-[17px] leading-loose" lang="ja">
                    {parseFurigana(s.f).map((part, i) =>
                      part.ruby ? <ruby key={i}>{part.text}<rt className="text-[9px] text-ink-500">{part.ruby}</rt></ruby> : <span key={i}>{part.text}</span>,
                    )}
                  </p>
                  <p className="text-sm leading-snug text-ink-500">{s.e}</p>
                </div>
                <SpeakButton size="sm" text={s.t} label={t.listen(s.t)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 rounded-xl bg-app-bg px-3 py-2.5 text-sm text-ink-600">
            <span className="font-semibold text-ink-800">{t.inApp}:</span> {t.inAppExamples}
          </p>
        )}
      </section>
    </div>
  )
}

function KanjiDetail({ t, index, ch, onWord }: { t: DemoStrings; index: SearchIndex; ch: string; onWord: (w: Word) => void }) {
  const kanji = useKanji(ch)
  const strokes = kanji?.st ?? []
  const playback = useStrokePlayback(strokes.length, ch)
  const words = useMemo(() => wordsWithKanji(index, ch), [index, ch])
  const facts = kanji ? [kanji.f ? t.common : null, t.strokes(kanji.sc), jlptLabel(kanji.j)].filter(Boolean) : []

  return (
    <div className="divide-y divide-ink-100 px-4">
      <section className="py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex aspect-square items-center justify-center rounded-xl bg-app-bg font-mincho text-[96px] leading-none" lang="ja">{ch}</div>
          <div className="aspect-square rounded-xl bg-app-bg p-2">
            {strokes.length > 0 && <StrokeCanvas strokes={strokes} {...playback} label={`${ch}: ${t.strokes(strokes.length)}`} className="h-full w-full" />}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-ink-500">{facts.join(' · ')}</p>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => playback.step(-1)} aria-label={t.previous} disabled={!strokes.length} className="flex h-9 w-9 items-center justify-center rounded-full bg-app-soft text-app disabled:opacity-40">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5l-5 5 5 5" /></svg>
            </button>
            <button type="button" onClick={playback.play} disabled={!strokes.length} className="flex h-9 items-center gap-1.5 rounded-full bg-app-soft px-4 text-sm font-medium text-app disabled:opacity-40">
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden><path d="M2.5 1.2v9.6L10.5 6z" /></svg>
              {t.play}
            </button>
            <button type="button" onClick={() => playback.step(1)} aria-label={t.next} disabled={!strokes.length} className="flex h-9 w-9 items-center justify-center rounded-full bg-app-soft text-app disabled:opacity-40">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 5l5 5-5 5" /></svg>
            </button>
          </div>
        </div>
      </section>

      {kanji && (
        <>
          <section className="py-4">
            <h3 className="font-semibold">{t.readings}</h3>
            <dl className="mt-2 grid grid-cols-[5.5rem_1fr] gap-y-1.5 text-[15px]">
              {kanji.on.length > 0 && (<><dt className="text-ink-500">{t.onyomi}</dt><dd className="font-japanese" lang="ja">{kanji.on.join('、')}</dd></>)}
              {kanji.kun.length > 0 && (<><dt className="text-ink-500">{t.kunyomi}</dt><dd className="font-japanese" lang="ja">{kanji.kun.slice(0, 6).join('、')}</dd></>)}
            </dl>
          </section>
          <section className="py-4">
            <h3 className="font-semibold">{t.meanings}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {kanji.m.slice(0, 8).map((m) => <span key={m} className="rounded-full bg-app-bg px-3 py-1 text-sm">{m}</span>)}
            </div>
          </section>
        </>
      )}

      {words.length > 0 && (
        <section className="py-4">
          <h3 className="font-semibold">{t.wordsUsing}</h3>
          <ul className="mt-1 divide-y divide-ink-100">
            {words.map((w) => (
              <li key={w.id}>
                <button type="button" onClick={() => onWord(w)} className="flex w-full items-center gap-3 py-2.5 text-left active:bg-ink-50">
                  <span className="font-japanese font-semibold" lang="ja">{headword(w)}</span>
                  <span className="font-japanese text-sm text-ink-500" lang="ja">{w.r[0]}</span>
                  <span className="min-w-0 flex-1 truncate text-right text-sm text-ink-400">{w.s[0].g[0]}</span>
                  <Chevron />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

/** The app's tab bar, for looks: only Search exists in the demo. */
function TabBar({ t }: { t: DemoStrings }) {
  const tabs: [string, React.ReactNode][] = [
    [t.tabs.search, <><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></>],
    [t.tabs.kanji, <><rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16" /></>],
    [t.tabs.words, <><path d="M6 3.5h11a1.5 1.5 0 011.5 1.5v15.5H7.5A1.5 1.5 0 016 19V3.5z" /><path d="M9.5 8h5.5M9.5 11.5h5.5" /></>],
    [t.tabs.study, <><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M6.5 5.5h11M8.5 3h7" /></>],
    [t.tabs.favorites, <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.6 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z" />],
  ]
  return (
    <div aria-hidden className="shrink-0 px-4 pb-[var(--safe-bottom,0.75rem)]">
      <div className="flex justify-between rounded-full bg-white px-2 py-1.5 shadow-[0_2px_14px_rgba(0,0,0,0.10)]">
        {tabs.map(([label, icon], i) => (
          <div key={label} className={`flex w-[19%] flex-col items-center gap-0.5 rounded-full py-1 text-[10px] font-medium ${i === 0 ? 'bg-app-bg text-app' : 'text-ink-900'}`}>
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
