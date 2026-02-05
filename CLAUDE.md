# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands

```bash
npm run dev       # Start Next.js dev server (http://localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Architecture

This is a simple Next.js 15 site for the JisokuDict iOS app. It serves as a landing page, support center, and hosts the `app-ads.txt` file for AdMob verification.

### Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with app features and App Store link |
| `/support` | Support page with FAQ and bug reporting info |
| `/privacy` | Privacy policy |
| `/app-ads.txt` | AdMob verification file (served from `public/`) |

### Project Structure

```
src/app/
├── page.tsx           # Landing page
├── layout.tsx         # Root layout with metadata
├── globals.css        # Tailwind styles
├── support/page.tsx   # Support & FAQ
└── privacy/page.tsx   # Privacy policy

public/
└── app-ads.txt        # AdMob verification
```

### Design

Uses a subset of the sukoshi.net design system:
- `sakura` - Pink accent color
- `ink` - Gray text colors

## Deployment

### Railway

Deployed on Railway with automatic deploys from `main` branch.

**Custom domain:** `jisoku.sukoshi.net`

### DNS (Porkbun)

```
Type:  CNAME
Name:  jisoku
Value: <railway-app>.up.railway.app
```

## Related

- **JisokuDict iOS app** - Native iOS/macOS dictionary app
- **sukoshi.net** - Web dictionary (separate repo: jisoku-web)
