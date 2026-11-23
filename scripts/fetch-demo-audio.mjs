#!/usr/bin/env node
/**
 * Gets the app's pronunciation (VOICEVOX Nemo, speaker 10006) for everything the
 * demo can say: every word in public/demo/words.json and the featured words'
 * example sentences. The page plays these clips and never the browser's voice.
 *
 *   R2_PUBLIC_URL=https://<public bucket host> \
 *   VOICEVOX_URL=http://127.0.0.1:50921 JISOKUWEB=~/development/jisokuweb \
 *   node scripts/fetch-demo-audio.mjs [--force]
 *
 * A clip comes from the first place that has it:
 *  1. The app's audio bucket: <R2_PUBLIC_URL>/<speaker>/<md5 of the text>.wav, the
 *     objects api.jisoku.app redirects the app to (app_api.go in jisokuweb). It
 *     only holds what someone has already played in the app.
 *  2. A VOICEVOX Nemo engine, through jisokuweb's own synthesis (cmd/audiofix,
 *     which applies the dictionary's reading and pitch-accent corrections), so
 *     the clip is what the server would make for the app. Start an engine with
 *       docker run --rm --platform linux/amd64 -p 127.0.0.1:50921:50121 voicevox/voicevox_nemo_engine
 *     and set VOICEVOX_URL and JISOKUWEB. Needs Go.
 *
 * Writes public/demo/audio/<clip name>.m4a, where the clip name is a hash of the
 * text: clipName() here and in src/components/demo/speech.ts must stay the same.
 * Clips that are already there are kept (--force redoes them), and clips for
 * text the demo no longer has are removed. Needs ffmpeg. Exits 1 if any text is
 * left without a clip.
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SPEAKER = 10006
const BATCH = 40
const force = process.argv.includes('--force')
const bucket = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')
const voicevox = process.env.VOICEVOX_URL?.replace(/\/$/, '')
const jisokuweb = process.env.JISOKUWEB?.replace(/^~(?=\/)/, homedir())

/** FNV-1a over UTF-16 code units. Keep in step with src/components/demo/speech.ts. */
function clipName(text) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

const readJSON = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'))
const headword = (w) => w.k?.[0] ?? w.r[0]
const featured = readJSON('src/content/demo-featured.json')
const texts = [
  ...new Set([
    ...featured.words.map(headword),
    ...Object.values(featured.sentences).flatMap((list) => list.map((s) => s.t)),
    ...readJSON('public/demo/words.json').words.map(headword),
  ]),
]

const names = new Map()
for (const text of texts) {
  const name = clipName(text)
  if (names.has(name)) {
    console.error(`"${text}" and "${names.get(name)}" share the clip name ${name}; clipName() needs a wider hash.`)
    process.exit(1)
  }
  names.set(name, text)
}

const outDir = join(ROOT, 'public/demo/audio')
mkdirSync(outDir, { recursive: true })
const work = mkdtempSync(join(tmpdir(), 'demo-audio-'))
const clipPath = (text) => join(outDir, `${clipName(text)}.m4a`)

function encode(wav, text) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-c:a', 'aac', '-b:a', '48k', '-movflags', '+faststart', clipPath(text)])
}

let pending = texts.filter((t) => force || !existsSync(clipPath(t)))
const kept = texts.length - pending.length
const counts = { bucket: 0, synthesized: 0 }

if (bucket) {
  const missing = new Set()
  const download = async (text) => {
    const hash = createHash('md5').update(text).digest('hex')
    const res = await fetch(`${bucket}/${SPEAKER}/${hash}.wav`)
    if (!res.ok) return missing.add(text)
    const wav = join(work, `${hash}.wav`)
    writeFileSync(wav, Buffer.from(await res.arrayBuffer()))
    encode(wav, text)
    counts.bucket++
  }
  for (let i = 0; i < pending.length; i += 16) await Promise.all(pending.slice(i, i + 16).map(download))
  console.log(`${counts.bucket} clips from the bucket`)
  pending = pending.filter((t) => missing.has(t))
}

if (pending.length && voicevox && jisokuweb) {
  // audiofix splits its word list on ASCII commas.
  const unsafe = pending.filter((t) => t.includes(','))
  if (unsafe.length) console.warn(`Skipped (contains a comma): ${unsafe.join(' ')}`)
  const queue = pending.filter((t) => !t.includes(','))
  const tool = join(work, 'audiofix')
  execFileSync('go', ['build', '-o', tool, './cmd/audiofix'], { cwd: join(jisokuweb, 'services/web-go'), stdio: 'inherit' })
  for (let i = 0; i < queue.length; i += BATCH) {
    const batch = queue.slice(i, i + BATCH)
    const dir = join(work, `batch-${i}`)
    // Writes NN-before.wav (plain VOICEVOX) and NN-after.wav (corrected) per word, in order.
    execFileSync(tool, ['-voicevox', voicevox, '-samples', dir, '-words', batch.join(',')], { stdio: ['ignore', 'ignore', 'inherit'] })
    batch.forEach((text, n) => encode(join(dir, `${String(n + 1).padStart(2, '0')}-after.wav`), text))
    rmSync(dir, { recursive: true })
    counts.synthesized += batch.length
    console.log(`${counts.synthesized} of ${queue.length} synthesized`)
  }
  pending = unsafe
}

for (const file of readdirSync(outDir)) {
  if (!names.has(file.replace(/\.m4a$/, ''))) rmSync(join(outDir, file))
}
rmSync(work, { recursive: true })

console.log(`${texts.length - pending.length} of ${texts.length} clips in public/demo/audio (${kept} kept, ${counts.bucket} from the bucket, ${counts.synthesized} synthesized)`)
if (pending.length) {
  console.error(`No clip for ${pending.length}: ${pending.slice(0, 20).join(' ')}${pending.length > 20 ? ' …' : ''}`)
  if (!voicevox || !jisokuweb) console.error('Set VOICEVOX_URL and JISOKUWEB to synthesize what the bucket lacks.')
  process.exit(1)
}
