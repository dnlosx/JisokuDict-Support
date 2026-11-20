const BASE: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', ゐ: 'i', ゑ: 'e', を: 'o', ん: 'n', ゔ: 'vu',
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
}

const SMALL_Y: Record<string, string> = { ゃ: 'a', ゅ: 'u', ょ: 'o' }
const SMALL_VOWEL: Record<string, string> = { ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o' }

export function toHiragana(text: string): string {
  return text.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
}

export const hasJapanese = (text: string) => /[぀-ヿ㐀-鿿々]/.test(text)

/** Hepburn romaji, written the way people type it ("toukyou", "gakkou"). */
export function toRomaji(kana: string): string {
  const chars = [...toHiragana(kana)]
  let out = ''
  let double = false
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    const next = chars[i + 1]
    if (ch === 'っ') {
      double = true
      continue
    }
    if (ch === 'ー') {
      const last = out[out.length - 1]
      if (last && 'aiueo'.includes(last)) out += last
      continue
    }
    let syllable = BASE[ch]
    if (syllable === undefined) {
      out += ch
      continue
    }
    if (next && SMALL_Y[next] && syllable.endsWith('i') && syllable.length > 1) {
      // きゃ → kya, しゃ → sha, ちゃ → cha, じゃ → ja
      const stem = syllable.slice(0, -1)
      syllable = (/(sh|ch|j)$/.test(stem) ? stem : `${stem}y`) + SMALL_Y[next]
      i++
    } else if (next && SMALL_VOWEL[next] && (ch === 'ふ' || ch === 'て' || ch === 'で' || ch === 'う' || ch === 'ゔ')) {
      // ふぁ → fa, てぃ → ti, うぃ → wi
      const stem = ch === 'ふ' ? 'f' : ch === 'う' ? 'w' : ch === 'ゔ' ? 'v' : syllable.slice(0, -1)
      syllable = stem + SMALL_VOWEL[next]
      i++
    }
    if (double) {
      out += syllable.startsWith('ch') ? 't' : syllable[0]
      double = false
    }
    out += syllable
  }
  return out
}

/** Folds long vowels so "tokyo" and "toukyou" compare equal. */
export function looseRomaji(romaji: string): string {
  return romaji.replace(/ou/g, 'o').replace(/oo/g, 'o').replace(/uu/g, 'u').replace(/n'/g, 'n')
}

/** Splits a reading into morae: small kana join the kana before them. */
export function morae(reading: string): string[] {
  const out: string[] = []
  for (const ch of reading) {
    if ('ゃゅょぁぃぅぇぉャュョァィゥェォ'.includes(ch) && out.length) out[out.length - 1] += ch
    else out.push(ch)
  }
  return out
}

/**
 * Pitch of each mora (true = high) for a pattern number, plus the particle
 * that would follow: 0 stays high (heiban), n drops after the nth mora.
 */
export function pitchContour(reading: string, pattern: number): { mora: string; high: boolean }[] {
  const m = morae(reading)
  return m.map((mora, i) => ({
    mora,
    high: pattern === 0 ? i > 0 : pattern === 1 ? i === 0 : i > 0 && i < pattern,
  }))
}

export type PitchClass = 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka'

export function pitchClass(reading: string, pattern: number): PitchClass {
  if (pattern === 0) return 'heiban'
  if (pattern === 1) return 'atamadaka'
  return pattern >= morae(reading).length ? 'odaka' : 'nakadaka'
}

/** "食[た]べる" → [{ text: "食", ruby: "た" }, { text: "べる" }] */
export function parseFurigana(marked: string): { text: string; ruby?: string }[] {
  const out: { text: string; ruby?: string }[] = []
  const re = /([㐀-鿿々]+)\[([^\]]+)\]/g
  let last = 0
  for (const m of marked.matchAll(re)) {
    if (m.index! > last) out.push({ text: marked.slice(last, m.index) })
    out.push({ text: m[1], ruby: m[2] })
    last = m.index! + m[0].length
  }
  if (last < marked.length) out.push({ text: marked.slice(last) })
  return out
}
