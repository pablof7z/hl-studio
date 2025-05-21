/**
 * Utility function to update the status of a post in the SQLite database.
 * Uses Drizzle ORM for SQLite.
 */

import { posts, PostStatus } from '@/domains/db/schema';
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';

/**
 * Update the status (and optionally error and publishAttemptedAt) of a post.
 * @param db - The Drizzle SQLite database instance.
 * @param postId - The post's UUID.
 * @param status - The new status.
 * @param opts - Optional: publishError and publishAttemptedAt ISO string.
 * @returns The updated post row, or null if not found.
 * @throws Error if update fails.
 */
export async function updatePostStatus(
    db: BunSQLiteDatabase,
    postId: string,
    status: PostStatus,
    opts?: { publishError?: string | null; publishAttemptedAt?: string | null }
) {
    try {
        const now = new Date().toISOString();
        const [row] = await db
            .update(posts)
            .set({
                status,
                publishError: opts?.publishError ?? null,
                publishAttemptedAt: opts?.publishAttemptedAt ?? null,
                updatedAt: now,
            })
            .where(posts.id.eq(postId))
            .returning();
        return row ?? null;
    } catch (err) {
        throw new Error('Failed to update post status: ' + (err instanceof Error ? err.message : String(err)));
    }
}
