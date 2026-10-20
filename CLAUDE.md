# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate a new Drizzle migration from schema changes
npm run db:migrate   # Apply pending migrations to DATABASE_PATH
npm run db:studio    # Open Drizzle Studio
```

## Architecture

This is a Next.js 15 site for the JisokuDict iOS app. It serves as a landing page, a support page (FAQ + a one-way contact form whose messages land in a private admin inbox), and hosts `app-ads.txt` for AdMob verification.

### Stack

- Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- SQLite (`better-sqlite3`) on a Railway volume + Drizzle ORM
- Cloudflare Turnstile for bot protection
- **No email infrastructure** — the form's email field is optional and only used to reply manually
- SQLite-backed rate limiting

### Contact form & admin

- `/support` ends with a contact form (topic, message, optional email/device/app version, Turnstile). `POST /api/feedback` stores it in the `feedback` table. Users get no account, cookie or thread; it's one-way.
- **Admin:** single shared password in `ADMIN_SECRET`. Admin types it at `/admin/auth` → `POST /api/admin/auth` does a constant-time compare → on success, mints an HMAC-signed cookie (`jsk_admin`, 30-day max-age) using `AUTH_SECRET`. `/admin` is the inbox (filter new/handled/all, mark handled).
- **Weekly digest:** `GET /api/admin/digest?days=7` returns the last N days of messages as JSON, authenticated with `Authorization: Bearer $DIGEST_TOKEN` (endpoint is disabled if unset). A Claude scheduled task on the developer's Mac calls it every Friday and sends a summary only when there are messages. Call it with a non-bot User-Agent; `src/middleware.ts` returns 403 to `curl/…`.
- **Legacy tickets:** the old ticket system (threads, public KB, recovery URLs) was removed. Its tables (`user_tokens`, `tickets`, `ticket_messages`) are kept in the schema and DB so old data isn't lost; old URLs redirect to `/support` (see `next.config.ts` and `src/app/support/restore/page.tsx`).

### Pages

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | Public | Landing page (features, iPhone Duo folded/unfolded section, App Store CTA) |
| `/support` | Public | FAQ by topic with app screenshots + contact form (`#contact`) |
| `/admin/auth` | Public | Admin password form |
| `/admin` | Admin | Inbox of contact-form messages |
| `/privacy` | Public | Privacy policy |
| `/app-ads.txt` | Public | AdMob verification (served from `public/`) |

### API routes

| Route | Method | Auth |
|-------|--------|------|
| `/api/feedback` | POST | Public + Turnstile + rate-limit (10/h/IP) |
| `/api/admin/auth` | POST | Public + rate-limit (5/h/IP) |
| `/api/admin/logout` | POST | Admin |
| `/api/admin/feedback/[id]` | PATCH | Admin (`{ handled: boolean }`) |
| `/api/admin/digest` | GET | Bearer `DIGEST_TOKEN` |

All mutating routes require a same-origin `Origin` header (CSRF defense). All routes touching the DB declare `runtime = 'nodejs'`.

### Scanner bans

`src/middleware.ts` runs on the Node runtime. Any request for a probe path (`.env`, `.git`, `*.php`, `wp-*`, etc.; see `src/lib/ip-ban.ts`) bans the client IP for 30 days in `ip_bans`, and banned IPs get 403 on every route. The IP comes from Railway's `X-Real-IP` header only (never `X-Forwarded-For`, which clients can spoof); without it, as in local dev, banning is skipped. To unban: `DELETE FROM ip_bans WHERE ip = '...'`.

### Project Structure

