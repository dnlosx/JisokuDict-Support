import 'dotenv/config'

import { mkdirSync } from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

function main() {
  const dbPath = process.env.DATABASE_PATH ?? './data/jisoku.db'
  mkdirSync(path.dirname(dbPath), { recursive: true })

  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  try {
    migrate(drizzle(sqlite), { migrationsFolder: './drizzle' })
    console.log('migrations applied')
  } finally {
    sqlite.close()
  }
}

try {
  main()
} catch (err) {
  console.error(err)
  process.exit(1)
}
