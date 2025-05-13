import { useCallback } from "react";
import { useNDKSessionLogin } from "@nostr-dev-kit/ndk-hooks";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";

/**
 * Returns a callback to log in with an nsec private key.
 * Usage: const nsecLogin = useNsecLogin(); nsecLogin(nsec: string);
 */
export function useNsecLogin() {
    const login = useNDKSessionLogin();

    return useCallback(
        (nsec: string) => {
            const signer = new NDKPrivateKeySigner(nsec);
            login(signer);
        },
        [login]
    );
}