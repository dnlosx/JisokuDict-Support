'use client'

import { useEffect, useState } from 'react'

import featured from '@/content/demo-featured.json'
import { buildIndex, type SearchIndex } from '@/lib/demo/search'
import type { DemoSample, Kanji, KanjiSummary, Sentence, Word } from '@/lib/demo/types'

type Featured = {
  meta: Record<string, string>
  words: Word[]
  kanji: Record<string, Kanji>
  sentences: Record<string, Sentence[]>
}

export const FEATURED = featured as unknown as Featured

// The page renders with the featured words; the 700-word sample replaces them
// once it has downloaded.
const starter: DemoSample = {
  words: FEATURED.words,
  kanji: Object.fromEntries(
    Object.entries(FEATURED.kanji).map(([ch, k]): [string, KanjiSummary] => [ch, { sc: k.sc, j: k.j, m: k.m.slice(0, 3) }]),
  ),
}
const starterIndex = buildIndex(starter)

let fullIndex: Promise<SearchIndex> | null = null

function loadFullIndex(): Promise<SearchIndex> {
  fullIndex ??= fetch('/demo/words.json')
    .then((res) => {
      if (!res.ok) throw new Error(`sample: HTTP ${res.status}`)
      return res.json() as Promise<DemoSample>
    })
    .then(buildIndex)
    .catch((err) => {
      fullIndex = null
      throw err
    })
  return fullIndex
}

export function useSearchIndex(): { index: SearchIndex; byId: Map<number, Word>; full: boolean } {
  const [index, setIndex] = useState(starterIndex)
  useEffect(() => {
    let cancelled = false
    loadFullIndex().then(
      (full) => !cancelled && setIndex(full),
      () => {},
    )
    return () => {
      cancelled = true
    }
  }, [])
  const [byId, setById] = useState(() => new Map(starterIndex.entries.map((e) => [e.word.id, e.word])))
  useEffect(() => setById(new Map(index.entries.map((e) => [e.word.id, e.word]))), [index])
  return { index, byId, full: index !== starterIndex }
}

const kanjiCache = new Map<string, Promise<Kanji | null>>()

/** A kanji's details and brush strokes, from public/demo/kanji. */
export function loadKanji(ch: string): Promise<Kanji | null> {
  const inline = FEATURED.kanji[ch]
  if (inline?.st) return Promise.resolve(inline)
  let pending = kanjiCache.get(ch)
  if (!pending) {
    pending = fetch(`/demo/kanji/${ch.codePointAt(0)!.toString(16)}.json`)
      .then((res) => (res.ok ? (res.json() as Promise<Kanji>) : null))
      .catch(() => {
        kanjiCache.delete(ch)
        return null
      })
    kanjiCache.set(ch, pending)
  }
  return pending
}

export function useKanji(ch: string): Kanji | null | undefined {
  const inline = FEATURED.kanji[ch]
  const [state, setState] = useState<{ ch: string; kanji: Kanji | null | undefined }>({
    ch,
    kanji: inline?.st ? inline : undefined,
  })
  useEffect(() => {
    let cancelled = false
    loadKanji(ch).then((kanji) => !cancelled && setState({ ch, kanji }))
    return () => {
      cancelled = true
    }
  }, [ch])
  if (state.ch !== ch) return inline?.st ? inline : undefined
  return state.kanji
}

const DEMO_EVENT = 'jisoku:demo-query'

/** Runs a search in the page's dictionary demo and scrolls it into view. */
export function sendDemoQuery(query: string) {
  window.dispatchEvent(new CustomEvent(DEMO_EVENT, { detail: query }))
  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export function useDemoQuery(onQuery: (query: string) => void) {
  useEffect(() => {
    const listener = (e: Event) => onQuery((e as CustomEvent<string>).detail)
    window.addEventListener(DEMO_EVENT, listener)
    return () => window.removeEventListener(DEMO_EVENT, listener)
  }, [onQuery])
}
