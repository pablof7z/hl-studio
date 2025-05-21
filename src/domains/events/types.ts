import { NDKEvent } from '@nostr-dev-kit/ndk';

export type NostrIdentifierType = 'npub' | 'note' | 'nevent' | 'naddr' | 'nprofile' | 'unknown';

export interface NostrEventSearchResult {
    event: NDKEvent | null;
    type: NostrIdentifierType;
    identifier: string;
    isValid: boolean;
}
