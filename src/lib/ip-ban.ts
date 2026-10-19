import { sql } from 'drizzle-orm'

import { db } from '@/db'

const BAN_SECONDS = 30 * 24 * 60 * 60

// Paths no legitimate visitor of this site ever requests: secret files, VCS
// metadata, and PHP/WordPress endpoints (this is a Next.js app, nothing is PHP).
const probePath =
  /\/\.(?:env|git|svn|hg|aws|ssh|docker|vscode|idea|npmrc|htpasswd|htaccess)(?:[\/.\-_]|$)|\.php\d?(?:\/|$)|\/wp-(?:admin|content|includes|login|config)|\/(?:phpmyadmin|pma|cgi-bin|vendor\/(?:composer|phpunit))(?:\/|$)/i

export function isProbePath(path: string): boolean {
  return probePath.test(path)
}

export function isBanned(ip: string): boolean {
  const rows = db.all<{ one: number }>(sql`
    SELECT 1 AS one FROM ip_bans WHERE ip = ${ip} AND expires_at > ${Date.now()}
  `)
  return rows.length > 0
}

/** Bans (or re-bans, extending the expiry) an IP and prunes expired bans. */
export function banIp(ip: string, path: string): void {
  const nowMs = Date.now()
  db.run(sql`
    INSERT INTO ip_bans (ip, path, created_at, expires_at)
    VALUES (${ip}, ${path.slice(0, 512)}, ${nowMs}, ${nowMs + BAN_SECONDS * 1000})
    ON CONFLICT(ip) DO UPDATE SET
      path = excluded.path,
      expires_at = excluded.expires_at
  `)
  db.run(sql`DELETE FROM ip_bans WHERE expires_at <= ${nowMs}`)
}
