/**
 * Utility function to retrieve posts for a specific user from the SQLite database.
 * Uses Drizzle ORM for SQLite.
 */

import { posts, PostStatus } from "@/domains/db/schema";
import { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { eq, and, desc } from "drizzle-orm";

/**
 * Query options for fetching user posts.
 */
export interface GetUserPostsOptions {
    accountPubkey?: string;
    authorPubkey?: string;
    status?: PostStatus;
    limit?: number;
    offset?: number;
}

/**
 * Retrieve posts for a specific user.
 * @param db - The Drizzle SQLite database instance.
 * @param options - Query options (accountPubkey, authorPubkey, status, limit, offset).
 * @returns Array of post rows.
 * @throws Error if query fails.
 */
export async function getUserPosts(
    db: BunSQLiteDatabase,
    options: GetUserPostsOptions
) {
    try {
        // Build where conditions
        const whereClauses = [];
        if (options.accountPubkey) {
            whereClauses.push(eq(posts.accountPubkey, options.accountPubkey));
        }
        if (options.authorPubkey) {
            whereClauses.push(eq(posts.authorPubkey, options.authorPubkey));
        }
        if (options.status) {
            whereClauses.push(eq(posts.status, options.status));
        }

        // Build query in a single deeply nested chain to avoid type errors
        return await (
            (whereClauses.length > 0
                ? (options.limit
                    ? (options.offset
                        ? db
                            .select()
                            .from(posts)
                            .where(and(...whereClauses))
                            .limit(options.limit)
                            .offset(options.offset)
                        : db
                            .select()
                            .from(posts)
                            .where(and(...whereClauses))
                            .limit(options.limit)
                    )
                    : (options.offset
                        ? db
                            .select()
                            .from(posts)
                            .where(and(...whereClauses))
                            .offset(options.offset)
                        : db
                            .select()
                            .from(posts)
                            .where(and(...whereClauses))
                    )
                )
                : (options.limit
                    ? (options.offset
                        ? db
                            .select()
                            .from(posts)
                            .limit(options.limit)
                            .offset(options.offset)
                        : db
                            .select()
                            .from(posts)
                            .limit(options.limit)
                    )
                    : (options.offset
                        ? db
                            .select()
                            .from(posts)
                            .offset(options.offset)
                        : db
                            .select()
                            .from(posts)
                    )
                )
            )
            .orderBy(desc(posts.scheduledAt), desc(posts.createdAt))
            .all()
        );
    } catch (err) {
        throw new Error("Failed to fetch user posts: " + (err instanceof Error ? err.message : String(err)));
    }
}

/**
 * Retrieve a single post by ID for a specific user (ownership check).
 * @param db - The Drizzle SQLite database instance.
 * @param id - The post ID to fetch.
 * @param accountPubkey - The user's public key (ownership).
 * @returns The post row if found and owned by the user, otherwise null.
 * @throws Error if query fails.
 */
export async function getPostByIdForUser(
    db: BunSQLiteDatabase,
    id: string,
    accountPubkey: string
) {
    try {
        const result = await db
            .select()
            .from(posts)
            .where(
                and(
                    eq(posts.id, id),
                    eq(posts.accountPubkey, accountPubkey)
                )
            )
            .limit(1)
            .all();
        return result[0] ?? null;
    } catch (err) {
        throw new Error(
            "Failed to fetch post by id for user: " +
                (err instanceof Error ? err.message : String(err))
        );
    }
}