import Link from 'next/link'

const APP_STORE_URL = 'https://apps.apple.com/us/app/jisokudict/id6757970596'

type Props = {
  active?: 'support' | 'privacy'
}

export function SiteHeader({ active }: Props) {
  return (
    <header className="border-b border-ink-100">
      <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-ink-900">
          JisokuDict
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/support"
            className={
              active === 'support'
                ? 'text-sakura-600 font-medium'
                : 'text-ink-600 hover:text-ink-900 transition'
            }
          >
            Support
          </Link>
          <Link
            href="/privacy"
            className={
              active === 'privacy'
                ? 'text-sakura-600 font-medium'
                : 'text-ink-600 hover:text-ink-900 transition'
            }
          >
            Privacy
          </Link>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-700 transition"
          >
            Download
          </a>
        </div>
      </nav>
    </header>
  )
}
