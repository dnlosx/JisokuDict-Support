import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-100 py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-ink-500 text-sm">© {new Date().getFullYear()} JisokuDict</p>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/support" className="text-ink-500 hover:text-ink-900 transition">
            Support
          </Link>
          <Link href="/privacy" className="text-ink-500 hover:text-ink-900 transition">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
