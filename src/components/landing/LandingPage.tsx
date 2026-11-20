import Link from 'next/link'

import { DemoQueryButton } from '@/components/demo/DemoQueryButton'
import { DictionaryDemo } from '@/components/demo/DictionaryDemo'
import { FlashcardDemo } from '@/components/demo/FlashcardDemo'
import { PitchCompare } from '@/components/demo/PitchCompare'
import { StrokePlayer } from '@/components/demo/StrokePlayer'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { APP_STORE_ID, APP_STORE_URLS, SITE_URL } from '@/lib/site'

import { LANDING_COPY, type LandingCopy, type LandingLocale } from './copy'

const HERO_QUERIES = ['eat', 'taberu', '食べました', 'hashi', '桜']

export function LandingPage({ locale }: { locale: LandingLocale }) {
  const c = LANDING_COPY[locale]
  const storeUrl = APP_STORE_URLS[locale]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StructuredData locale={locale} copy={c} />
      <SiteHeader locale={locale} landing />

      <main className="flex-1 overflow-x-clip">
        {/* Hero: the pitch on one side, the app itself on the other */}
        <section className="bg-gradient-to-b from-[#f7f8fd] to-[#e4e8f7]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 sm:pt-16 lg:grid-cols-[1fr_390px] lg:gap-16 lg:pb-16">
            <div>
              <Eyebrow>{c.hero.eyebrow}</Eyebrow>
              <h1 className="mt-5 text-[2.6rem] font-black leading-[1.04] tracking-tight text-ink-900 sm:text-6xl lg:text-[4.2rem]">
                {c.hero.title[0]} <span className="block text-app">{c.hero.title[1]}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">{c.hero.lead}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <AppStoreButton href={storeUrl} copy={c} />
                <a href="#demo" className="inline-flex items-center gap-1.5 rounded-2xl border border-ink-900/15 bg-white/70 px-5 py-[1.05rem] font-semibold text-ink-900 transition hover:border-app hover:text-app lg:hidden">
                  {c.hero.tryDemo}
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M8 3v10m-4-4l4 4 4-4" />
                  </svg>
                </a>
              </div>
              <p className="mt-4 text-sm text-ink-600">{c.hero.note}</p>
            </div>

            <div id="demo" className="scroll-mt-20">
              <PhoneFrame label={c.hero.demoLabel}>
                <DictionaryDemo locale={locale} appStoreUrl={storeUrl} />
              </PhoneFrame>
              <p className="mx-auto mt-4 max-w-[390px] text-center text-sm leading-relaxed text-ink-600">{c.hero.demoCaption}</p>
              <div className="mx-auto mt-3 flex max-w-[390px] flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-ink-600">{c.hero.tryLabel}</span>
                {HERO_QUERIES.map((q) => (
                  <DemoQueryButton key={q} query={q} className={CHIP} />
                ))}
              </div>
            </div>
          </div>
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-6 border-t border-ink-900/10 px-4 py-8 sm:grid-cols-4 sm:py-10">
            {c.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-sm text-ink-600">{s.label}</dt>
                <dd className="text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div id="features" className="scroll-mt-16">
          {/* Search */}
          <Section>
            <SectionText eyebrow={c.search.eyebrow} title={c.search.title} body={c.search.body} points={c.search.points} />
            <div className="rounded-3xl border border-ink-100 bg-app-bg p-5 sm:p-7">
              <ol className="space-y-3">
                {(
                  [
                    ['food', '食品', 'しょくひん', 'food; food products'],
                    ['benkyou', '勉強', 'べんきょう', 'study; diligence'],
                    ['食べました', '食べる', 'たべる', 'to eat'],
                  ] as const
                ).map(([typed, word, reading, gloss], i) => (
                  <li key={typed} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm sm:gap-4 sm:p-4">
                    <span className="w-[6.2rem] shrink-0 truncate rounded-lg bg-ink-900 px-2.5 py-1.5 text-center font-mono text-[13px] text-white sm:w-28">{typed}</span>
                    <Arrow />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-japanese text-xl font-semibold text-ink-900" lang="ja">{word}</span>
                        <span className="font-japanese text-sm text-ink-500" lang="ja">{reading}</span>
                      </span>
                      <span className="block truncate text-sm text-ink-600">
                        {gloss}
                        {i === 2 && <span className="text-app"> · {locale === 'ja' ? '丁寧過去形' : 'Polite Past'}</span>}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-ink-600">{c.search.tryLabel}</span>
                {c.search.queries.map((q) => (
                  <DemoQueryButton key={q} query={q} className={CHIP} />
                ))}
              </div>
            </div>
          </Section>

          {/* Pitch accent */}
          <Section tinted flip>
            <div>
              <SectionText eyebrow={c.pitch.eyebrow} title={c.pitch.title} body={c.pitch.body} />
              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-4">
                <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-app text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none" />
                    <path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-bold text-ink-900">{c.pitch.practice.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{c.pitch.practice.body}</p>
                </div>
              </div>
            </div>
            <PitchCompare locale={locale} />
          </Section>

          {/* Kanji */}
          <Section>
            <SectionText eyebrow={c.kanji.eyebrow} title={c.kanji.title} body={c.kanji.body} points={c.kanji.points} />
            <StrokePlayer locale={locale} />
          </Section>

          {/* Camera, handwriting, Word Finder: real screens, since these need the device */}
          <section className="border-y border-ink-100 bg-gradient-to-b from-[#f7f8fd] to-[#eceff9]">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
              <div className="max-w-2xl">
                <SectionText eyebrow={c.input.eyebrow} title={c.input.title} body={c.input.body} />
              </div>
              <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:px-0">
                {c.input.shots.map((shot) => (
                  <li key={shot.file} className="w-[72vw] max-w-[300px] shrink-0 snap-center sm:w-auto sm:max-w-none">
                    <figure>
                      <img
                        src={`/shots/${locale}/${shot.file}.webp`}
                        alt={shot.alt}
                        width={660}
                        height={1435}
                        loading="lazy"
                        decoding="async"
                        className="mx-auto w-full max-w-[300px] rounded-[2rem] border-[6px] border-ink-900 bg-white shadow-xl shadow-ai-900/15"
                      />
                      <figcaption className="mx-auto mt-5 max-w-[300px]">
                        <h3 className="text-lg font-bold text-ink-900">{shot.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{shot.body}</p>
                        {shot.credit && <p className="mt-2 text-xs text-ink-500">{shot.credit}</p>}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Study */}
          <Section flip>
            <SectionText eyebrow={c.study.eyebrow} title={c.study.title} body={c.study.body} points={c.study.points} />
            <div className="mx-auto w-full max-w-md">
              <FlashcardDemo locale={locale} />
            </div>
          </Section>

          {/* Everything else */}
          <section className="border-t border-ink-100 bg-app-bg">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
              <Eyebrow>{c.more.eyebrow}</Eyebrow>
              <H2 title={c.more.title} />
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {c.more.items.map((item) => (
                  <li key={item.title} className="rounded-2xl bg-white p-5 shadow-sm">
                    <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-soft font-japanese text-lg text-app">
                      {item.icon}
                    </span>
                    <h3 className="mt-4 font-bold text-ink-900">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
            <Eyebrow>{c.faq.eyebrow}</Eyebrow>
            <H2 title={c.faq.title} />
            <div className="mt-8 divide-y divide-ink-100 border-y border-ink-100">
              {c.faq.items.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[17px] font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-ink-400 transition group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                      <path d="M10 4v12M4 10h12" />
                    </svg>
                  </summary>
                  <p className="pb-5 pr-8 leading-relaxed text-ink-700">{item.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink-600">
              {c.faq.more}{' '}
              <Link href="/support" className="font-medium text-app underline decoration-ai-200 underline-offset-2 hover:decoration-ai-400">
                {c.faq.supportLink}
              </Link>
              {locale === 'ja' ? 'へ。' : '.'}
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-ink-900">
          <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-mincho text-[22rem] leading-none text-white/[0.05]" lang="ja">
            言
          </span>
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-24">
            <p className="font-japanese text-ai-300" lang="ja">{c.cta.kicker}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">{c.cta.title}</h2>
            <p className="mt-4 text-ink-200">{c.cta.body}</p>
            <div className="mt-9 flex justify-center">
              <AppStoreButton href={storeUrl} copy={c} inverted />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} credits />
    </div>
  )
}

const CHIP =
  'rounded-full border border-ink-200 bg-white px-3 py-1.5 font-japanese text-sm font-medium text-ink-800 transition hover:border-app hover:text-app active:scale-95'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex rounded-full bg-ink-900 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">{children}</p>
  )
}

function H2({ title }: { title: LandingCopy['search']['title'] }) {
  return (
    <h2 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-ink-900 sm:text-[2.75rem]">
      {title[0]} <span className="block text-app">{title[1]}</span>
    </h2>
  )
}

function SectionText({ eyebrow, title, body, points }: { eyebrow: string; title: LandingCopy['search']['title']; body: string; points?: string[] }) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <H2 title={title} />
      <p className="mt-5 text-lg leading-relaxed text-ink-700">{body}</p>
      {points && (
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex gap-3 leading-relaxed text-ink-700">
              <svg viewBox="0 0 20 20" className="mt-1 h-5 w-5 shrink-0 text-app" fill="currentColor" aria-hidden>
                <path d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" />
              </svg>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Two columns on desktop, text first on phones whichever side it sits on. */
function Section({ children, tinted = false, flip = false }: { children: [React.ReactNode, React.ReactNode]; tinted?: boolean; flip?: boolean }) {
  return (
    <section className={tinted ? 'border-y border-ink-100 bg-app-bg' : undefined}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div className={flip ? 'lg:order-2' : undefined}>{children[0]}</div>
        <div className={`min-w-0 ${flip ? 'lg:order-1' : ''}`}>{children[1]}</div>
      </div>
    </section>
  )
}

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div role="region" aria-label={label} className="mx-auto w-full max-w-[390px] rounded-[2.9rem] bg-ink-900 p-[10px] shadow-2xl shadow-ai-900/30">
      <div className="h-[min(40rem,calc(100svh-11rem))] min-h-[30rem] overflow-hidden rounded-[2.3rem] bg-white lg:h-[min(43rem,calc(100svh-7rem))]">{children}</div>
    </div>
  )
}

function AppStoreButton({ href, copy, inverted = false }: { href: string; copy: LandingCopy; inverted?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={copy.store.label}
      className={`inline-flex items-center gap-3 rounded-2xl px-6 py-3.5 shadow-lg transition active:scale-[0.98] ${
        inverted ? 'bg-white text-ink-900 hover:bg-ink-50' : 'bg-ink-900 text-white hover:bg-ink-700'
      }`}
    >
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[11px] opacity-75">{copy.store.small}</span>
        <span className="-mt-0.5 block text-lg font-semibold">{copy.store.big}</span>
      </span>
    </a>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-300" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M5 12h14m-5-5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** schema.org data: the app itself, and the page's questions and answers. */
function StructuredData({ locale, copy }: { locale: LandingLocale; copy: LandingCopy }) {
  const url = locale === 'ja' ? `${SITE_URL}/ja` : SITE_URL
  const graph = [
    {
      '@type': 'MobileApplication',
      '@id': `${SITE_URL}/#app`,
      name: locale === 'ja' ? 'Jisoku - 英和・和英辞書と漢字' : 'Jisoku - Japanese Dictionary',
      alternateName: ['Jisoku', 'JisokuDict', 'Japanese Dictionary - Jisoku'],
      description: copy.meta.description,
      url,
      image: `${SITE_URL}/app-icon.png`,
      screenshot: `${SITE_URL}/og/${locale}.png`,
      operatingSystem: 'iOS 18.4 or later, iPadOS 18.4 or later, macOS (Apple silicon)',
      applicationCategory: 'ReferenceApplication',
      applicationSubCategory: 'Dictionary',
      inLanguage: ['en', 'ja'],
      isAccessibleForFree: true,
      installUrl: APP_STORE_URLS[locale],
      downloadUrl: APP_STORE_URLS[locale],
      offers: { '@type': 'Offer', price: '0', priceCurrency: locale === 'ja' ? 'JPY' : 'USD' },
      identifier: APP_STORE_ID,
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      inLanguage: locale,
      mainEntity: copy.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ]
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c') }}
    />
  )
}
