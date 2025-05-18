import { useEffect, useState } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-hooks";
import { nip19 } from "nostr-tools";
import { NostrEventSearchResult, NostrIdentifierType } from "../types";

/**
 * Hook for validating and resolving Nostr event identifiers (nevent1, note1, naddr1)
 * 
 * @param identifier - The potential event identifier string
 * @returns Object containing the event, type, and validation status
 */
export function useNostrEventSearch(identifier: string): NostrEventSearchResult {
    const { ndk } = useNDK();
    const [result, setResult] = useState<NostrEventSearchResult>({
        event: null,
        type: "unknown",
        identifier,
        isValid: false
    });

    useEffect(() => {
        if (!identifier || !ndk) {
            setResult({
                event: null,
                type: "unknown",
                identifier,
                isValid: false
            });
            return;
        }

        // Reset result when identifier changes
        setResult(prev => ({
            ...prev,
            event: null,
            isValid: false
        }));

        let type: NostrIdentifierType = "unknown";
        let isValid = false;
        let decoded: { type: string; data: any } | null = null;

        // Try to decode the identifier
        try {
            if (identifier.startsWith("nevent1") || 
                identifier.startsWith("note1") || 
                identifier.startsWith("naddr1") ||
                identifier.startsWith("nprofile1") ||
                identifier.startsWith("npub1")) {
                
                decoded = nip19.decode(identifier);
                
                if (decoded) {
                    type = decoded.type as NostrIdentifierType;
                    isValid = true;
                }
            }
        } catch (e) {
            console.error("Error decoding identifier:", e);
            isValid = false;
        }

        // If valid, try to fetch the event
        if (isValid && decoded && ndk) {
            (async () => {
                try {
                    let event: NDKEvent | null = null;
                    
                    switch (decoded.type) {
                        case "nevent":
                            event = await ndk.fetchEvent(decoded.data.id);
                            break;
                        case "note":
                            event = await ndk.fetchEvent(decoded.data);
                            break;
                        case "naddr":
                            // For naddr, we need to construct a filter with kind, pubkey, and d tag
                            if (decoded.data.kind && decoded.data.pubkey && decoded.data.identifier) {
                                const events = await ndk.fetchEvents([{
                                    kinds: [decoded.data.kind],
                                    authors: [decoded.data.pubkey],
                                    "#d": [decoded.data.identifier],
                                    limit: 1
                                }]);
                                
                                if (events && events.size > 0) {
                                    event = Array.from(events)[0];
                                }
                            }
                            break;
                        case "nprofile":
                        case "npub":
                            // These are user identifiers, not event identifiers
                            // We don't fetch events for these, but mark them as valid
                            break;
                    }

                    setResult({
                        event,
                        type,
                        identifier,
                        isValid
                    });
                } catch (e) {
                    console.error("Error fetching event:", e);
                    setResult({
                        event: null,
                        type,
                        identifier,
                        isValid: false
                    });
                }
            })();
        } else {
            setResult({
                event: null,
                type,
                identifier,
                isValid
            });
        }
    }, [identifier, ndk]);

    return result;
}