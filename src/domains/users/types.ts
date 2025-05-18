import { NDKUser } from "@nostr-dev-kit/ndk";

export interface NostrUserSearchResult {
    users: NDKUser[];
    eose: boolean;
}