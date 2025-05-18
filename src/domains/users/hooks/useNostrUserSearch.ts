import { useEffect, useMemo, useState } from "react";
import { NDKFilter, NDKKind, NDKUser } from "@nostr-dev-kit/ndk";
import { useNDK, useSubscribe } from "@nostr-dev-kit/ndk-hooks";
import { nip19 } from "nostr-tools";
import { NostrUserSearchResult } from "../types";

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
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [userMap, setUserMap] = useState<Map<string, NDKUser>>(new Map());
    
    // Debounce the query
    useEffect(() => {
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
        
        // Check if the query is a valid npub
        if (debouncedQuery.startsWith('npub1')) {
            try {
                const { type, data } = nip19.decode(debouncedQuery);
                if (type === 'npub') {
                    // Search by exact pubkey
                    searchFilters.push({
                        kinds: [NDKKind.Metadata],
                        authors: [data as string],
                        limit
                    });
                    return searchFilters;
                }
            } catch (e) {
                // Not a valid npub, continue with other search methods
            }
        }
        
        // Search by name or username
        searchFilters.push({
            kinds: [NDKKind.Metadata],
            search: debouncedQuery
        });
        
        return searchFilters;
    }, [debouncedQuery, limit]);

    // Subscribe to user metadata events
    const { events, eose } = useSubscribe(filters, { relayUrls: ['wss://relay.nostr.band'], closeOnEose: true });

    // Process events into users
    useEffect(() => {
        if (!events.length) return;
        
        const newUserMap = new Map(userMap);
        
        events.forEach(event => {
            if (!event) return;
            
            try {
                const user = ndk?.getUser({ pubkey: event.pubkey });
                if (user) {
                    newUserMap.set(user.pubkey, user);
                }
            } catch (e) {
                console.error("Error processing user event:", e);
            }
        });
        
        setUserMap(newUserMap);
    }, [events, ndk]);

    // Convert map to array for return
    const users = useMemo(() => Array.from(userMap.values()), [userMap]);

    return { users, eose };
}