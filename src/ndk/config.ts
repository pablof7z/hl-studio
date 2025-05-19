/**
 * NDK relay configuration
 * 
 * This file contains the configuration for NDK relays.
 * In production, we use a set of default relays.
 * For E2E tests, we use a local relay started with `nak serve`.
 */

/**
 * Default production relays
 */
export const DEFAULT_RELAYS = [
    'wss://relay.primal.net',
    'wss://purplepag.es',
    'wss://relay.nostr.band',
    'wss://relay.damus.io'
];

/**
 * Get relay URLs based on environment
 * 
 * @returns Array of relay URLs to connect to
 */
export function getRelayUrls(): string[] {
    // Check if we're in a test environment
    if (process.env.NEXT_PUBLIC_USE_TEST_RELAY === 'true') {
        const testRelayUrl = process.env.NEXT_PUBLIC_TEST_RELAY_URL || 'ws://localhost:10547';
        console.log(`Using test relay: ${testRelayUrl}`);
        return [testRelayUrl];
    }

    // For custom relay configuration
    if (process.env.NEXT_PUBLIC_RELAY_URLS) {
        try {
            const customRelays = JSON.parse(process.env.NEXT_PUBLIC_RELAY_URLS);
            if (Array.isArray(customRelays) && customRelays.length > 0) {
                return customRelays;
            }
        } catch (e) {
            console.error('Failed to parse NEXT_PUBLIC_RELAY_URLS, using defaults', e);
        }
    }

    // Default to production relays
    return DEFAULT_RELAYS;
}