```
drizzle.config.ts
drizzle/                              # generated migrations (committed)
railway.json                          # Railway deploy config
.env.example                          # required env vars

src/
├── app/
│   ├── page.tsx                      # Landing
│   ├── layout.tsx                    # Root layout
│   ├── icon.png, apple-icon.png      # favicons (from the app icon)
│   ├── globals.css                   # Tailwind styles
│   ├── privacy/page.tsx
│   ├── support/
│   │   ├── page.tsx                  # FAQ topics + contact section
│   │   ├── ContactForm.tsx           # client form → POST /api/feedback
│   │   └── restore/page.tsx          # legacy recovery links → /support
│   ├── admin/
│   │   ├── auth/{page,AdminAuthForm}.tsx
│   │   ├── page.tsx                  # inbox
│   │   └── HandledToggle.tsx
│   └── api/
│       ├── feedback/route.ts
│       └── admin/{auth,logout,digest}/route.ts, admin/feedback/[id]/route.ts
├── components/                       # SiteHeader, SiteFooter, TurnstileWidget, SignOutButton
├── db/
│   ├── index.ts                      # client singleton
│   ├── schema.ts                     # feedback, rate_limits, ip_bans (+ legacy ticket tables)
│   └── migrate.ts                    # migration runner (used by db:migrate)
├── middleware.ts                     # scanner IP bans + bot UA filter
└── lib/
    ├── auth/cookie.ts                # admin signed cookie
    ├── turnstile.ts                  # siteverify
    ├── rate-limit.ts                 # SQLite-backed counter
    ├── ip-ban.ts                     # probe-path detection + 30-day IP bans
    ├── same-origin.ts                # CSRF guard + getClientIp
    └── validators.ts                 # zod schemas (feedback, admin-auth, admin-update)

public/
├── app-ads.txt                       # AdMob verification
├── app-icon.png
└── screenshots/                      # iPhone Duo simulator shots: *.webp (unfolded portrait, /support),
                                      # duo-open-*.webp (unfolded landscape) + duo-folded-*.webp (outer screen) on /
```

### Design

Uses a subset of the sukoshi.net design system:
- `sakura` - Pink accent color
- `ink` - Gray text colors
- `ai` (藍) - Indigo accent from the app icon gradient
- `font-mincho` - Serif stack for decorative kanji

### Environment variables

See `.env.example` for the full list. Required at runtime:

- `DATABASE_PATH` — path to the SQLite file. In production this should point at a Railway volume mount (e.g. `/data/jisoku.db`); locally `./data/jisoku.db` is the default.
- `AUTH_SECRET` (32+ random bytes; HMAC of admin cookie)
- `ADMIN_SECRET` (the password admins type at `/admin/auth`)
- `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `DIGEST_TOKEN` (optional; enables `/api/admin/digest` for the Friday summary)

## Deployment

### Railway

Deployed on Railway with automatic deploys from `main` branch.

The Railway service must have a **volume attached at `/data`** so the SQLite file survives redeploys. Set `DATABASE_PATH=/data/jisoku.db` as an env var on the service.

The `start` script runs `npm run db:migrate && next start` so migrations apply against the volume-mounted DB on every boot (idempotent — no-op once tables exist). Migrations are kept in the same container as the runtime; Railway's `preDeployCommand` was avoided because pre-deploy doesn't reliably mount the volume.

The service must run as a **single replica** — SQLite + concurrent writers from multiple containers will corrupt the file.

**Custom domain:** `jisoku.app` (canonical). The old `jisoku.sukoshi.net` stays attached to the service; `src/middleware.ts` 308-redirects it to `jisoku.app`, except `/app-ads.txt` and `/api/*` (served on both hosts so AdMob and the digest job keep working with the old URL).

### DNS (Porkbun)

`jisoku.app` (apex; Porkbun flattens it):
```
Type:  ALIAS
Name:  (blank)
Value: f1oc00en.up.railway.app
```

`jisoku.sukoshi.net` (legacy):
```
Type:  CNAME
Name:  jisoku
Value: <railway-app>.up.railway.app
```

## Related

- **JisokuDict iOS app** - Native iOS/macOS dictionary app
- **sukoshi.net** - Web dictionary (separate repo: jisoku-web)
