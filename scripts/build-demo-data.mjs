#!/usr/bin/env node
/**
 * Builds the dictionary sample behind the landing page's live demo.
 *
 *   node scripts/build-demo-data.mjs --db <jmdict.db> --brush <brushvg.json> [--sentences]
 *
 * --db     a decompressed, schema-current jmdict.db from the app (a simulator's
 *          App Group container has one).
 * --brush  the app's brushvg.json.lzma, decompressed:
 *          compression_tool -decode -a lzma -i JisokuDict/brushvg.json.lzma -o brushvg.json
 * --sentences  also refetch the featured words' example sentences from
 *          api.jisoku.app (a few dozen requests, one at a time). Without it the
 *          sentences already in src/content/demo-featured.json are kept.
 *
 * Writes:
 *   public/demo/words.json         the searchable sample (loaded when the demo is first used)
 *   public/demo/kanji/<hex>.json   one file per kanji: readings, meanings, brush strokes
 *   src/content/demo-featured.json    the featured entries, inlined into the page
 */
import Database from 'better-sqlite3'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const arg = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}
const dbPath = arg('--db')
const brushPath = arg('--brush')
const fetchSentences = args.includes('--sentences')
if (!dbPath || !brushPath) {
  console.error('usage: build-demo-data.mjs --db <jmdict.db> --brush <brushvg.json> [--sentences]')
  process.exit(1)
}

const SAMPLE_SIZE = 700

// Words the page itself shows (hero demo, pitch comparison, stroke player,
// flashcards). Always in the sample, with example sentences.
const FEATURED = [
  '食べる', '飲む', '行く', '見る', '読む', '書く', '話す', '来る', '勉強', '日本語',
  '桜', '猫', '犬', '水', '学校', '先生', '友達', '電車', '天気', '時間',
  '静か', '美味しい', '新しい', '好き', '今日', '箸', '橋', '端', '雨', '飴', '花', '鼻',
]
// Words a visitor is likely to try first that the selection below would miss
// (kanji above N4, or a rare written form). Skipped quietly if JMdict drops one.
const EXTRA = [
  '有難う', '為る', '綺麗', '可愛い', '大丈夫', '東京', '日本', '日本人', '英語', '漢字', '辞書', '言葉',
  '愛', '家', '元気', '名前', '今日は', '今晩は', 'お早う', '御免', '済みません', '頑張る', '難しい', '簡単',
  '楽しい', '嬉しい', '悲しい', '寿司', '酒', 'お茶', '海', '夢', '旅行', '仕事', '歌', '音楽', '映画',
]
// Kanji the stroke-order player offers besides those of the featured words.
const FEATURED_KANJI = ['桜', '食', '語', '永', '飲', '書', '猫', '雨']

const db = new Database(dbPath, { readonly: true, fileMustExist: true })
const brush = JSON.parse(readFileSync(brushPath, 'utf8'))

const isKanji = (ch) => /\p{Script=Han}/u.test(ch) && ch !== '々'
const kanjiOf = (text) => [...text].filter(isKanji)

const kanjiRow = db.prepare('SELECT * FROM kanji WHERE literal = ?')
const kanjiLevel = new Map()
const levelOf = (ch) => {
  if (!kanjiLevel.has(ch)) kanjiLevel.set(ch, kanjiRow.get(ch)?.jlpt_level ?? 0)
  return kanjiLevel.get(ch)
}

// ---- pick the sample -------------------------------------------------------
// Everyday words a learner would try: marked common in JMdict's "ichi1" list,
// written only with kana and JLPT N5/N4 kanji. Most frequent first.
const candidates = db
  .prepare(
    `SELECT w.entry_id AS id, w.reb, w.freq_rank AS freq,
            (SELECT keb FROM kanji_elements k WHERE k.entry_id = w.entry_id ORDER BY k.id LIMIT 1) AS keb,
            (SELECT ke_pri FROM kanji_elements k WHERE k.entry_id = w.entry_id ORDER BY k.id LIMIT 1) AS ke_pri,
            (SELECT re_pri FROM reading_elements r WHERE r.entry_id = w.entry_id ORDER BY r.id LIMIT 1) AS re_pri
     FROM word_browse w
     WHERE w.is_common = 1
     ORDER BY w.freq_rank IS NULL, w.freq_rank, w.entry_id`,
  )
  .all()

