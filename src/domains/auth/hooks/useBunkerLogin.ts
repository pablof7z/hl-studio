import { NDKNip46Signer } from '@nostr-dev-kit/ndk';
import { useNDK, useNDKSessionLogin } from '@nostr-dev-kit/ndk-hooks';
import { useCallback } from 'react';

/**
 * Returns a callback to log in with a Bunker URI.
 * Usage: const bunkerLogin = useBunkerLogin(); bunkerLogin(uri: string);
 */
export function useBunkerLogin() {
    const { ndk } = useNDK();
    const login = useNDKSessionLogin();

    return useCallback(
        (bunkerUri: string) => {
            if (!ndk) return;
            const signer = NDKNip46Signer.bunker(ndk, bunkerUri);
            login(signer);
        },
        [login, ndk]
    );
}
