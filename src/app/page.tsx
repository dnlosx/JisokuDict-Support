import Link from 'next/link'

const APP_STORE_URL = 'https://apps.apple.com/us/app/jisokudict/id6757970596'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-ink-100">
        <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-ink-900">
            JisokuDict
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/support" className="text-ink-600 hover:text-ink-900 transition">
              Support
            </Link>
            <Link href="/privacy" className="text-ink-600 hover:text-ink-900 transition">
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <img
              src="https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/7a/43/4e/7a434e50-9657-d623-17d9-14ef469ecc83/Placeholder.mill/400x400bb-75.webp"
              alt="JisokuDict Logo"
              width={150}
              height={150}
              className="mx-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink-900 mb-4">
            JisokuDict
          </h1>
          <p className="text-xl text-ink-600 mb-8 max-w-2xl mx-auto">
            A fast, offline Japanese-English dictionary for iOS and macOS with over 200,000 entries.
          </p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-ink-700 transition shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download on the App Store
          </a>
        </section>

        {/* Features Section */}
        <section className="bg-ink-50 py-20">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-ink-900 mb-12">Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon="🔍"
                title="Smart Search"
                description="Auto-detects Japanese, English, or Romaji input for seamless searching."
              />
              <FeatureCard
                icon="あ"
                title="Romaji Support"
                description='Type "konnichiwa" to find こんにちは - no Japanese keyboard needed.'
              />
              <FeatureCard
                icon="漢"
                title="Kanji Lookup"
                description="Search by reading, meaning, stroke count, or JLPT level."
              />
              <FeatureCard
                icon="⭐"
                title="Favorites"
                description="Save words and kanji for quick access and review."
              />
              <FeatureCard
                icon="☁️"
                title="iCloud Sync"
                description="Your favorites sync automatically across all your devices."
              />
              <FeatureCard
                icon="📴"
                title="Works Offline"
                description="Full dictionary available without an internet connection."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-ink-900 mb-4">
              Start Learning Japanese Today
            </h2>
            <p className="text-ink-600 mb-8">
              Download JisokuDict for free on the App Store.
            </p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sakura-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-sakura-600 transition shadow-lg"
            >
              Get the App
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ink-500 text-sm">
            © {new Date().getFullYear()} JisokuDict
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/support" className="text-ink-500 hover:text-ink-900 transition">
              Support
            </Link>
            <Link href="/privacy" className="text-ink-500 hover:text-ink-900 transition">
              Privacy Policy
            </Link>
            <a
              href="https://github.com/dnlosx/JisokuDict-Support/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-500 hover:text-ink-900 transition"
            >
              Report an Issue
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-ink-100">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-ink-900 mb-2">{title}</h3>
      <p className="text-ink-600">{description}</p>
    </div>
  )
}
