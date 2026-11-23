import type { FormKey } from './conjugate'
import type { PitchClass } from './kana'

export type DemoLocale = 'en' | 'ja'

// JMdict part-of-speech codes, named as the app names them.
const POS: Record<string, [en: string, ja: string]> = {
  n: ['Noun', '名詞'],
  'n-pref': ['Noun prefix', '接頭辞'],
  'n-suf': ['Noun suffix', '接尾辞'],
  pn: ['Pronoun', '代名詞'],
  num: ['Numeric', '数詞'],
  ctr: ['Counter', '助数詞'],
  v1: ['Ichidan verb', '一段動詞'],
  'v1-s': ['Ichidan verb', '一段動詞'],
  vk: ['Kuru verb', 'カ変動詞'],
  vs: ['Suru verb', 'する動詞'],
  'vs-i': ['Suru verb', 'する動詞'],
  'vs-s': ['Suru verb', 'する動詞'],
  vt: ['Transitive', '他動詞'],
  vi: ['Intransitive', '自動詞'],
  'aux-v': ['Auxiliary verb', '助動詞'],
  'adj-i': ['い-Adjective', 'い形容詞'],
  'adj-ix': ['い-Adjective', 'い形容詞'],
  'adj-na': ['な-Adjective', 'な形容詞'],
  'adj-no': ['の-Adjective', 'の形容詞'],
  'adj-pn': ['Prenominal', '連体詞'],
  'adj-f': ['Prenominal', '連体詞'],
  adv: ['Adverb', '副詞'],
  'adv-to': ['Adverb', '副詞'],
  conj: ['Conjunction', '接続詞'],
  int: ['Interjection', '感動詞'],
  exp: ['Expression', '表現'],
  pref: ['Prefix', '接頭辞'],
  suf: ['Suffix', '接尾辞'],
  prt: ['Particle', '助詞'],
}

export function posLabels(codes: string[], locale: DemoLocale): string[] {
  const out: string[] = []
  for (const code of codes) {
    const pair = code.startsWith('v5') ? (['Godan verb', '五段動詞'] as const) : POS[code]
    if (!pair) continue
    const label = pair[locale === 'ja' ? 1 : 0]
    if (!out.includes(label)) out.push(label)
  }
  return out
}

const FORMS: Record<FormKey, [en: string, ja: string]> = {
  dictionary: ['Dictionary', '辞書形'],
  negative: ['Negative', '否定形'],
  past: ['Past', '過去形'],
  pastNegative: ['Past Neg.', '過去否定形'],
  te: ['Te-form', 'て形'],
  polite: ['Polite', '丁寧形'],
  politeNegative: ['Polite Neg.', '丁寧否定形'],
  politePast: ['Polite Past', '丁寧過去形'],
  potential: ['Potential', '可能形'],
  passive: ['Passive', '受身形'],
  causative: ['Causative', '使役形'],
  volitional: ['Volitional', '意向形'],
  conditionalBa: ['Cond. (ば)', '条件形（ば）'],
  conditionalTara: ['Cond. (たら)', '条件形（たら）'],
  imperative: ['Imperative', '命令形'],
  adverb: ['Adverb', '副詞形'],
}

export const formLabel = (key: FormKey, locale: DemoLocale) => FORMS[key][locale === 'ja' ? 1 : 0]

const PITCH: Record<PitchClass, [en: string, ja: string, enHint: string, jaHint: string]> = {
  heiban: ['Heiban', '平板型', 'rises and stays up', '上がったまま下がらない'],
  atamadaka: ['Atamadaka', '頭高型', 'starts high, then drops', '最初が高く、すぐ下がる'],
  nakadaka: ['Nakadaka', '中高型', 'rises, drops mid-word', '途中で下がる'],
  odaka: ['Odaka', '尾高型', 'drops right after the word', '単語の直後で下がる'],
}

export const pitchLabel = (cls: PitchClass, locale: DemoLocale) => PITCH[cls][locale === 'ja' ? 1 : 0]
export const pitchHint = (cls: PitchClass, locale: DemoLocale) => PITCH[cls][locale === 'ja' ? 3 : 2]

