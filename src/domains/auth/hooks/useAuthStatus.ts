import { useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks";

/**
 * Returns true if a user is logged in (i.e., has a current pubkey).
 */
export function useAuthStatus(): boolean {
    const pubkey = useNDKCurrentPubkey();
    return !!pubkey;
}