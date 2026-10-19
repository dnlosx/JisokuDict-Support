import type { Metadata } from 'next'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Support - JisokuDict',
  description:
    'Answers to common JisokuDict questions about purchases, iCloud sync, study and search, plus a form to reach the developer.',
}

type Faq = { q: string; a: React.ReactNode }

type Topic = {
  id: string
  kanji: string
  title: string
  blurb: string
  shot: { src: string; alt: string; crop?: boolean }
  faqs: Faq[]
}

const TOPICS: Topic[] = [
  {
    id: 'purchases',
    kanji: '買',
    title: 'Purchases & ads',
    blurb: 'Removing ads, restoring a purchase, and refunds.',
    shot: { src: '/screenshots/settings.webp', alt: 'JisokuDict Settings showing Ads Removed and Restore Purchases' },
    faqs: [
      {
        q: 'How do I remove ads?',
        a: (
          <>
            Tap the <Kbd>gear</Kbd> above the search bar to open Settings, then choose{' '}
            <Kbd>Remove Ads</Kbd> under Premium. It&apos;s a one-time purchase that removes every banner
            ad.
          </>
        ),
      },
      {
        q: 'I already paid, but I still see ads',
        a: (
          <>
            Open Settings and tap <Kbd>Restore Purchases</Kbd>. Make sure you&apos;re signed in with the
            same Apple Account you used to buy it. This also works on a new iPhone, iPad or Mac.
          </>
        ),
      },
      {
        q: 'How do I get a refund?',
        a: (
          <>
            Apple handles every App Store payment, so refunds are requested from Apple at{' '}
            <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer" className="link">
              reportaproblem.apple.com
            </a>
            . We can&apos;t see or issue them ourselves.
          </>
        ),
      },
    ],
  },
  {
    id: 'sync',
    kanji: '雲',
    title: 'Sync & your data',
    blurb: 'iCloud, offline use, and fixing search problems.',
    shot: { src: '/screenshots/today.webp', alt: 'JisokuDict Today screen with Word of the Day and cards due', crop: true },
    faqs: [
      {
        q: 'Is my data backed up?',
        a: (
          <>
            Yes. If you&apos;re signed in to iCloud, your favorites, flashcards, notes, study history and
            search history sync automatically across your devices. Nothing to set up.
          </>
        ),
      },
      {
        q: 'Does the app work offline?',
        a: (
          <>
            Yes. The whole dictionary lives on your device, so search never needs a connection. Audio is
            downloaded the first time you play it and then kept for offline use. You can clear it in
            Settings under Audio.
          </>
        ),
      },
      {
        q: 'Search results look wrong or are missing',
        a: (
          <>
            Open Settings, scroll to Dictionary Data and tap <Kbd>Reset Dictionary Database</Kbd>. It
            re-extracts the dictionary from the app. It takes about a minute, and your favorites and
            flashcards are stored separately so they aren&apos;t affected. If that doesn&apos;t fix it, <a href="#contact" className="link">let us know</a>.
          </>
        ),
      },
    ],
  },
  {
    id: 'study',
    kanji: '習',
    title: 'Study & streaks',
    blurb: 'Flashcards, daily reminders and the stamp book.',
    shot: { src: '/screenshots/stamps.webp', alt: 'JisokuDict Stamp Book with streak stamps earned' },
    faqs: [
      {
        q: 'How do I add words to study?',
        a: (
          <>
            Open any word or kanji and tap <Kbd>Add to Study Deck</Kbd>. Cards that are due show up on the
            Today screen and in the Study tab.
          </>
        ),
      },
      {
        q: 'How do I get a daily reminder?',
        a: (
          <>
            In Settings, under Notifications, turn on <Kbd>Study Reminders</Kbd> and pick a time. If
            JisokuDict says notifications are disabled, allow them in the iOS Settings app first.
          </>
        ),
      },
      {
        q: 'What are stamps?',
        a: (
          <>
            Study on consecutive days to earn stamps at 3 days, a week, two weeks, a month, then 50, 100,
            200 and 365 days. Stamps are yours to keep, even if a streak ends.
          </>
        ),
      },
    ],
  },
  {
    id: 'search',
    kanji: '探',
    title: 'Search & dictionary',
    blurb: 'Romaji, camera search, kanji lookup and widgets.',
    shot: { src: '/screenshots/kanji.webp', alt: 'JisokuDict kanji page for 桜 with stroke order and readings' },
    faqs: [
      {
        q: 'Do I need a Japanese keyboard?',
        a: (
          <>
            No. Search in English, kana or romaji: typing <Kbd>taberu</Kbd> finds 食べる. JisokuDict works
            out which one you meant.
          </>
        ),
      },
      {
        q: 'Can I look up text from a photo?',
        a: (
          <>
            Yes. Tap the camera or photo icon in the search bar to read Japanese from a sign, menu or
            screenshot and look it up.
          </>
        ),
      },
      {
        q: 'How do I find a kanji I can’t type?',
        a: (
          <>
            Use the Kanji tab to draw it by hand, or filter by stroke count, reading, meaning or JLPT
            level. In search, try <Kbd>4 strokes</Kbd> or <Kbd>N5</Kbd>.
          </>
        ),
      },
      {
        q: 'How do I add the Word of the Day widget?',
        a: (
          <>
            Touch and hold your Home Screen, tap <Kbd>+</Kbd>, then search for &ldquo;Jisoku&rdquo;. You&apos;ll
            get a new word or kanji each day.
          </>
        ),
      },
    ],
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader active="support" />

      <main className="flex-1">
        <Hero />

        <nav aria-label="Help topics" className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {TOPICS.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="group flex h-full items-start gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sakura-200 hover:shadow-md"
                >
                  <span
                    aria-hidden
                    className="font-mincho text-2xl leading-none text-sakura-500 transition group-hover:text-sakura-600"
                  >
                    {t.kanji}
                  </span>
                  <span>
                    <span className="block font-medium text-ink-900">{t.title}</span>
                    <span className="mt-0.5 block text-xs text-ink-500 leading-snug">{t.blurb}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-24 space-y-20 sm:space-y-28">
          {TOPICS.map((t, i) => (
            <TopicSection key={t.id} topic={t} flip={i % 2 === 1} />
          ))}
        </div>

        <section id="contact" className="scroll-mt-20 bg-ink-50/70 border-t border-ink-100">
          <div className="max-w-6xl mx-auto px-4 py-20 sm:py-24 grid lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sakura-600">Contact</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-ink-900">
                Still stuck? Write to us.
              </h2>
              <p className="mt-4 text-ink-600 leading-relaxed">
                JisokuDict is made by one developer, who reads every message. Bug reports, ideas for new
                features and corrections to dictionary entries are all welcome.
              </p>
              <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-5">
                <p className="text-sm font-medium text-ink-900">For bugs, it helps to include</p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <Tip>What you expected, and what happened instead</Tip>
                  <Tip>The steps to make it happen again</Tip>
                  <Tip>Your device, iOS version and app version (in Settings)</Tip>
                </ul>
              </div>
              <p className="mt-6 text-xs text-ink-500 leading-relaxed">
                Leave an email only if you&apos;d like a reply. It&apos;s used for nothing else; see the{' '}
                <a href="/privacy" className="link">privacy policy</a>.
              </p>
            </div>

            <div className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-sakura-50/70 via-white to-ai-50/40">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-16 select-none font-mincho text-[18rem] leading-none text-sakura-100/70 sm:text-[24rem]"
      >
        助
      </span>

      <div className="relative max-w-6xl mx-auto px-4 pt-14 pb-20 sm:pt-20 sm:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sakura-600">
            <span className="font-japanese tracking-normal">サポート</span> · Support
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-900">
            How can we help?
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-600 leading-relaxed">
            Quick answers about purchases, sync, studying and search, plus a direct line to the developer
            when you need one.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#purchases"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-ink-700"
            >
              Browse answers
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-3 text-sm font-medium text-ink-800 transition hover:border-sakura-300 hover:text-sakura-700"
            >
              Send a message
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto h-[360px] w-full max-w-[440px] sm:h-[440px]" aria-hidden>
          <Shot
            src="/screenshots/word.webp"
            className="absolute left-0 top-6 w-[62%] -rotate-[5deg] opacity-95"
          />
          <Shot
            src="/screenshots/kanji.webp"
            className="absolute right-0 top-0 w-[66%] rotate-[3deg] shadow-2xl shadow-ai-500/20"
          />
        </div>
      </div>
    </section>
  )
}

function TopicSection({ topic, flip }: { topic: Topic; flip: boolean }) {
  return (
    <section id={topic.id} className="scroll-mt-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      <div className={flip ? 'lg:order-2' : undefined}>
        <div className="flex items-center gap-3">
          <span aria-hidden className="font-mincho text-4xl leading-none text-sakura-500">
            {topic.kanji}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-900">{topic.title}</h2>
        </div>
        <div className="mt-6 divide-y divide-ink-100 border-y border-ink-100">
          {topic.faqs.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium text-ink-900 transition hover:text-sakura-700 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-500 transition group-open:rotate-45 group-open:border-sakura-300 group-open:text-sakura-600"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 pr-10 text-ink-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className={`lg:sticky lg:top-24 ${flip ? 'lg:order-1' : ''}`}>
        <div className="rounded-[2rem] bg-gradient-to-br from-ai-50 via-white to-sakura-50 p-6 sm:p-10 border border-ink-100">
          {topic.shot.crop ? (
            <img
              src={topic.shot.src}
              alt={topic.shot.alt}
              width={985}
              height={560}
              loading="lazy"
              className="w-full rounded-2xl border border-ink-100 bg-white shadow-xl shadow-ai-500/10"
            />
          ) : (
            <Shot src={topic.shot.src} alt={topic.shot.alt} className="mx-auto w-full max-w-[300px]" />
          )}
        </div>
      </div>
    </section>
  )
}

function Shot({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={985}
      height={1400}
      loading="lazy"
      className={`rounded-[1.6rem] border-[6px] border-ink-900 bg-white shadow-xl ${className}`}
    />
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[0.9em] font-medium text-ink-800">
      {children}
    </span>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sakura-400" />
      {children}
    </li>
  )
}
