/**
 * Utility to inject the NDK test private key into localStorage for E2E tests.
 * This ensures deterministic, isolated authentication for Playwright tests.
 * 
 * Usage in a test:
 *   await injectTestPrivKey(page);
 */

import { Page } from '@playwright/test';

export const TEST_PRIVKEY = 'nsec145qg56ep409ww63ceqeze7tfg4pzp69ft29zrvvjfymduqfqelnqwjlgqv';

/**
 * Injects the test private key into localStorage (or IndexedDB, if needed).
 * Call this before navigating to the login page or before login actions.
 */
export async function injectTestPrivKey(page: Page) {
    // This assumes your app reads the privkey from localStorage under a known key.
    // Adjust the key as needed to match your app's session storage logic.
    await page.addInitScript(([privKey]) => {
        localStorage.setItem('ndk-saved-sessions', JSON.stringify([{"pubkey":"3f68dede81549cc0844fafe528f1574b51e095e7491f468bd9689f87779bb81d","signerPayload":"{\"type\":\"private-key\",\"payload\":\"1a5ccb796c7415723e09551dc2e817ca465c3cc3fb3ff26dd9d4f2e3e685fa1b\"}"}]));
        localStorage.setItem('ndk-active-pubkey', '3f68dede81549cc0844fafe528f1574b51e095e7491f468bd9689f87779bb81d')
    }, [TEST_PRIVKEY]);
}

export async function clearLocalStorage(page: Page) {
    await page.addInitScript(() => {
        localStorage.clear();
    });
}