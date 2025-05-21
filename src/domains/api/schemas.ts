import { NDKEvent } from '@nostr-dev-kit/ndk-hooks';
import { z } from 'zod';

/**
 * PostStatus type as used in the DB schema.
 */
export const PostStatusEnum = z.enum(['draft', 'scheduled', 'published', 'failed']);
export type PostStatus = z.infer<typeof PostStatusEnum>;

/**
 * Zod schema for a scheduled post as returned by the API.
 * - relays is a JSON string or null (parsed as string here).
 * - scheduledAt, publishAttemptedAt, publishError can be null.
 * - rawEvent is a string (from API), but on the frontend may be a string or NDKEvent.
 */
export const ApiPostSchema = z.object({
    id: z.string(),
    accountPubkey: z.string(),
    authorPubkey: z.string(),
    scheduledAt: z.string().nullable(),
    relays: z.string().nullable(),
    status: PostStatusEnum,
    publishAttemptedAt: z.string().nullable(),
    publishError: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    rawEvent: z.string(), // API always returns string
});

/**
 * Zod schema for the GET /api/posts response.
 */
export const ApiPostsResponseSchema = z.object({
    posts: z.array(ApiPostSchema),
});

/**
 * TypeScript types inferred from the schemas.
 * - ApiPost: as returned by the API (rawEvent is string)
 * - ApiPostsResponse: { posts: ApiPost[] }
 * - ClientPost: for frontend, rawEvent can be string or NDKEvent
 */
export type ApiPost = z.infer<typeof ApiPostSchema>;
export type ApiPostsResponse = z.infer<typeof ApiPostsResponseSchema>;

// For frontend: allow rawEvent to be string or NDKEvent (import type if available)
export type ClientPost = ApiPost & { event: NDKEvent };
