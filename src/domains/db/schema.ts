import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Post status type for SQLite (use as a TypeScript union).
 */
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

/**
 * Posts table schema for SQLite.
 * - All IDs are stored as text (UUID v4).
 * - Dates are stored as ISO strings (text).
 * - relays is a JSON array, stored as a string.
 * - status is a text column, validated in code.
 */
export const posts = sqliteTable(
    'posts',
    {
        id: text('id').primaryKey().notNull(), // UUID v4 as string
        accountPubkey: text('account_pubkey').notNull(),
        authorPubkey: text('author_pubkey').notNull(),
        scheduledAt: text('scheduled_at'), // ISO string or null
        relays: text('relays'), // JSON array as string or null
        status: text('status').notNull(), // Should be PostStatus
        publishAttemptedAt: text('publish_attempted_at'), // ISO string or null
        publishError: text('publish_error'),
        createdAt: text('created_at').notNull(), // ISO string
        updatedAt: text('updated_at').notNull(), // ISO string
        rawEvent: text('raw_event').notNull(),
    },
    (table) => ({
        accountPubkeyIdx: index('posts_account_pubkey_idx').on(table.accountPubkey),
        authorPubkeyIdx: index('posts_author_pubkey_idx').on(table.authorPubkey),
        scheduledAtIdx: index('posts_scheduled_at_idx').on(table.scheduledAt),
        statusIdx: index('posts_status_idx').on(table.status),
    })
);
