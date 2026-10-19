# JisokuDict

Landing page and support site for **JisokuDict** - a Japanese-English dictionary app for iOS and macOS.

## Links

- **Website:** [jisoku.sukoshi.net](https://jisoku.sukoshi.net)
- **App Store:** [Download on the App Store](https://apps.apple.com/us/app/jisokudict/id6757970596)
- **Issues:** [Report a bug or request a feature](https://github.com/dnlosx/JisokuDict-Support/issues)

## About JisokuDict

JisokuDict is a fast, offline Japanese dictionary with over 200,000 entries. Features include:

- **Smart Search** - Auto-detects Japanese, English, or Romaji input
- **Romaji Support** - Type "konnichiwa" to find こんにちは
- **Kanji Lookup** - Search by reading, meaning, stroke count, or JLPT level
- **Favorites** - Save words and kanji for quick access
- **iCloud Sync** - Your favorites sync across all your devices
- **Works Offline** - Full dictionary available without internet

## Development

This is a Next.js site deployed on Railway.

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Build for production
```

## Pages

- `/` - Landing page
- `/support` - FAQ (with app screenshots) and contact form
- `/admin` - Inbox for contact-form messages (password-protected)
- `/privacy` - Privacy policy
- `/app-ads.txt` - AdMob verification

## Crawler policy

`public/robots.txt` permits Googlebot, Bingbot, and DuckDuckBot on public content and asks
other crawlers to stay out. Google-adstxt can read `/app-ads.txt` for AdMob.
`src/middleware.ts` returns 403 for recognized other bots and automation clients,
including on static assets and API routes; `/robots.txt` remains readable.
This also blocks other search crawlers and many social link previews.

This is a user-agent filter, not verified bot identity: clients can impersonate
a browser or an allowed crawler. Unknown clients (including requests with no
user agent) remain allowed. Stronger protection requires edge bot detection,
verified crawler identities, and rate limiting. The middleware runs on Railway,
so blocked requests still reach Railway. Robots rules do not replace route
authentication or prevent URLs from appearing in search results.

---

© 2025 JisokuDict
