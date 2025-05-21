import { NDKNip46Signer } from '@nostr-dev-kit/ndk';
import { useNDK, useNDKSessionLogin } from '@nostr-dev-kit/ndk-hooks';
import { useCallback } from 'react';

/**
 * Returns a callback to log in with a NostrConnect URI.
 * Usage: const nostrConnectLogin = useNostrConnectLogin(); nostrConnectLogin(uri: string);
 */
export function useNostrConnectLogin() {
    const { ndk } = useNDK();
    const login = useNDKSessionLogin();

    return useCallback(
        (connectUri: string) => {
            if (!ndk) return;
            const signer = NDKNip46Signer.nostrconnect(ndk, connectUri);
            login(signer);
        },
        [login]
    );
}
