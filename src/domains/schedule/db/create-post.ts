/**
 * Utility function to insert a new post into the SQLite database.
 * Uses Drizzle ORM for SQLite.
 */

import { posts, PostStatus } from "@/domains/db/schema";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { v4 as uuidv4 } from "uuid";

/**
 * The shape of a new post to be created.
 */
export interface NewPostInput {
    accountPubkey: string;
    authorPubkey: string;
    scheduledAt?: string | null;
    relays?: string[] | null;
    status: PostStatus;
    rawEvent: string;
    publishAttemptedAt?: string | null;
    publishError?: string | null;
}

/**
 * Insert a new post into the database.
 * @param db - The Drizzle SQLite database instance.
 * @param input - The new post data.
 * @returns The created post row.
 * @throws Error if insertion fails.
 */
export async function createPost(
    db: BunSQLiteDatabase,
    input: NewPostInput
) {
    const now = new Date().toISOString();
    const id = uuidv4();
    try {
        const [row] = await db
            .insert(posts)
            .values({
                id,
                accountPubkey: input.accountPubkey,
                authorPubkey: input.authorPubkey,
                scheduledAt: input.scheduledAt ?? null,
                relays: input.relays ? JSON.stringify(input.relays) : null,
                status: input.status,
                publishAttemptedAt: input.publishAttemptedAt ?? null,
                publishError: input.publishError ?? null,
                createdAt: now,
                updatedAt: now,
                rawEvent: input.rawEvent
            })
            .returning();
        return row;
    } catch (err) {
        throw new Error("Failed to create post: " + (err instanceof Error ? err.message : String(err)));
    }
}