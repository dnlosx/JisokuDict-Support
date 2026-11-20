// Shapes written by scripts/build-demo-data.mjs. Keys are short because
// public/demo/words.json is downloaded by the landing page's demo.

export type Sense = {
  /** JMdict part-of-speech codes ("v1", "adj-i", …) */
  p: string[]
  /** glosses */
  g: string[]
  /** usage notes ("word usually written using kana alone", …) */
  m?: string[]
}

export type Word = {
  id: number
  /** written forms, most common first; absent for kana-only words */
  k?: string[]
  /** readings in kana */
  r: string[]
  /** pitch accent patterns for the first reading (0 = heiban, n = drop after mora n) */
  p?: number[]
  s: Sense[]
  /** JMdict news-frequency band, 1 (most frequent) to 48 */
  f?: number
}

export type KanjiSummary = { sc: number; j?: number; m: string[] }

export type Kanji = {
  l: string
  /** stroke count */
  sc: number
  /** school grade */
  g?: number
  /** JLPT level on the old 1–4 scale */
  j?: number
  f?: number
  on: string[]
  kun: string[]
  m: string[]
  /** brush strokes in drawing order: [outline, centerline] SVG paths in a 1024 box */
  st?: [string, string][]
}

export type Sentence = { t: string; f: string; e: string; id: number }

export type DemoSample = { words: Word[]; kanji: Record<string, KanjiSummary> }

export const headword = (w: Word) => w.k?.[0] ?? w.r[0]

/** Old four-level JLPT scale to today's N-levels, as the app shows it. */
export function jlptLabel(level: number | undefined): string | null {
  switch (level) {
    case 4:
      return 'N5'
    case 3:
      return 'N4'
    case 2:
      return 'N2/N3'
    case 1:
      return 'N1'
    default:
      return null
  }
}
