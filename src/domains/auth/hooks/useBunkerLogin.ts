import { useCallback } from "react";
import { useNDK, useNDKSessionLogin } from "@nostr-dev-kit/ndk-hooks";
import { NDKNip46Signer } from "@nostr-dev-kit/ndk";

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