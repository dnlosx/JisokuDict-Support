import Link from 'next/link'

export const APP_STORE_URL = 'https://apps.apple.com/us/app/jisokudict/id6757970596'

type Props = {
  active?: 'support' | 'privacy'
}

export function SiteHeader({ active }: Props) {
  const linkClass = (name: Props['active']) =>
    active === name
      ? 'text-ink-900 font-medium'
      : 'text-ink-500 hover:text-ink-900 transition'

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/80 bg-white/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-ink-900 font-semibold tracking-tight">
          <img src="/app-icon.png" alt="" width={32} height={32} className="rounded-[9px] shadow-sm" />
          JisokuDict
        </Link>
        <div className="flex items-center gap-5 sm:gap-7 text-sm">
          <Link href="/support" className={linkClass('support')} aria-current={active === 'support' ? 'page' : undefined}>
            Support
          </Link>
          <Link href="/privacy" className={linkClass('privacy')} aria-current={active === 'privacy' ? 'page' : undefined}>
            Privacy
          </Link>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex bg-ink-900 text-white px-4 py-2 rounded-full hover:bg-ink-700 transition"
          >
            Download
          </a>
        </div>
      </nav>
    </header>
  )
}
