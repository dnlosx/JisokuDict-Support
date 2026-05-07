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

This is a Next.js 15 site for the JisokuDict iOS app. It serves as a landing page, an anonymous self-hosted support ticket system, a public knowledge base, and hosts `app-ads.txt` for AdMob verification.

### Stack

- Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- SQLite (`better-sqlite3`) on a Railway volume + Drizzle ORM
- Cloudflare Turnstile for bot protection
- **No email infrastructure** — auth is cookie-based, not email-based
- Markdown rendering via `react-markdown` + `remark-gfm` + `rehype-sanitize` (strict allowlist; `https://` images only)
- SQLite-backed rate limiting

### Identity model (no accounts, no email)

**Users:**
- On first ticket submission, the server generates a 32-byte secret token, stores its sha256 hash in `user_tokens`, and sets the raw token in an HTTP-only `jsk_user` cookie (5-year max-age).
- The same token is returned to the client as a recovery URL: `/support/restore?t=<raw_token>`. Users bookmark this URL to access their tickets from another device. **There is no email-based recovery** — losing both cookie and URL means losing access.
- Subsequent submissions from the same browser reuse the cookie. The most recent username on the account is reused as the display name.

**Admin:**
- Single shared password in `ADMIN_SECRET` env var.
- Admin types it at `/admin/auth` → `POST /api/admin/auth` does a constant-time compare → on success, mints an HMAC-signed cookie (`jsk_admin`, 30-day max-age) using `AUTH_SECRET`. No DB row.
- `/admin*` routes call `isAdmin()` (cookie verify) and redirect to `/admin/auth` if not authenticated.
- `POST /api/admin/auth` is rate-limited to 5/h/IP.

### Pages

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | Public | Landing page |
| `/support` | Public | FAQ + entry points to ticket submission and the public KB |
| `/support/public` | Public | Paginated public knowledge base |
| `/support/public/[slug]` | Public | Read-only published ticket (username only) |
| `/support/tickets/new` | Public | Create-ticket form (Turnstile). Auto-issues user cookie + recovery URL. |
| `/support/tickets` | User cookie | Author's own tickets |
| `/support/tickets/[slug]` | User cookie or admin | Thread + reply |
| `/support/restore` | Token in `?t=` | Validates token, sets cookie, redirects to `/support/tickets` |
| `/admin/auth` | Public | Admin password form |
| `/admin` | Admin | Dashboard with status filter |
| `/admin/tickets/[slug]` | Admin | Thread + status / visibility controls |
| `/privacy` | Public | Privacy policy |
| `/app-ads.txt` | Public | AdMob verification (served from `public/`) |

### API routes

| Route | Method | Auth |
|-------|--------|------|
| `/api/admin/auth` | POST | Public + rate-limit (5/h/IP) |
| `/api/admin/logout` | POST | Admin |
| `/api/tickets` | POST | Public + Turnstile + rate-limit. Auto-creates user_token if no cookie. |
| `/api/tickets` | GET | User cookie |
| `/api/tickets/[slug]` | GET | Owner OR admin OR (visibility = public) |
| `/api/tickets/[slug]/messages` | POST | Owner OR admin |
| `/api/admin/tickets` | GET | Admin |
| `/api/admin/tickets/[slug]` | PATCH | Admin (status, visibility) |

All mutating routes require a same-origin `Origin` header (CSRF defense). All routes touching the DB declare `runtime = 'nodejs'`.

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
│   ├── globals.css                   # Tailwind styles
│   ├── privacy/page.tsx
│   ├── support/
│   │   ├── page.tsx                  # FAQ + CTAs
│   │   ├── tickets/{page,new/page,[slug]/page}.tsx
│   │   ├── public/{page,[slug]/page}.tsx
│   │   └── restore/page.tsx          # consumes recovery URL ?t=
│   ├── admin/
│   │   ├── auth/{page,AdminAuthForm}.tsx
│   │   ├── page.tsx
│   │   └── tickets/[slug]/page.tsx
│   └── api/
│       ├── admin/{auth,logout}/route.ts
│       ├── admin/tickets/{route,[slug]/route}.ts
│       ├── tickets/route.ts
│       ├── tickets/[slug]/route.ts
│       └── tickets/[slug]/messages/route.ts
├── components/                       # SiteHeader, SiteFooter, Markdown,
│                                     # TurnstileWidget, TicketCard, TicketThread,
│                                     # ReplyForm, AdminTicketControls, SignOutButton
├── db/
│   ├── index.ts                      # client singleton
│   ├── schema.ts                     # user_tokens, tickets, ticket_messages, rate_limits
│   └── migrate.ts                    # migration runner (used by db:migrate)
└── lib/
    ├── auth/{cookie,tokens}.ts       # user cookie + admin signed cookie + token gen/hash
    ├── turnstile.ts                  # siteverify
    ├── rate-limit.ts                 # SQLite-backed counter
    ├── same-origin.ts                # CSRF guard + getClientIp
    ├── slug.ts                       # nanoid public_id generator
    └── validators.ts                 # zod schemas (create-ticket, reply, admin-auth, admin-update)

public/
└── app-ads.txt                       # AdMob verification
```

### Design

Uses a subset of the sukoshi.net design system:
- `sakura` - Pink accent color
- `ink` - Gray text colors

### Environment variables

See `.env.example` for the full list. Required at runtime:

- `DATABASE_PATH` — path to the SQLite file. In production this should point at a Railway volume mount (e.g. `/data/jisoku.db`); locally `./data/jisoku.db` is the default.
- `AUTH_SECRET` (32+ random bytes; HMAC of admin cookie)
- `ADMIN_SECRET` (the password admins type at `/admin/auth`)
- `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Deployment

### Railway

Deployed on Railway with automatic deploys from `main` branch.

The Railway service must have a **volume attached at `/data`** so the SQLite file survives redeploys. Set `DATABASE_PATH=/data/jisoku.db` as an env var on the service.

The `start` script runs `npm run db:migrate && next start` so migrations apply against the volume-mounted DB on every boot (idempotent — no-op once tables exist). Migrations are kept in the same container as the runtime; Railway's `preDeployCommand` was avoided because pre-deploy doesn't reliably mount the volume.

The service must run as a **single replica** — SQLite + concurrent writers from multiple containers will corrupt the file.

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
