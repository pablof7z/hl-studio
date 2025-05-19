# NDK Relay Configuration

This project uses [Nostr Development Kit (NDK)](https://github.com/nostr-dev-kit/ndk) for connecting to Nostr relays. The relay configuration has been set up to support both production and testing environments.

## Configuration Files

- `src/ndk/config.ts` - Contains the relay configuration logic
- `src/ndk/index.ts` - Exports the configuration
- `.env.example` - Example environment variables
- `.env.test` - Environment variables for E2E testing

## Default Relays

By default, the application connects to the following relays:

```
wss://relay.primal.net
wss://purplepag.es
wss://relay.nostr.band
wss://relay.damus.io
```

## Environment Variables

You can customize the relay configuration using the following environment variables:

### Using a Test Relay

```
# Set to 'true' to use a test relay for E2E tests
NEXT_PUBLIC_USE_TEST_RELAY=true

# Custom test relay URL (defaults to ws://localhost:10547 if not specified)
NEXT_PUBLIC_TEST_RELAY_URL=ws://localhost:10547
```

### Using Custom Relays

```
# Custom relay URLs as a JSON array (overrides default relays)
NEXT_PUBLIC_RELAY_URLS='["wss://relay.example.com", "wss://another-relay.example.com"]'
```

## Running E2E Tests

For E2E tests with Playwright, you can use the `.env.test` configuration:

1. Start a local test relay:
   ```
   nak serve
   ```

2. Run your tests with the test environment:
   ```
   NODE_ENV=test npm run test:e2e
   ```

This will use the local test relay instead of the production relays, ensuring that your tests are isolated and don't interact with the real Nostr network.