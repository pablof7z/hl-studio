import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useNDKSessionLogin } from '@nostr-dev-kit/ndk-hooks';
import { useCallback } from 'react';

/**
 * Returns a callback to log in with an nsec private key.
 * Usage: const nsecLogin = useNsecLogin(); nsecLogin(nsec: string);
 */
export function useNsecLogin() {
    const login = useNDKSessionLogin();

    return useCallback(
        (nsec: string) => {
            console.log('[useNsecLogin] nsec:', nsec);
            const signer = new NDKPrivateKeySigner(nsec);
            login(signer);
        },
        [login]
    );
}