const picked = new Map()
const byHeadword = new Map()
for (const c of candidates) {
  const head = c.keb ?? c.reb
  if (!byHeadword.has(head)) byHeadword.set(head, c)
}
for (const word of FEATURED) {
  const c = byHeadword.get(word)
  if (!c) throw new Error(`featured word not found: ${word}`)
  picked.set(c.id, c)
}
for (const word of EXTRA) {
  const c = byHeadword.get(word)
  if (c) picked.set(c.id, c)
  else console.warn(`extra word not found: ${word}`)
}
// Two passes: words in kana and N5 kanji first (the ones a beginner types),
// then N4 kanji to fill the rest.
for (const [minLevel, limit] of [[4, 480], [3, SAMPLE_SIZE]]) {
  for (const c of candidates) {
    if (picked.size >= limit) break
    const pri = `${c.ke_pri ?? ''},${c.re_pri ?? ''}`
    if (!pri.includes('ichi1')) continue
    const head = c.keb ?? c.reb
    if ([...c.reb].length > 6) continue
    if (!kanjiOf(head).every((ch) => levelOf(ch) >= minLevel)) continue
    picked.set(c.id, c)
  }
}

// ---- words -----------------------------------------------------------------
const kebs = db.prepare('SELECT keb FROM kanji_elements WHERE entry_id = ? ORDER BY id')
const rebs = db.prepare('SELECT reb FROM reading_elements WHERE entry_id = ? ORDER BY id')
const senses = db.prepare('SELECT id, pos, misc, field FROM senses WHERE entry_id = ? ORDER BY sense_order')
const glosses = db.prepare('SELECT gloss FROM glosses WHERE sense_id = ? ORDER BY id')
const pitch = db.prepare('SELECT pitch_patterns FROM pitch_accents WHERE word = ? AND reading = ?')

function buildWord(c) {
  const k = kebs.all(c.id).map((r) => r.keb).slice(0, 2)
  const r = rebs.all(c.id).map((r) => r.reb).slice(0, 2)
  const head = k[0] ?? r[0]
  const p = pitch.get(head, r[0])?.pitch_patterns
  const s = senses
    .all(c.id)
    .slice(0, 4)
    .map((row) => ({
      p: row.pos ? row.pos.split(',') : [],
      g: glosses.all(row.id).map((g) => g.gloss).slice(0, 5),
      ...(row.misc ? { m: row.misc.split(',') } : {}),
    }))
  return {
    id: c.id,
    ...(k.length ? { k } : {}),
    r,
    ...(p ? { p: p.split(',').map(Number) } : {}),
    s,
    ...(c.freq ? { f: c.freq } : {}),
  }
}

const words = [...picked.values()].map(buildWord)

// ---- kanji -----------------------------------------------------------------
const kanjiReadings = db.prepare('SELECT reading_type AS t, reading FROM kanji_readings WHERE kanji_id = ? ORDER BY id')
const kanjiMeanings = db.prepare('SELECT meaning FROM kanji_meanings WHERE kanji_id = ? ORDER BY id')

// Round path coordinates: the source has one decimal in a 1024 box, far more
// than a ~300px drawing needs.
const roundPath = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n))))

