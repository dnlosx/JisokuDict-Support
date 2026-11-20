#!/usr/bin/env node
/**
 * Fetches the app's own pronunciation clips for the demo's featured words, so
 * the landing page plays the same voice as the app instead of the browser's.
 *
 *   R2_PUBLIC_URL=https://<public bucket host> node scripts/fetch-demo-audio.mjs
 *
 * The clips are the public objects api.jisoku.app redirects the app to:
 * <R2_PUBLIC_URL>/<speaker>/<md5 of the text>.wav (see app_api.go in jisokuweb).
 * A word nobody has played yet has no clip; it is skipped and keeps using the
 * browser's voice. Needs ffmpeg to convert WAV to AAC.
 *
 * Writes public/demo/audio/<md5>.m4a and src/content/demo-audio.json (text → URL).
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SPEAKER = 10006
const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')
if (!base) {
  console.error('Set R2_PUBLIC_URL to the audio bucket\'s public URL (the jisokuweb service\'s R2_PUBLIC_URL).')
  process.exit(1)
}

const featured = JSON.parse(readFileSync(join(ROOT, 'src/content/demo-featured.json'), 'utf8'))
const texts = [
  ...featured.words.map((w) => w.k?.[0] ?? w.r[0]),
  ...Object.values(featured.sentences).flatMap((list) => list.map((s) => s.t)),
]

const outDir = join(ROOT, 'public/demo/audio')
mkdirSync(outDir, { recursive: true })
const manifest = {}

for (const text of new Set(texts)) {
  const hash = createHash('md5').update(text).digest('hex')
  const res = await fetch(`${base}/${SPEAKER}/${hash}.wav`)
  if (!res.ok) {
    console.warn(`${text}: no clip (HTTP ${res.status})`)
    continue
  }
  const wav = join(tmpdir(), `${hash}.wav`)
  writeFileSync(wav, Buffer.from(await res.arrayBuffer()))
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-c:a', 'aac', '-b:a', '64k', join(outDir, `${hash}.m4a`)])
  rmSync(wav)
  manifest[text] = `/demo/audio/${hash}.m4a`
  console.log(`${text}: ok`)
}

writeFileSync(join(ROOT, 'src/content/demo-audio.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`${Object.keys(manifest).length} of ${new Set(texts).size} clips saved`)
