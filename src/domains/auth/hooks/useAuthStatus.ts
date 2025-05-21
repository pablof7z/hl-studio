import { useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import { useMemo } from 'react';

/**
 * Returns true if a user is logged in (i.e., has a current pubkey).
 */
export function useAuthStatus(): boolean {
    const pubkey = useNDKCurrentPubkey();
    return useMemo(() => !!pubkey, [!!pubkey]);
}
