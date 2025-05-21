import NDK, { NDKEvent, useNDK, useNDKCurrentPubkey, wrapEvent } from '@nostr-dev-kit/ndk-hooks';
import { useCallback } from 'react';
import useSWR, { mutate as globalMutate, KeyedMutator, SWRResponse } from 'swr';
import { ApiPost, ApiPostsResponse, ClientPost } from '../schemas';
import { createNip98AuthHeader } from '../utils/createNip98AuthHeader';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface APIOptions {
    method?: HTTPMethod;
    body?: any;
    headers?: Record<string, string>;
    // Optionally allow disabling SWR for non-GET
    skipAuth?: boolean;
}

type APIResponse<T> = SWRResponse<T, Error> & {
    mutate: KeyedMutator<T>;
};

/**
 * Payload for creating a scheduled post via POST /api/posts
 */
export interface ScheduledPostPayload {
    scheduledAt: string;
    status: string;
    rawEvent: any;
}

async function fetchWithAuth(ndk: NDK | null, pubkey: string | undefined, url: string, options: APIOptions = {}) {
    if (!ndk || !pubkey || !ndk.signer) {
        throw new Error('NDK not initialized, user not logged in, or signer missing');
    }

    const method = options.method || 'GET';
    const absoluteUrl = new URL(url, window.location.origin).toString();

    // Use shared NIP-98 header utility
    const authHeader = await createNip98AuthHeader(ndk, absoluteUrl, method, options.body, ndk.signer);

    // Prepare headers
    const headers: Record<string, string> = {
        ...options.headers,
        Authorization: authHeader,
    };

    // If we have a body, add the content-type header if not already set
    if (options.body && !headers['Content-Type'] && typeof options.body !== 'string') {
        headers['Content-Type'] = 'application/json';
    }

    // Make the request
    const response = await fetch(absoluteUrl, {
        method,
        headers,
        body: options.body
            ? typeof options.body === 'string'
                ? options.body
                : JSON.stringify(options.body)
            : undefined,
    });

    // Handle response
    if (!response.ok) {
        // Try to parse error body if possible
        let errorMsg = `API request failed: ${response.status} ${response.statusText}`;
        try {
            const errJson = await response.json();
            errorMsg += errJson?.message ? ` - ${errJson.message}` : '';
        } catch {
            // ignore
        }
        throw new Error(errorMsg);
    }

    // Parse response based on content-type
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
}

/**
 * useAPI hook: provides authenticated API methods with SWR integration.
 * - get: SWR-cached GET request, returns { data, error, mutate }
 * - post/put/delete: perform mutation, then revalidate cache for the endpoint
 */
export function useAPI() {
    const { ndk } = useNDK();
    const pubkey = useNDKCurrentPubkey();

    // GET: SWR-cached, returns { data, error, mutate }
    const get = useCallback(
        function <T = any>(url: string): APIResponse<T> {
            // SWR key is url + pubkey (to avoid leaking data between users)
            const swrKey = pubkey ? [url, pubkey] : null;
            const swr = useSWR<T>(swrKey, async () => fetchWithAuth(ndk, pubkey, url, { method: 'GET' }), {
                revalidateOnFocus: true,
                shouldRetryOnError: true,
                // No loading flag: offline-first
            });
            return swr;
        },
        [ndk, pubkey]
    );

    // POST/PUT/DELETE: perform mutation, then revalidate cache for the endpoint
    const post = useCallback(
        async function <T = any>(url: string, body?: any, options: APIOptions = {}) {
            // Prevent duplicate submissions by disabling button in UI, but here we can throw if needed
            return fetchWithAuth(ndk, pubkey, url, { ...options, method: 'POST', body });
        },
        [ndk, pubkey]
    );

    const put = useCallback(
        async function <T = any>(url: string, body?: any, options: APIOptions = {}) {
            return fetchWithAuth(ndk, pubkey, url, { ...options, method: 'PUT', body });
        },
        [ndk, pubkey]
    );

    const del = useCallback(
        async function <T = any>(url: string, options: APIOptions = {}) {
            return fetchWithAuth(ndk, pubkey, url, { ...options, method: 'DELETE' });
        },
        [ndk, pubkey]
    );

    // Helper to revalidate a given endpoint (e.g., after mutation)
    const mutate = useCallback(
        (url: string) => {
            if (!pubkey) return;
            // SWR key is [url, pubkey]
            return globalMutate([url, pubkey]);
        },
        [pubkey]
    );

    return {
        get,
        post,
        put,
        delete: del,
        mutate,
        /**
         * Typed helper for creating a scheduled post.
         */
        addPost: useCallback(
            async (payload: ScheduledPostPayload) => {
                return post('/api/posts', payload);
            },
            [post]
        ),
        /**
         * Typed helper for fetching scheduled posts.
         * Returns posts with rawEvent parsed and wrapped as NDKEvent.
         */
        getPosts: useCallback((): APIResponse<ClientPost[]> => {
            // SWR key is /api/posts + pubkey
            const swrKey = pubkey ? ['/api/posts', pubkey] : null;
            const swr = useSWR<ClientPost[]>(
                swrKey,
                async () => {
                    const res: ApiPostsResponse = await fetchWithAuth(ndk, pubkey, '/api/posts', { method: 'GET' });
                    // The backend returns { posts: [...] }
                    const posts = Array.isArray(res.posts) ? res.posts : [];
                    // For each post, parse rawEvent and wrap as NDKEvent
                    return await Promise.all(
                        posts.map(async (post: ApiPost) => {
                            let wrappedEvent = null;
                            try {
                                const parsed = JSON.parse(post.rawEvent);
                                const ndkEvent = new NDKEvent(ndk ?? undefined, parsed);
                                wrappedEvent = await wrapEvent(ndkEvent);
                            } catch (e) {
                                // fallback: leave as null
                            }
                            return {
                                ...post,
                                event: wrappedEvent,
                            };
                        })
                    );
                },
                {
                    revalidateOnFocus: true,
                    shouldRetryOnError: true,
                }
            );
            return swr;
        }, [ndk, pubkey]),
    };
}
