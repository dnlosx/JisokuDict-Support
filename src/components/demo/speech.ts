// Pronunciation for the demo, in the app's own voice (VOICEVOX Nemo): one clip
// per word and example sentence in public/demo/audio, made by
// scripts/fetch-demo-audio.mjs. The browser's speech synthesis is never used.

let stopCurrent: (() => void) | null = null

/** FNV-1a over UTF-16 code units. Keep in step with scripts/fetch-demo-audio.mjs. */
function clipName(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

/**
 * Plays the clip for `text`, stopping whatever was playing. `onEnd` runs once:
 * when the clip finishes, is cut off by the next one, or can't be played.
 */
export function speak(text: string, onEnd: () => void = () => {}) {
  stopCurrent?.()
  const audio = new Audio(`/demo/audio/${clipName(text)}.m4a`)
  let done = false
  const finish = () => {
    if (done) return
    done = true
    audio.pause()
    if (stopCurrent === finish) stopCurrent = null
    onEnd()
  }
  stopCurrent = finish
  audio.onended = finish
  audio.play().catch(finish)
}
