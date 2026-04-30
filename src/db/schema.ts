import { randomUUID } from 'node:crypto'

import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const TICKET_CATEGORIES = ['bug', 'feature', 'account', 'other'] as const
export const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'] as const
export const TICKET_VISIBILITIES = ['private', 'public'] as const
export const MESSAGE_ROLES = ['user', 'admin'] as const

export const userTokens = sqliteTable(
  'user_tokens',
  {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    tokenHash: text('token_hash').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .$defaultFn(() => new Date())
      .notNull(),
    lastSeenAt: integer('last_seen_at', { mode: 'timestamp_ms' }),
  },
  (t) => ({
    tokenHashUniq: uniqueIndex('user_tokens_token_hash_uniq').on(t.tokenHash),
  })
)

export const tickets = sqliteTable(
  'tickets',
  {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    publicId: text('public_id').notNull(),
    userTokenId: text('user_token_id')
      .notNull()
      .references(() => userTokens.id, { onDelete: 'cascade' }),
    authorUsername: text('author_username').notNull(),
    title: text('title').notNull(),
    category: text('category', { enum: TICKET_CATEGORIES }).notNull(),
    status: text('status', { enum: TICKET_STATUSES }).notNull().default('open'),
    visibility: text('visibility', { enum: TICKET_VISIBILITIES })
      .notNull()
      .default('private'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .$defaultFn(() => new Date())
      .notNull(),
    publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
  },
  (t) => ({
    publicIdUnique: uniqueIndex('tickets_public_id_uniq').on(t.publicId),
    userTokenIdx: index('tickets_user_token_idx').on(t.userTokenId, t.createdAt),
    publicListIdx: index('tickets_public_list_idx').on(t.visibility, t.publishedAt),
    statusIdx: index('tickets_status_idx').on(t.status, t.updatedAt),
  })
)

export const ticketMessages = sqliteTable(
  'ticket_messages',
  {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    ticketId: text('ticket_id')
      .notNull()
      .references(() => tickets.id, { onDelete: 'cascade' }),
    authorRole: text('author_role', { enum: MESSAGE_ROLES }).notNull(),
    authorUsername: text('author_username').notNull().default(''),
    body: text('body').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => ({
    ticketIdx: index('ticket_messages_ticket_idx').on(t.ticketId, t.createdAt),
  })
)

export const rateLimits = sqliteTable('rate_limits', {
  key: text('key').primaryKey(),
  windowStart: integer('window_start', { mode: 'timestamp_ms' }).notNull(),
  count: integer('count').notNull().default(0),
})

export type UserToken = typeof userTokens.$inferSelect
export type NewUserToken = typeof userTokens.$inferInsert
export type Ticket = typeof tickets.$inferSelect
export type NewTicket = typeof tickets.$inferInsert
export type TicketMessage = typeof ticketMessages.$inferSelect
export type NewTicketMessage = typeof ticketMessages.$inferInsert
