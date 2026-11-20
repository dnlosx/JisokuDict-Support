import { ContactForm } from '@/components/ContactForm'
import { DeviceFrame } from '@/components/landing/DeviceFrame'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { localePath, type Locale } from '@/lib/i18n'

type Faq = { q: string; a: React.ReactNode }

type Topic = {
  id: string
  kanji: string
  title: string
  blurb: string
  /** An Indigo-theme capture in public/shots/en; without `file`, the drawn Settings screen. */
  shot: { file?: string; alt: string }
  faqs: Faq[]
}

const TOPICS: Record<Locale, Topic[]> = {
  en: [
    {
      id: 'purchases',
      kanji: '買',
      title: 'Purchases & ads',
      blurb: 'Removing ads, restoring a purchase, and refunds.',
      shot: { alt: 'Jisoku Settings showing Ads Removed and Restore Purchases' },
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
      shot: { file: 'favorites', alt: 'Jisoku Favorites list, which syncs through iCloud' },
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
      shot: { file: 'study', alt: 'Jisoku flashcard review with the Know and Don’t Know buttons' },
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
              Jisoku says notifications are disabled, allow them in the iOS Settings app first.
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
      shot: { file: 'search', alt: 'Jisoku search for “nomu” typed in romaji, finding the kanji 呑 and the word 飲む' },
      faqs: [
        {
          q: 'Do I need a Japanese keyboard?',
          a: (
            <>
              No. Search in English, kana or romaji: typing <Kbd>taberu</Kbd> finds 食べる. Jisoku works
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
  ],
  es: [
    {
      id: 'purchases',
      kanji: '買',
      title: 'Compras y anuncios',
      blurb: 'Quitar anuncios, restaurar una compra y reembolsos.',
      shot: { alt: 'Settings de Jisoku con Ads Removed y Restore Purchases' },
      faqs: [
        {
          q: '¿Cómo quito los anuncios?',
          a: (
            <>
              Toca el <Kbd>engrane</Kbd> arriba de la barra de búsqueda para abrir Settings y elige{' '}
              <Kbd>Remove Ads</Kbd> en la sección Premium. Es una compra única que elimina todos los
              anuncios.
            </>
          ),
        },
        {
          q: 'Ya pagué, pero sigo viendo anuncios',
          a: (
            <>
              Abre Settings y toca <Kbd>Restore Purchases</Kbd>. Asegúrate de haber iniciado sesión con la
              misma cuenta de Apple con la que hiciste la compra. También funciona en un iPhone, iPad o Mac
              nuevo.
            </>
          ),
        },
        {
          q: '¿Cómo pido un reembolso?',
          a: (
            <>
              Apple gestiona todos los pagos del App Store, así que los reembolsos se solicitan a Apple en{' '}
              <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer" className="link">
                reportaproblem.apple.com
              </a>
              . Nosotros no podemos verlos ni emitirlos.
            </>
          ),
        },
      ],
    },
    {
      id: 'sync',
      kanji: '雲',
      title: 'Sincronización y tus datos',
      blurb: 'iCloud, uso sin conexión y problemas con la búsqueda.',
      shot: { file: 'favorites', alt: 'Lista Favorites de Jisoku, que se sincroniza con iCloud' },
      faqs: [
        {
          q: '¿Mis datos tienen respaldo?',
          a: (
            <>
              Sí. Si iniciaste sesión en iCloud, tus favoritos, tarjetas, notas, historial de estudio e
              historial de búsqueda se sincronizan automáticamente entre tus dispositivos. No tienes que
              configurar nada.
            </>
          ),
        },
        {
          q: '¿La app funciona sin conexión?',
          a: (
            <>
              Sí. El diccionario completo está en tu dispositivo, así que buscar nunca requiere conexión. El
              audio se descarga la primera vez que lo reproduces y se guarda para usarlo sin conexión. Puedes
              borrarlo en Settings, en la sección Audio.
            </>
          ),
        },
        {
          q: 'Los resultados de búsqueda están mal o faltan',
          a: (
            <>
              Abre Settings, baja hasta Dictionary Data y toca <Kbd>Reset Dictionary Database</Kbd>. Esto
              vuelve a extraer el diccionario de la app. Tarda alrededor de un minuto, y tus favoritos y
              tarjetas se guardan por separado, así que no se ven afectados. Si no se arregla,{' '}
              <a href="#contact" className="link">avísanos</a>.
            </>
          ),
        },
      ],
    },
    {
      id: 'study',
      kanji: '習',
      title: 'Estudio y rachas',
      blurb: 'Tarjetas, recordatorios diarios y el libro de sellos.',
      shot: { file: 'study', alt: 'Repaso de tarjetas en Jisoku con los botones Know y Don’t Know' },
      faqs: [
        {
          q: '¿Cómo agrego palabras para estudiar?',
          a: (
            <>
              Abre cualquier palabra o kanji y toca <Kbd>Add to Study Deck</Kbd>. Las tarjetas pendientes
              aparecen en la pantalla Today y en la pestaña Study.
            </>
          ),
        },
        {
          q: '¿Cómo activo un recordatorio diario?',
          a: (
            <>
              En Settings, en la sección Notifications, activa <Kbd>Study Reminders</Kbd> y elige una hora.
              Si Jisoku indica que las notificaciones están desactivadas, primero permítelas en la app
              Configuración de iOS.
            </>
          ),
        },
        {
          q: '¿Qué son los sellos?',
          a: (
            <>
              Estudia varios días seguidos para ganar sellos a los 3 días, una semana, dos semanas, un mes y
              luego a los 50, 100, 200 y 365 días. Los sellos son tuyos para siempre, aunque se rompa la
              racha.
            </>
          ),
        },
      ],
    },
    {
      id: 'search',
      kanji: '探',
      title: 'Búsqueda y diccionario',
      blurb: 'Romaji, búsqueda con la cámara, kanji y widgets.',
      shot: { file: 'search', alt: 'Búsqueda de “nomu” escrito en romaji en Jisoku, que encuentra el kanji 呑 y la palabra 飲む' },
      faqs: [
        {
          q: '¿Necesito un teclado japonés?',
          a: (
            <>
              No. Puedes buscar en inglés, kana o romaji: al escribir <Kbd>taberu</Kbd> encuentras 食べる.
              Jisoku detecta cuál usaste. Las definiciones están en inglés.
            </>
          ),
        },
        {
          q: '¿Puedo buscar texto de una foto?',
          a: (
            <>
              Sí. Toca el ícono de la cámara o de la foto en la barra de búsqueda para leer japonés de un
              letrero, un menú o una captura de pantalla y buscarlo.
            </>
          ),
        },
        {
          q: '¿Cómo encuentro un kanji que no puedo escribir?',
          a: (
            <>
              Usa la pestaña Kanji para dibujarlo a mano, o filtra por número de trazos, lectura, significado
              o nivel del JLPT. En la búsqueda, prueba <Kbd>4 strokes</Kbd> o <Kbd>N5</Kbd>.
            </>
          ),
        },
        {
          q: '¿Cómo agrego el widget de la palabra del día?',
          a: (
            <>
              Mantén presionada la pantalla de inicio, toca <Kbd>+</Kbd> y busca &ldquo;Jisoku&rdquo;. Verás
              una palabra o un kanji nuevo cada día.
            </>
          ),
        },
      ],
    },
  ],
}

const STRINGS = {
  en: {
    eyebrow: 'Support',
    title: ['How can', 'we help?'],
    lead: 'Quick answers about purchases, sync, studying and search, plus a direct line to the developer when you need one.',
    uiNote: null,
    browse: 'Browse answers',
    sendMessage: 'Send a message',
    topicsLabel: 'Help topics',
    contact: 'Contact',
    contactTitle: ['Still stuck?', 'Write to us.'],
    contactLead:
      'Jisoku is made by one developer, who reads every message. Bug reports, ideas for new features and corrections to dictionary entries are all welcome.',
    tipsTitle: 'For bugs, it helps to include',
    tips: [
      'What you expected, and what happened instead',
      'The steps to make it happen again',
      'Your device, iOS version and app version (in Settings)',
    ],
    privacyNote: (link: React.ReactNode) => (
      <>Leave an email only if you&apos;d like a reply. It&apos;s used for nothing else; see the {link}.</>
    ),
    privacyLink: 'privacy policy',
  },
  es: {
    eyebrow: 'Soporte',
    title: ['¿Cómo podemos', 'ayudarte?'],
    lead: 'Respuestas rápidas sobre compras, sincronización, estudio y búsqueda, y una línea directa con el desarrollador cuando la necesites.',
    uiNote:
      'La app está en inglés y japonés, así que los nombres de botones y menús aparecen aquí tal como los verás en inglés.',
    browse: 'Ver respuestas',
    sendMessage: 'Enviar un mensaje',
    topicsLabel: 'Temas de ayuda',
    contact: 'Contacto',
    contactTitle: ['¿Sigues con dudas?', 'Escríbenos.'],
    contactLead:
      'Jisoku lo hace un solo desarrollador, que lee todos los mensajes. Puedes escribir en español. Los reportes de errores, las ideas para nuevas funciones y las correcciones al diccionario son bienvenidos.',
    tipsTitle: 'Si es un error, ayuda incluir',
    tips: [
      'Qué esperabas y qué pasó en cambio',
      'Los pasos para que vuelva a pasar',
      'Tu dispositivo, versión de iOS y versión de la app (en Settings)',
    ],
    privacyNote: (link: React.ReactNode) => (
      <>Deja tu correo solo si quieres una respuesta. No se usa para nada más; consulta la {link}.</>
    ),
    privacyLink: 'política de privacidad',
  },
}

export function SupportView({ locale }: { locale: Locale }) {
  const t = STRINGS[locale]
  const topics = TOPICS[locale]
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader active="support" locale={locale} translatedPath="/support" />

      <main className="flex-1 overflow-x-clip">
        <Hero t={t} firstTopic={topics[0].id} />

        <nav aria-label={t.topicsLabel} className="relative z-10 mx-auto -mt-8 max-w-6xl px-4">
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {topics.map((topic) => (
              <li key={topic.id}>
                <a
                  href={`#${topic.id}`}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-app hover:shadow-md sm:flex-row sm:items-start"
                >
                  <KanjiTile>{topic.kanji}</KanjiTile>
                  <span className="min-w-0">
                    <span className="block font-bold leading-snug text-ink-900">{topic.title}</span>
                    <span className="mt-1 block text-xs leading-snug text-ink-600">{topic.blurb}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:space-y-28 sm:py-24">
          {topics.map((topic, i) => (
            <TopicSection key={topic.id} topic={topic} flip={i % 2 === 1} />
          ))}
        </div>

        <section id="contact" className="scroll-mt-16 border-t border-ink-100 bg-app-bg">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
            <div>
              <Eyebrow>{t.contact}</Eyebrow>
              <h2 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-ink-900 sm:text-[2.75rem]">
                {t.contactTitle[0]} <span className="block text-app">{t.contactTitle[1]}</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-700">{t.contactLead}</p>
              <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
                <p className="font-bold text-ink-900">{t.tipsTitle}</p>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-700">
                  {t.tips.map((tip) => (
                    <Tip key={tip}>{tip}</Tip>
                  ))}
                </ul>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-ink-600">
                {t.privacyNote(
                  <a href={localePath(locale, '/privacy')} className="link">
                    {t.privacyLink}
                  </a>
                )}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <ContactForm locale={locale} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  )
}

function Hero({ t, firstTopic }: { t: (typeof STRINGS)[Locale]; firstTopic: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f7f8fd] to-[#e4e8f7]">
      <span
        aria-hidden
        lang="ja"
        className="pointer-events-none absolute -left-10 -top-16 select-none font-mincho text-[18rem] leading-none text-app/[0.06] sm:text-[24rem]"
      >
        助
      </span>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:pb-24 sm:pt-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow>
            <span className="font-japanese tracking-normal" lang="ja">サポート</span>
            <span aria-hidden>·</span>
            <span>{t.eyebrow}</span>
          </Eyebrow>
          <h1 className="mt-5 text-[2.6rem] font-black leading-[1.04] tracking-tight text-ink-900 sm:text-6xl">
            {t.title[0]} <span className="block text-app">{t.title[1]}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">{t.lead}</p>
          {t.uiNote && <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-600">{t.uiNote}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`#${firstTopic}`}
              className="inline-flex items-center rounded-2xl bg-ink-900 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-ink-700 active:scale-[0.98]"
            >
              {t.browse}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-ink-900/15 bg-white/70 px-5 py-3.5 font-semibold text-ink-900 transition hover:border-app hover:text-app"
            >
              {t.sendMessage}
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 8h10m-4-4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>

        {/* Two phones rising from the hero's bottom edge, which clips them. */}
        <div className="relative mx-auto -mb-20 h-[400px] w-full max-w-[460px] sm:-mb-24 sm:h-[520px]" aria-hidden>
          <div className="absolute left-0 top-12 w-[52%] -rotate-[6deg]">
            <DeviceFrame>
              <Shot file="word" />
            </DeviceFrame>
          </div>
          <div className="absolute right-0 top-0 w-[58%] rotate-[4deg]">
            <DeviceFrame>
              <Shot file="kanji" priority />
            </DeviceFrame>
          </div>
        </div>
      </div>
    </section>
  )
}

function TopicSection({ topic, flip }: { topic: Topic; flip: boolean }) {
  return (
    <section id={topic.id} className="grid scroll-mt-24 items-start gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={flip ? 'lg:order-2' : undefined}>
        <div className="flex items-center gap-3.5">
          <KanjiTile large>{topic.kanji}</KanjiTile>
          <h2 className="text-3xl font-black leading-[1.1] tracking-tight text-ink-900 sm:text-4xl">{topic.title}</h2>
        </div>
        <div className="mt-7 divide-y divide-ink-100 border-y border-ink-100">
          {topic.faqs.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[17px] font-semibold text-ink-900 transition hover:text-app [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-ink-400 transition group-open:rotate-45 group-open:text-app" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                  <path d="M10 4v12M4 10h12" />
                </svg>
              </summary>
              <p className="pb-5 pr-8 leading-relaxed text-ink-700">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className={`lg:sticky lg:top-24 ${flip ? 'lg:order-1' : ''}`}>
        <div className="rounded-3xl border border-ink-100 bg-app-bg px-6 py-8 sm:py-10">
          <DeviceFrame statusBar={!topic.shot.file} className="max-w-[250px]">
            {topic.shot.file ? <Shot file={topic.shot.file} alt={topic.shot.alt} /> : <SettingsScreen label={topic.shot.alt} />}
          </DeviceFrame>
        </div>
      </div>
    </section>
  )
}

/** An iPhone capture from public/shots/en, sized for DeviceFrame's screen. */
function Shot({ file, alt = '', priority = false }: { file: string; alt?: string; priority?: boolean }) {
  return <img src={`/shots/en/${file}.webp`} alt={alt} width={660} height={1435} loading={priority ? 'eager' : 'lazy'} decoding="async" />
}

/**
 * The app's Settings screen with Remove Ads bought, drawn in the Indigo theme
 * (there is no capture of it). Sizes are in em, where 1em is 17 iOS points at
 * the frame's width; labels are the app's own English ones in both locales.
 */
function SettingsScreen({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="h-full bg-app-bg px-[0.95em] text-left text-ink-900"
      style={{ fontSize: 'calc(var(--pt) * 17)', paddingTop: 'calc(var(--safe-top) + 0.5em)' }}
    >
      <span className="inline-flex rounded-full bg-white px-[0.9em] py-[0.5em] font-medium leading-none text-app shadow-sm">Done</span>
      <p className="mt-[0.45em] text-[2em] font-bold leading-tight tracking-tight">Settings</p>

      <SettingsGroup title="Premium">
        <SettingsRow>
          <svg viewBox="0 0 24 24" className="h-[1.3em] w-[1.3em] shrink-0 text-green-600" fill="currentColor">
            <path d="M12 1.8l2.3 1.9 3-.2.9 2.9 2.5 1.6-1 2.8 1 2.8-2.5 1.6-.9 2.9-3-.2L12 22.2l-2.3-1.9-3 .2-.9-2.9-2.5-1.6 1-2.8-1-2.8 2.5-1.6.9-2.9 3 .2z" />
            <path d="M8.3 12.3l2.6 2.6 4.9-5.2" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-green-600">Ads Removed</span>
          <span className="ml-auto text-ink-400">Purchased</span>
        </SettingsRow>
        <SettingsRow>
          <svg viewBox="0 0 24 24" className="h-[1.3em] w-[1.3em] shrink-0 text-app" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.5 12a7.5 7.5 0 11-2.4-5.5M19.6 3.2v3.9h-3.9" />
          </svg>
          <span className="text-app">Restore Purchases</span>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Display">
        <SettingsRow>
          <span>Reading Format</span>
          <span className="ml-auto text-app">Hiragana</span>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Audio">
        <SettingsRow>
          <span>Auto-Play in Flashcards</span>
          <span className="ml-auto text-app">Off</span>
        </SettingsRow>
        <SettingsRow>
          <span>Cached Audio</span>
          <span className="ml-auto text-ink-400">12 MB</span>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Notifications">
        <SettingsRow>
          <span>Study Reminders</span>
          <span className="ml-auto flex h-[1.8em] w-[3em] items-center justify-end rounded-full bg-app p-[0.12em]">
            <span className="h-full w-[1.56em] rounded-full bg-white shadow-sm" />
          </span>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Data">
        <SettingsRow>
          <svg viewBox="0 0 24 24" className="h-[1.3em] w-[1.3em] shrink-0 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 12a7.5 7.5 0 102.4-5.5M4.4 3.2v3.9h3.9" />
          </svg>
          <span className="text-red-600">Reset Dictionary Database</span>
        </SettingsRow>
      </SettingsGroup>
    </div>
  )
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-[1.25em]">
      <p className="mb-[0.45em] px-[0.95em] text-[0.9em] font-semibold text-ink-500">{title}</p>
      <div className="divide-y divide-ink-100 rounded-[1.5em] bg-white px-[0.95em]">{children}</div>
    </div>
  )
}

function SettingsRow({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[3em] items-center gap-[0.7em] whitespace-nowrap leading-none">{children}</div>
}

/** The landing page's black pill label. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
      {children}
    </p>
  )
}

function KanjiTile({ children, large = false }: { children: React.ReactNode; large?: boolean }) {
  return (
    <span
      aria-hidden
      lang="ja"
      className={`flex shrink-0 items-center justify-center bg-app-soft font-japanese text-app ${
        large ? 'h-12 w-12 rounded-2xl text-2xl' : 'h-10 w-10 rounded-xl text-lg'
      }`}
    >
      {children}
    </span>
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
      <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-app" fill="currentColor" aria-hidden>
        <path d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" />
      </svg>
      <span>{children}</span>
    </li>
  )
}
