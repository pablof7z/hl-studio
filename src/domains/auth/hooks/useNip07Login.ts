import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
import { useNDKSessionLogin } from '@nostr-dev-kit/ndk-hooks';
import { useCallback } from 'react';

/**
 * Returns a callback to trigger NIP-07 browser extension login.
 * Usage: const nip07Login = useNip07Login(); nip07Login();
 */
export function useNip07Login() {
    const login = useNDKSessionLogin();

    return useCallback(() => {
        const signer = new NDKNip07Signer();
        signer.blockUntilReady().then(() => login(signer));
    }, [login]);
}
