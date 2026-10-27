import { Screenshot } from '@/components/Screenshot'
import { SiteFooter } from '@/components/SiteFooter'
import { APP_STORE_URL, SiteHeader } from '@/components/SiteHeader'

type Spotlight = {
  kanji: string
  eyebrow: string
  title: string
  body: string
  points: string[]
  shot: string
  alt: string
}

const SPOTLIGHTS: Spotlight[] = [
  {
    kanji: '言',
    eyebrow: 'Words',
    title: 'Every word, fully explained',
    body: 'Clear definitions with part of speech, plus everything you need to actually use the word.',
    points: ['Pitch accent for every reading', 'Full conjugation tables for verbs and adjectives', 'Audio, example sentences and related words'],
    shot: 'word',
    alt: 'JisokuDict on iPhone Duo in landscape: search results beside the entry for 食べる with pitch accent and conjugations',
  },
  {
    kanji: '桜',
    eyebrow: 'Kanji',
    title: 'Kanji, stroke by stroke',
    body: 'Watch how each character is written, then see where it shows up in real words.',
    points: ['Animated stroke order', 'On’yomi, kun’yomi and meanings', 'JLPT level, stroke count and common words'],
    shot: 'kanji',
    alt: 'JisokuDict on iPhone Duo in landscape: the kanji 桜 with stroke order and readings',
  },
  {
    kanji: '習',
    eyebrow: 'Study',
    title: 'Study what you look up',
    body: 'Add any word or kanji to your deck in one tap. Cards come back when they’re due, a few minutes a day.',
    points: ['Daily reviews on the Today screen', 'Optional study reminders', 'A little celebration when you nail a session'],
    shot: 'celebrate',
    alt: 'JisokuDict on iPhone Duo in landscape: a perfect review session with cherry blossoms and a 30-day streak',
  },
  {
    kanji: '判',
    eyebrow: 'Streaks',
    title: 'A stamp for every milestone',
    body: 'Keep a streak going and fill your stamp book, from three days all the way to a full year.',
    points: ['Eight hand-drawn stamps to collect', 'Stamps are yours to keep, even if a streak ends'],
    shot: 'stamps',
    alt: 'JisokuDict on iPhone Duo in landscape: the stamp book with four of eight stamps collected',
  },
]

