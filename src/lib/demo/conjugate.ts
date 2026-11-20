// Conjugation for the demo's detail view and for finding a word from a
// conjugated form ("食べました" → 食べる, polite past). Covers the classes the
// sample contains; the app handles the full set.

export type FormKey =
  | 'dictionary' | 'negative' | 'past' | 'pastNegative' | 'te'
  | 'polite' | 'politeNegative' | 'politePast'
  | 'potential' | 'passive' | 'causative' | 'volitional' | 'conditionalBa' | 'conditionalTara' | 'imperative'
  | 'adverb'

export type FormGroup = { group: 'plain' | 'polite' | 'other'; forms: { key: FormKey; text: string }[] }

// ending → [a-row, i-row, e-row, o-row, te, ta]
const GODAN: Record<string, [string, string, string, string, string, string]> = {
  う: ['わ', 'い', 'え', 'お', 'って', 'った'],
  く: ['か', 'き', 'け', 'こ', 'いて', 'いた'],
  ぐ: ['が', 'ぎ', 'げ', 'ご', 'いで', 'いだ'],
  す: ['さ', 'し', 'せ', 'そ', 'して', 'した'],
  つ: ['た', 'ち', 'て', 'と', 'って', 'った'],
  ぬ: ['な', 'に', 'ね', 'の', 'んで', 'んだ'],
  ぶ: ['ば', 'び', 'べ', 'ぼ', 'んで', 'んだ'],
  む: ['ま', 'み', 'め', 'も', 'んで', 'んだ'],
  る: ['ら', 'り', 'れ', 'ろ', 'って', 'った'],
}

type WordClass = 'ichidan' | 'godan' | 'suru' | 'kuru' | 'i-adj' | 'na-adj'

export function wordClass(pos: string[]): { cls: WordClass; code: string } | null {
  for (const code of pos) {
    if (code === 'v1' || code === 'v1-s') return { cls: 'ichidan', code }
    if (code.startsWith('v5')) return { cls: 'godan', code }
    if (code === 'vk') return { cls: 'kuru', code }
    if (code === 'vs-i' || code === 'vs-s') return { cls: 'suru', code }
    if (code === 'adj-i' || code === 'adj-ix') return { cls: 'i-adj', code }
  }
  // A noun that takes する, or a na-adjective, only when nothing above matched.
  if (pos.includes('vs')) return { cls: 'suru', code: 'vs' }
  if (pos.includes('adj-na')) return { cls: 'na-adj', code: 'adj-na' }
  return null
}

function verbGroups(dictionary: string, s: {
  a: string; i: string; e: string; o: string; te: string; ta: string
  potential: string; passive: string; causative: string; volitional: string; ba: string; imperative: string
}): FormGroup[] {
  return [
    {
      group: 'plain',
      forms: [
        { key: 'dictionary', text: dictionary },
        { key: 'negative', text: `${s.a}ない` },
        { key: 'past', text: s.ta },
        { key: 'pastNegative', text: `${s.a}なかった` },
        { key: 'te', text: s.te },
      ],
    },
    {
      group: 'polite',
      forms: [
        { key: 'polite', text: `${s.i}ます` },
        { key: 'politeNegative', text: `${s.i}ません` },
        { key: 'politePast', text: `${s.i}ました` },
      ],
    },
    {
      group: 'other',
      forms: [
        { key: 'potential', text: s.potential },
        { key: 'passive', text: s.passive },
        { key: 'causative', text: s.causative },
        { key: 'volitional', text: s.volitional },
        { key: 'conditionalBa', text: s.ba },
        { key: 'conditionalTara', text: `${s.ta}ら` },
        { key: 'imperative', text: s.imperative },
      ],
    },
  ]
}

function suru(prefix: string): FormGroup[] {
  return verbGroups(`${prefix}する`, {
    a: `${prefix}し`, i: `${prefix}し`, e: '', o: '', te: `${prefix}して`, ta: `${prefix}した`,
    potential: `${prefix}できる`, passive: `${prefix}される`, causative: `${prefix}させる`,
    volitional: `${prefix}しよう`, ba: `${prefix}すれば`, imperative: `${prefix}しろ`,
  })
}

/**
 * Conjugates `text`, which may be the written form (食べる) or the reading
 * (たべる). Returns null for words that don't conjugate.
 */
