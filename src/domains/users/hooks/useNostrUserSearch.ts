import { NDKEvent, NDKFilter, NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import { useNDK, useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import { nip19 } from 'nostr-tools';
import { useEffect, useMemo, useState } from 'react';
import { NostrUserSearchResult } from '../types';

/**
 * Hook for searching Nostr users by name, pubkey, or npub
 *
 * @param query - The search query string
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Object containing users array and eose flag
 */
export function useNostrUserSearch(query: string, limit = 10): NostrUserSearchResult {
    const { ndk } = useNDK();
    // Simple debounce implementation
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [userMap, setUserMap] = useState<Map<string, NDKUser>>(new Map());

    const setFromBech32 = (query: string) => {
        let user: NDKUser | null = null;

        try {
            if (query.startsWith('npub1')) user = new NDKUser({ npub: query });
            else if (query.startsWith('nprofile1')) user = new NDKUser({ nprofile: query });
        } catch {
            return false;
        }

        if (user) {
            setUserMap(new Map([[user.pubkey, user]]));
            return true;
        }
    };

    // Debounce the query
    useEffect(() => {
        if (query.trim() === '') {
            setUserMap(new Map());
            setDebouncedQuery('');
            return;
        }

        if (query.startsWith('npub1') || query.startsWith('nprofile1')) if (setFromBech32(query)) return;

        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Clear results when query changes significantly
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setUserMap(new Map());
        }
    }, [debouncedQuery]);

    // Create filters based on the query
    const filters = useMemo(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            return false; // Don't execute the query if it's too short
        }

        const searchFilters: NDKFilter[] = [];

        // Search by name or username
        searchFilters.push({
            kinds: [NDKKind.Metadata],
            search: debouncedQuery,
        });

        return searchFilters;
    }, [debouncedQuery, limit]);

    // Subscribe to user metadata events
    const { events, eose } = useSubscribe(filters, { relayUrls: ['wss://relay.nostr.band'], closeOnEose: true }, [
        filters,
    ]);

    // Process events into users
    useEffect(() => {
        if (!events.length) return;

        const newUserMap = new Map(userMap);

        events.forEach((event) => {
            if (!event) return;

            try {
                const user = ndk?.getUser({ pubkey: event.pubkey });
                if (user) {
                    newUserMap.set(user.pubkey, user);
                }
            } catch (e) {
                console.error('Error processing user event:', e);
            }
        });

        setUserMap(newUserMap);
    }, [events, ndk]);

    // Convert map to array for return
    const users = useMemo(() => Array.from(userMap.values()), [userMap]);

    return { users, eose };
}