const EXTRAS = [
  { icon: '📷', title: 'Camera search', body: 'Point at a sign or menu, or pick a photo, to read the Japanese in it.' },
  { icon: '✍️', title: 'Handwriting', body: 'Draw a kanji you can’t type and JisokuDict finds it.' },
  { icon: '📴', title: 'Fully offline', body: 'The whole dictionary lives on your device. No signal needed.' },
  { icon: '☁️', title: 'iCloud sync', body: 'Favorites, flashcards and notes follow you to every device.' },
  { icon: '🗓️', title: 'Word of the Day', body: 'A new word or kanji on your Home Screen with the widget.' },
  { icon: '🔒', title: 'Private', body: 'No account, no sign-up. Your study data stays yours.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 overflow-x-clip">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-ai-50/80 via-white to-sakura-50/50">
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 -top-10 select-none overflow-hidden font-mincho text-[20rem] leading-none text-ai-100/60 sm:text-[30rem]"
          >
            辞
          </span>

          <div className="relative max-w-6xl mx-auto px-4 pt-14 pb-20 sm:pt-20 lg:pb-28 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center">
            <div>
              <img src="/app-icon.png" alt="" width={72} height={72} className="rounded-[18px] shadow-lg shadow-ai-500/25" />
              <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-900 leading-[1.05]">
                The Japanese dictionary that keeps up with you.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ink-600 leading-relaxed">
                Over 200,000 entries, fully offline. Search in English, kana or romaji, learn kanji stroke by
                stroke, and turn every lookup into a flashcard.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                <AppStoreButton />
                <span className="text-sm text-ink-500">Free · iPhone, iPhone Duo, iPad &amp; Mac</span>
              </div>
            </div>

            <div aria-hidden>
              <Screenshot
                variant="open"
                src="/screenshots/duo-open-kanji.webp"
                priority
                className="w-full shadow-2xl shadow-ai-600/25"
              />
            </div>
          </div>
        </section>

        {/* Romaji demo */}
        <section className="border-y border-ink-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            <p className="text-sm font-medium text-ink-500 sm:w-48 sm:text-right">No Japanese keyboard? No problem.</p>
            <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-3xl">
              <span className="rounded-2xl border border-ink-200 bg-ink-50 px-4 py-2 font-mono text-xl sm:text-2xl text-ink-700">
                taberu
              </span>
              <Arrow />
              <span className="font-japanese text-ink-500">たべる</span>
              <Arrow />
              <span className="font-mincho font-semibold text-sakura-600">食べる</span>
            </div>
          </div>
        </section>

        {/* Spotlights */}
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 space-y-24 sm:space-y-32">
          {SPOTLIGHTS.map((s, i) => (
            <section key={s.title} className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-center">
              <div className={i % 2 === 1 ? 'lg:order-2' : undefined}>
                <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-sakura-600">
                  <span aria-hidden className="font-mincho text-3xl normal-case tracking-normal text-sakura-500">
                    {s.kanji}
                  </span>
                  {s.eyebrow}
                </p>
                <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink-900">{s.title}</h2>
                <p className="mt-4 text-lg text-ink-600 leading-relaxed">{s.body}</p>
                <ul className="mt-6 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-3 text-ink-700">
                      <Check />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : undefined}>
                <div className="rounded-[2.5rem] bg-gradient-to-br from-ai-50 via-white to-sakura-50 border border-ink-100 p-5 sm:p-10">
                  <Screenshot
                    variant="open"
                    src={`/screenshots/duo-open-${s.shot}.webp`}
                    alt={s.alt}
                    className="w-full shadow-2xl shadow-ai-500/15"
                  />
                </div>
              </div>
            </section>
          ))}
        </div>

        <DuoSection />

        {/* Extras */}
        <section className="bg-ink-50/70 border-y border-ink-100">
          <div className="max-w-6xl mx-auto px-4 py-20 sm:py-24">
            <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-ink-900">And a little more</h2>
            <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXTRAS.map((f) => (
                <li key={f.title} className="rounded-2xl border border-ink-100 bg-white p-6">
                  <span aria-hidden className="text-2xl">{f.icon}</span>
                  <h3 className="mt-3 font-semibold text-ink-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-ink-900">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-mincho text-[22rem] leading-none text-white/[0.04]"
          >
            始
          </span>
          <div className="relative max-w-3xl mx-auto px-4 py-20 sm:py-24 text-center">
            <p className="font-japanese text-sakura-300">さあ、始めよう</p>
            <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white">Start learning Japanese today</h2>
            <p className="mt-4 text-ink-300">Free on the App Store, with an optional one-time purchase to remove ads.</p>
            <div className="mt-9 flex justify-center">
              <AppStoreButton inverted />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function DuoSection() {
  return (
    <section
      id="iphone-duo"
      className="relative overflow-hidden border-t border-ink-100 bg-gradient-to-b from-white via-ai-50/60 to-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-ai-200 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ai-600">
            <FoldIcon />
            Made for iPhone Duo
          </p>
          <h2 className="mt-5 text-3xl sm:text-5xl font-bold tracking-tight text-ink-900">
            Fold it. Unfold it.
            <br />
            <span className="text-sakura-600">JisokuDict fits either way.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">
            Closed, it&apos;s a quick pocket dictionary on the outer screen. Open it up and turn it sideways, and
            your search results sit right next to the entry you&apos;re reading.
          </p>
        </div>

        {/* Column widths follow the screens' pixel widths (1398 vs 2853) so both
            devices render at the same scale and the same height, as they are in hand. */}
        <div className="mt-16 grid grid-cols-[1398fr_2853fr] gap-4 sm:gap-10 items-start">
          <figure>
            <Screenshot
              variant="folded"
              src="/screenshots/duo-folded-home.webp"
              alt="JisokuDict on the folded iPhone Duo's outer screen showing Search, Word of the Day and cards due"
              className="w-full shadow-2xl shadow-ai-500/20"
            />
            <figcaption className="mt-4 text-center text-sm text-ink-500">
              <span className="font-semibold text-ink-800">Folded</span> · compact, one-handed
            </figcaption>
          </figure>
          <figure>
            <Screenshot
              variant="open"
              src="/screenshots/duo-open-home.webp"
              alt="JisokuDict on the unfolded iPhone Duo in landscape with the search sidebar beside Today"
              className="w-full shadow-2xl shadow-ai-500/20"
            />
            <figcaption className="mt-4 text-center text-sm text-ink-500">
              <span className="font-semibold text-ink-800">Unfolded</span> · search sidebar and content side by side
            </figcaption>
          </figure>
        </div>

        <ul className="mt-16 grid sm:grid-cols-3 gap-4">
          <DuoPoint title="Split view in landscape">
            Your search results stay in the sidebar while you read the entry next to them.
          </DuoPoint>
          <DuoPoint title="Portrait or landscape">
            Rotate the open Duo and the tab bar moves to the side so content gets the full width.
          </DuoPoint>
          <DuoPoint title="Every screen, both sizes">
            Words, kanji, study sessions and your stamp book all adapt to the outer and inner displays.
          </DuoPoint>
        </ul>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {['word', 'kanji', 'celebrate', 'stamps'].map((n) => (
            <Screenshot
              key={n}
              variant="folded"
              src={`/screenshots/duo-folded-${n}.webp`}
              alt={`JisokuDict ${n === 'celebrate' ? 'review complete' : n === 'stamps' ? 'stamp book' : n} screen on the folded iPhone Duo`}
              className="w-full shadow-lg"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function DuoPoint({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="rounded-2xl border border-ink-100 bg-white p-6">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{children}</p>
    </li>
  )
}

function AppStoreButton({ inverted = false }: { inverted?: boolean }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-2xl px-6 py-3.5 shadow-lg transition ${
        inverted ? 'bg-white text-ink-900 hover:bg-ink-50' : 'bg-ink-900 text-white hover:bg-ink-700'
      }`}
    >
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[11px] opacity-75">Download on the</span>
        <span className="block text-lg font-semibold -mt-0.5">App Store</span>
      </span>
    </a>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-sakura-500" fill="currentColor" aria-hidden>
      <path d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-300" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M5 12h14m-5-5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FoldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="3" y="4" width="8" height="16" rx="1.5" />
      <rect x="13" y="4" width="8" height="16" rx="1.5" />
    </svg>
  )
}