function buildKanji(ch) {
  const row = kanjiRow.get(ch)
  if (!row) return null
  const readings = kanjiReadings.all(row.id)
  const strokes = brush[ch.codePointAt(0).toString(16)]
  return {
    l: ch,
    sc: row.stroke_count,
    ...(row.grade ? { g: row.grade } : {}),
    ...(row.jlpt_level ? { j: row.jlpt_level } : {}),
    ...(row.frequency ? { f: row.frequency } : {}),
    on: readings.filter((r) => r.t === 'ja_on').map((r) => r.reading),
    kun: readings.filter((r) => r.t === 'ja_kun').map((r) => r.reading),
    m: kanjiMeanings.all(row.id).map((r) => r.meaning),
    ...(strokes ? { st: strokes.map(([outline, median]) => [roundPath(outline), roundPath(median)]) } : {}),
  }
}

const kanjiSet = new Set(FEATURED_KANJI)
for (const w of words) for (const ch of kanjiOf(w.k?.[0] ?? '')) kanjiSet.add(ch)

const kanjiDir = join(ROOT, 'public/demo/kanji')
rmSync(kanjiDir, { recursive: true, force: true })
mkdirSync(kanjiDir, { recursive: true })

const kanjiIndex = {}
const kanjiFull = new Map()
for (const ch of kanjiSet) {
  const k = buildKanji(ch)
  if (!k) continue
  kanjiFull.set(ch, k)
  kanjiIndex[ch] = { sc: k.sc, ...(k.j ? { j: k.j } : {}), m: k.m.slice(0, 3) }
  writeFileSync(join(kanjiDir, `${ch.codePointAt(0).toString(16)}.json`), JSON.stringify(k))
}

writeFileSync(join(ROOT, 'public/demo/words.json'), JSON.stringify({ words, kanji: kanjiIndex }))

// ---- featured --------------------------------------------------------------
const featuredPath = join(ROOT, 'src/content/demo-featured.json')
const previous = existsSync(featuredPath) ? JSON.parse(readFileSync(featuredPath, 'utf8')) : { sentences: {} }

async function sentencesFor(word) {
  const url = `https://api.jisoku.app/api/sentences/search?word=${encodeURIComponent(word)}&limit=4`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh) jisoku.app demo data build' } })
  if (!res.ok) throw new Error(`${word}: HTTP ${res.status}`)
  const { sentences } = await res.json()
  return sentences
    .filter((s) => [...s.text].length <= 28)
    .slice(0, 3)
    .map((s) => ({ t: s.text, f: s.furigana, e: s.translation, id: s.tatoebaId }))
}

const sentences = {}
for (const word of FEATURED) {
  if (fetchSentences) {
    try {
      sentences[word] = await sentencesFor(word)
    } catch (err) {
      console.warn(`sentences: ${err.message}; keeping the previous ones`)
      sentences[word] = previous.sentences?.[word] ?? []
    }
    await new Promise((r) => setTimeout(r, 400))
  } else {
    sentences[word] = previous.sentences?.[word] ?? []
  }
}

const featuredIds = FEATURED.map((word) => byHeadword.get(word).id)
const featuredWords = words.filter((w) => featuredIds.includes(w.id))
// Only the stroke player's first kanji ships with its strokes; the rest are
// fetched from public/demo/kanji when asked for.
const featuredKanji = {}
for (const ch of FEATURED_KANJI) {
  const k = kanjiFull.get(ch)
  if (!k) throw new Error(`featured kanji not found: ${ch}`)
  const { st, ...info } = k
  featuredKanji[ch] = ch === FEATURED_KANJI[0] ? k : info
}

mkdirSync(dirname(featuredPath), { recursive: true })
writeFileSync(
  featuredPath,
  JSON.stringify({
    meta: Object.fromEntries(db.prepare('SELECT key, value FROM metadata').all().map((r) => [r.key, r.value])),
    words: featuredWords,
    kanji: featuredKanji,
    sentences,
  }),
)

console.log(
  `words: ${words.length}, kanji: ${readdirSync(kanjiDir).length}, featured: ${featuredWords.length} words`,
)
