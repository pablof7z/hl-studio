/**
 * Utility function to delete a post from the SQLite database.
 * Uses Drizzle ORM for SQLite.
 */

import { posts } from '@/domains/db/schema';
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';

/**
 * Delete a post by its ID.
 * @param db - The Drizzle SQLite database instance.
 * @param postId - The post's UUID.
 * @returns The deleted post row, or null if not found.
 * @throws Error if deletion fails.
 */
export async function deletePost(db: BunSQLiteDatabase, postId: string) {
    try {
        const [row] = await db.delete(posts).where(posts.id.eq(postId)).returning();
        return row ?? null;
    } catch (err) {
        throw new Error('Failed to delete post: ' + (err instanceof Error ? err.message : String(err)));
    }
}