export function conjugate(text: string, pos: string[]): FormGroup[] | null {
  const found = wordClass(pos)
  if (!found) return null
  const { cls, code } = found
  const stem = text.slice(0, -1)
  const last = text.slice(-1)

  switch (cls) {
    case 'ichidan':
      if (last !== 'る') return null
      return verbGroups(text, {
        a: stem, i: stem, e: stem, o: stem, te: `${stem}て`, ta: `${stem}た`,
        potential: `${stem}られる`, passive: `${stem}られる`, causative: `${stem}させる`,
        volitional: `${stem}よう`, ba: `${stem}れば`, imperative: `${stem}ろ`,
      })

    case 'godan': {
      const row = GODAN[last]
      if (!row) return null
      let [a, i, e, o, te, ta] = row.map((x) => stem + x)
      if (code === 'v5k-s') {
        // 行く: 行って, 行った
        te = `${stem}って`
        ta = `${stem}った`
      } else if (code === 'v5u-s') {
        // 問う: 問うて, 問うた
        te = `${stem}うて`
        ta = `${stem}うた`
      } else if (code === 'v5aru') {
        // いらっしゃる: いらっしゃいます
        i = `${stem}い`
      }
      const groups = verbGroups(text, {
        a, i, e, o, te, ta,
        potential: `${e}る`, passive: `${a}れる`, causative: `${a}せる`,
        volitional: `${o}う`, ba: `${e}ば`, imperative: code === 'v5aru' ? `${stem}い` : e,
      })
      if (code === 'v5r-i') {
        // ある: negative is ない
        const base = text.slice(0, -2)
        groups[0].forms[1].text = `${base}ない`
        groups[0].forms[3].text = `${base}なかった`
      }
      return groups
    }

    case 'kuru': {
      // 来る keeps its kanji and only the reading changes; in kana it is くる → こない, きた.
      if (!text.endsWith('る')) return null
      const base = text.slice(0, -2)
      const written = text.slice(-2, -1) !== 'く'
      const k = (kana: string) => base + (written ? text.slice(-2, -1) : kana)
      return verbGroups(text, {
        a: k('こ'), i: k('き'), e: '', o: '', te: `${k('き')}て`, ta: `${k('き')}た`,
        potential: `${k('こ')}られる`, passive: `${k('こ')}られる`, causative: `${k('こ')}させる`,
        volitional: `${k('こ')}よう`, ba: `${k('く')}れば`, imperative: `${k('こ')}い`,
      })
    }

    case 'suru':
      if (code === 'vs') return suru(text)
      return text.endsWith('する') ? suru(text.slice(0, -2)) : null

    case 'i-adj': {
      if (last !== 'い') return null
      // いい conjugates from よい
      const s = code === 'adj-ix' ? `${text.slice(0, -2)}${text.slice(-2, -1) === '良' ? '良' : 'よ'}` : stem
      return [
        {
          group: 'plain',
          forms: [
            { key: 'dictionary', text },
            { key: 'negative', text: `${s}くない` },
            { key: 'past', text: `${s}かった` },
            { key: 'pastNegative', text: `${s}くなかった` },
            { key: 'te', text: `${s}くて` },
          ],
        },
        {
          group: 'polite',
          forms: [
            { key: 'polite', text: `${text}です` },
            { key: 'politeNegative', text: `${s}くないです` },
            { key: 'politePast', text: `${s}かったです` },
          ],
        },
        {
          group: 'other',
          forms: [
            { key: 'adverb', text: `${s}く` },
            { key: 'conditionalBa', text: `${s}ければ` },
            { key: 'conditionalTara', text: `${s}かったら` },
          ],
        },
      ]
    }

    case 'na-adj':
      return [
        {
          group: 'plain',
          forms: [
            { key: 'dictionary', text: `${text}だ` },
            { key: 'negative', text: `${text}じゃない` },
            { key: 'past', text: `${text}だった` },
            { key: 'pastNegative', text: `${text}じゃなかった` },
            { key: 'te', text: `${text}で` },
          ],
        },
        {
          group: 'polite',
          forms: [
            { key: 'polite', text: `${text}です` },
            { key: 'politeNegative', text: `${text}じゃありません` },
            { key: 'politePast', text: `${text}でした` },
          ],
        },
        {
          group: 'other',
          forms: [
            { key: 'adverb', text: `${text}に` },
            { key: 'conditionalBa', text: `${text}なら` },
            { key: 'conditionalTara', text: `${text}だったら` },
          ],
        },
      ]
  }
}

/** The app lists a する-noun's conjugations as bare する forms. */
export function displayConjugation(text: string, pos: string[]): FormGroup[] | null {
  const found = wordClass(pos)
  if (!found) return null
  if (found.cls === 'suru' && found.code === 'vs') return suru('')
  return conjugate(text, pos)
}