const UI = {
  en: {
    search: 'Search',
    placeholder: 'Japanese or English',
    clear: 'Clear search',
    back: 'Back',
    all: 'All',
    words: 'Words',
    kanji: 'Kanji',
    bestMatch: 'Best Match',
    moreWords: 'More Words',
    common: 'Common',
    definitions: 'Definitions',
    tapToView: 'tap to view',
    conjugations: 'Conjugations',
    plain: 'Plain',
    polite: 'Polite',
    other: 'Other Forms',
    examples: 'Examples',
    readings: 'Readings',
    onyomi: "On'yomi",
    kunyomi: "Kun'yomi",
    meanings: 'Meanings',
    wordsUsing: 'Words Using This Kanji',
    play: 'Play',
    replay: 'Replay',
    strokes: (n: number) => (n === 1 ? '1 stroke' : `${n} strokes`),
    stroke: (i: number, n: number) => `Stroke ${i} of ${n}`,
    previous: 'Previous stroke',
    next: 'Next stroke',
    listen: (word: string) => `Listen to ${word}`,
    tryThese: 'Try',
    recent: 'Try a search',
    wordOfDay: 'Word of the Day',
    kanjiOfDay: 'Kanji of the Day',
    loading: 'Loading the sample…',
    noResults: (q: string) => `“${q}” isn’t in this sample.`,
    noResultsBody: 'This demo carries 700 everyday words. The app has all 200,000+, offline.',
    getApp: 'Get the app',
    inApp: 'In the app',
    inAppExamples: 'Example sentences for every word, with audio.',
    usuallyKana: 'Usually written in kana',
    tabs: { search: 'Search', kanji: 'Kanji', words: 'Words', study: 'Study', favorites: 'Favorites' },
    appOnly: (tab: string) => `${tab} is in the app`,
    grade: (g: number) => `Grade ${g}`,
    know: 'Know',
    dontKnow: "Don't Know",
    word: 'Word',
    sentence: 'Sentence',
    tapToFlip: 'Tap the card to flip it',
    remaining: (n: number) => `${n} remaining`,
    sessionDone: 'Session complete',
    sessionBody: 'In the app, cards come back right when you’re about to forget them.',
    again: 'Go again',
  },
  ja: {
    search: '検索',
    placeholder: '日本語または英語',
    clear: '検索をクリア',
    back: '戻る',
    all: 'すべて',
    words: '単語',
    kanji: '漢字',
    bestMatch: 'ベストマッチ',
    moreWords: 'その他の単語',
    common: '常用',
    definitions: '意味',
    tapToView: 'タップで表示',
    conjugations: '活用',
    plain: '普通形',
    polite: '丁寧形',
    other: 'その他の活用',
    examples: '例文',
    readings: '読み',
    onyomi: '音読み',
    kunyomi: '訓読み',
    meanings: '意味',
    wordsUsing: 'この漢字を使う単語',
    play: '再生',
    replay: 'もう一度',
    strokes: (n: number) => `${n}画`,
    stroke: (i: number, n: number) => `${n}画中 ${i}画目`,
    previous: '前の画',
    next: '次の画',
    listen: (word: string) => `${word}の発音を聞く`,
    tryThese: '試す',
    recent: '検索してみる',
    wordOfDay: '今日の単語',
    kanjiOfDay: '今日の漢字',
    loading: 'サンプルを読み込み中…',
    noResults: (q: string) => `「${q}」はこのサンプルにありません。`,
    noResultsBody: 'このデモには日常の700語だけを収録しています。アプリなら20万語以上をオフラインで検索できます。',
    getApp: 'アプリを入手',
    inApp: 'アプリでは',
    inAppExamples: 'すべての単語に、音声つきの例文があります。',
    usuallyKana: '通常はかな書き',
    tabs: { search: '検索', kanji: '漢字', words: '単語', study: '学習', favorites: 'お気に入り' },
    appOnly: (tab: string) => `「${tab}」はアプリで使えます`,
    grade: (g: number) => `${g}年生`,
    know: '覚えた',
    dontKnow: 'まだ',
    word: '単語',
    sentence: '例文',
    tapToFlip: 'カードをタップしてめくる',
    remaining: (n: number) => `残り${n}枚`,
    sessionDone: 'セッション完了',
    sessionBody: 'アプリでは、忘れかけた頃にカードがもう一度出てきます。',
    again: 'もう一度',
  },
} as const

export type DemoStrings = (typeof UI)[DemoLocale]
export const demoStrings = (locale: DemoLocale): DemoStrings => UI[locale]
