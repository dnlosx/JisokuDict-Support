import { mkdirSync } from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from './schema'

type Drizzle = ReturnType<typeof drizzle<typeof schema>>

const globalForDb = globalThis as unknown as {
  sqlite?: Database.Database
  db?: Drizzle
}

const dbPath = process.env.DATABASE_PATH ?? './data/jisoku.db'

function getDb(): Drizzle {
  if (globalForDb.db) return globalForDb.db
  mkdirSync(path.dirname(dbPath), { recursive: true })
  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  globalForDb.sqlite = sqlite
  globalForDb.db = drizzle(sqlite, { schema })
  return globalForDb.db
}

export const db = new Proxy({} as Drizzle, {
  get(_, prop) {
    const target = getDb()
    const value = Reflect.get(target as object, prop)
    return typeof value === 'function' ? value.bind(target) : value
  },
})

export { schema }
