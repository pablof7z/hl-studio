export const TEST_PRIVKEY = "0000000000000000000000000000000000000000000000000000000000000000";
// test/ndkTestUtils.ts
import NDK, { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { useNDKSessionLogin } from "@nostr-dev-kit/ndk-hooks";

// Singleton NDK instance for tests (offline-first, no relays)
let ndk: NDK | null = null;

export function getTestNDK(): NDK {
    if (!ndk) {
        ndk = new NDK({ explicitRelayUrls: [] });
    }
    return ndk;
}

/**
 * Authenticates the NDK singleton with the provided test private key.
 * Returns the NDKUser for the authenticated key.
 */
export function authenticateTestNDK(): NDKUser {
    const instance = getTestNDK();
    const signer = new NDKPrivateKeySigner("0000000000000000000000000000000000000000000000000000000000000000");
    instance.signer = signer;
    return instance.getUser({ pubkey: signer.pubkey });
}

/**
 * React hook to login the test user using ndk-hooks (for components using session hooks).
 * Should be called in a test setup or before rendering.
 */
export function useTestNDKSessionLogin() {
    const login = useNDKSessionLogin();
    React.useEffect(() => {
        const signer = new NDKPrivateKeySigner("0000000000000000000000000000000000000000000000000000000000000000");
        login(signer);
    }, [login]);
}
/**
 * Creates and initializes an NDK instance with test relays and the test private key.
 * Returns the initialized NDK instance, ready for use in tests.
 * Usage: const ndk = await setupTestNDK();
 */
export async function setupTestNDK(): Promise<NDK> {
    const ndk = new NDK({ explicitRelayUrls: ["wss://test-relay"] });
    const signer = new NDKPrivateKeySigner(TEST_PRIVKEY);
    ndk.signer = signer;
    await ndk.connect();
    return ndk;
}