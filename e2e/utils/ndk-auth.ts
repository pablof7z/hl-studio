/**
 * Utility to inject the NDK test private key into localStorage for E2E tests.
 * This ensures deterministic, isolated authentication for Playwright tests.
 * 
 * Usage in a test:
 *   await injectTestPrivKey(page);
 */

import { Page } from '@playwright/test';

export const TEST_PRIVKEY = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Injects the test private key into localStorage (or IndexedDB, if needed).
 * Call this before navigating to the login page or before login actions.
 */
export async function injectTestPrivKey(page: Page) {
    // This assumes your app reads the privkey from localStorage under a known key.
    // Adjust the key as needed to match your app's session storage logic.
    await page.addInitScript(([privKey]) => {
        localStorage.setItem('ndk:privkey', privKey);
    }, [TEST_PRIVKEY]);
}