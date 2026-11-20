import { conjugate, type FormKey } from './conjugate'
import { hasJapanese, looseRomaji, toHiragana, toRomaji } from './kana'
import { headword, type DemoSample, type KanjiSummary, type Word } from './types'

type Indexed = {
  word: Word
  forms: string[] // written forms and readings, readings in hiragana
  romaji: string[]
  loose: string[]
  glosses: { text: string; sense: number; position: number }[]
}

export type Inflection = { typed: string; form: FormKey }

export type SearchIndex = {
  entries: Indexed[]
  kanji: Record<string, KanjiSummary>
  /** conjugated form (written, kana or romaji) → the word it belongs to */
  inflected: Map<string, { word: Word; form: FormKey }>
}

export type SearchResults = {
  query: string
  best: { word: Word; inflection?: Inflection } | null
  words: Word[]
  kanji: string[]
}

const cleanGloss = (gloss: string) =>
  gloss
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/^to /, '')
    .replace(/[^a-z0-9' -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export function buildIndex(sample: DemoSample): SearchIndex {
  const inflected: SearchIndex['inflected'] = new Map()
  const entries = sample.words.map((word) => {
    const readings = word.r.map(toHiragana)
    const romaji = readings.map(toRomaji)
    const pos = word.s[0]?.p ?? []
    for (const surface of [...(word.k?.slice(0, 1) ?? []), word.r[0]]) {
      const groups = conjugate(surface, pos)
      if (!groups) continue
      for (const { forms } of groups) {
        for (const { key, text } of forms) {
          if (key === 'dictionary' || !text) continue
          for (const k of [text, toRomaji(text)]) if (!inflected.has(k)) inflected.set(k, { word, form: key })
        }
      }
    }
    return {
      word,
      forms: [...(word.k ?? []), ...readings],
      romaji,
      loose: romaji.map(looseRomaji),
      glosses: word.s.flatMap((sense, s) => sense.g.map((g, position) => ({ text: cleanGloss(g), sense: s, position }))),
    }
  })
  return { entries, kanji: sample.kanji, inflected }
}

const frequencyBonus = (w: Word) => ((49 - (w.f ?? 49)) / 49) * 6

function scoreJapanese(e: Indexed, q: string): number {
  let best = 0
  for (const form of e.forms) {
    if (form === q) best = Math.max(best, 100)
    else if (form.startsWith(q)) best = Math.max(best, 70 - (form.length - q.length))
    else if (form.includes(q)) best = Math.max(best, 40)
  }
  return best
}

function scoreLatin(e: Indexed, q: string): number {
  let best = 0
  const loose = looseRomaji(q)
  e.romaji.forEach((r, i) => {
    if (r === q) best = Math.max(best, 100)
    else if (e.loose[i] === loose) best = Math.max(best, 92)
    else if (q.length >= 2 && r.startsWith(q)) best = Math.max(best, 58 - Math.min(20, r.length - q.length))
  })
  for (const g of e.glosses) {
    const penalty = g.sense * 6 + g.position * 3
    if (g.text === q) best = Math.max(best, 96 - penalty)
    else if (g.text.startsWith(`${q} `) || g.text.endsWith(` ${q}`)) best = Math.max(best, 66 - penalty)
    else if (` ${g.text} `.includes(` ${q} `)) best = Math.max(best, 52 - penalty)
    else if (q.length >= 4 && ` ${g.text}`.includes(` ${q}`)) best = Math.max(best, 34 - penalty)
  }
  return best
}

export function search(index: SearchIndex, rawQuery: string): SearchResults {
  const query = rawQuery.trim()
  const empty: SearchResults = { query, best: null, words: [], kanji: [] }
  if (!query) return empty

  const japanese = hasJapanese(query)
  const q = japanese ? toHiragana(query) : query.toLowerCase().replace(/[\s'-]+/g, ' ').trim()
  const romajiQuery = q.replace(/ /g, '')

  const scored = index.entries
    .map((e) => {
      const base = japanese
        ? Math.max(scoreJapanese(e, query), scoreJapanese(e, q))
        : Math.max(scoreLatin(e, q), q === romajiQuery ? 0 : scoreLatin(e, romajiQuery))
      return { word: e.word, score: base ? base + frequencyBonus(e.word) : 0 }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  // A conjugated form wins unless something already matches the query exactly.
  const inflection = index.inflected.get(japanese ? query : romajiQuery)
  let best: SearchResults['best'] = null
  if (inflection && (scored[0]?.score ?? 0) < 100) {
    best = { word: inflection.word, inflection: { typed: query, form: inflection.form } }
  } else if (scored.length) {
    best = { word: scored[0].word }
  }

  const words = scored.map((s) => s.word).filter((w) => w.id !== best?.word.id).slice(0, 24)

  let kanji: string[]
  if (japanese) {
    kanji = [...new Set([...query].filter((ch) => index.kanji[ch]))]
  } else {
    kanji = Object.entries(index.kanji)
      .filter(([, k]) => k.m.some((m) => m.toLowerCase() === q))
      .map(([ch]) => ch)
      .slice(0, 8)
  }
  return { query, best, words, kanji }
}

/** Sample words that contain a kanji, most frequent first. */
export function wordsWithKanji(index: SearchIndex, ch: string, limit = 6): Word[] {
  return index.entries
    .filter((e) => headword(e.word).includes(ch))
    .map((e) => e.word)
    .sort((a, b) => (a.f ?? 49) - (b.f ?? 49) || headword(a).length - headword(b).length)
    .slice(0, limit)
}
