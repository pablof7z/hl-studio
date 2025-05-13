# 🧪 Testing Rules & Best Practices for Nostr Applications

## 1. Testing Philosophy

- **Trustless, End-to-End:** All major features must be covered by thorough end-to-end (E2E) tests. Our tests should simulate real user flows, verifying that the app works as intended from the UI down to the relay.
- **Offline-First:** Tests must reflect our offline-first approach. Never test for or rely on global `loading` flags. Instead, assert on the presence or absence of data as it becomes available.
- **NDK-Centric:** All Nostr interactions in tests must use NDK and ndk-hooks. Never use `nostr-tools` or custom event handling in tests.
- **Deterministic & Isolated:** Each test should be self-contained, using the provided test private key for authentication and never depending on external state.

## 2. How to Run Tests

- **Unit & Integration Tests:**  
  Run all colocated tests with:
  ```sh
  bun test
  ```
  This will execute all `*.test.ts` and `*.test.tsx` files throughout the codebase.

- **End-to-End (E2E) Tests:**  
  E2E tests should be run in the same way, as they are colocated with features/components. If using a separate E2E runner, document the command in this file.

- **CI:**  
  All tests are run in CI via `bun test`. PRs will not be merged unless all tests pass.

## 3. Authentication in Tests

- **Always use the following private key for authentication in all tests:**
  ```
  0000000000000000000000000000000000000000000000000000000000000000
  ```
- This ensures deterministic, isolated test runs and avoids polluting real user data.
- When mocking authentication, use NDK's test utilities to inject this key.

## 4. Test Utilities

- **NDK Test Utilities:**  
  Use the provided helpers for:
  - Instantiating NDK with test relays and the test private key.
  - Mocking relay responses and event publishing.
  - Cleaning up subscriptions and state between tests.

- **React Testing Library:**  
  - Use `render` from React Testing Library for all component tests.
  - Prefer user-centric queries (`getByRole`, `getByText`, etc.) over implementation details.

- **Custom Utilities:**  
  - If you need to mock NDK hooks, use the utilities in `src/ndk/` or `src/domains/auth/hooks/` as appropriate.
  - Always reset NDK state between tests to avoid cross-test contamination.

## 5. Best Practices

- **Colocate Tests:**  
  Place all test files next to the code they test, using the `.test.ts` or `.test.tsx` suffix.

- **Test Structure:**  
  - For domains: `src/domains/<entity>/hooks/useX.test.ts`
  - For features: `src/features/<feature>/components/Component.test.tsx`
  - For UI: `src/ui/atoms/Button.test.tsx`, etc.

- **E2E Coverage:**  
  - Every major user flow (login, posting, reading, switching accounts, etc.) must have an E2E test.
  - E2E tests should use the real NDK stack, not mocks, unless testing error states.

- **NDK/nostr Best Practices:**  
  - Never assert on or set global `loading` flags.
  - Always use `useSubscribe` for event fetching in tests, never `useEvents` or custom fetchers.
  - Do not sort events after fetching; NDK already sorts them.
  - Do not await `event.publish()` in tests; rely on optimistic updates and assert on UI state.

- **Isolation:**  
  - Clean up all subscriptions and state after each test.
  - Use the test private key for all event publishing and user actions.

- **No Centralization:**  
  - Do not use or test custom auth contexts. All identity and data must flow through NDK hooks.

## 6. Anti-Patterns (Never Do)

| 🚫                                  | Why                                               |
| ----------------------------------- | ------------------------------------------------- |
| Global `loading` flags in tests     | Nostr is offline‑first; render partial data       |
| Custom event fetchers in tests      | Always use NDK/ndk-hooks for all nostr data      |
| Using real user keys in tests       | Use the provided test private key only           |
| Sorting events after fetch          | NDK sorts for you; don't duplicate logic         |
| Awaiting `event.publish()` in tests | UI shouldn't block; rely on optimistic cache     |
| React Context for auth/ndk in tests | Use NDK hooks directly; no custom context        |

## 7. Example: Authenticating in a Test

```ts
import { NDK, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { render } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

const TEST_PRIVKEY = "0000000000000000000000000000000000000000000000000000000000000000";

test("renders for test user", async () => {
    const ndk = new NDK({ explicitRelayUrls: ["wss://test-relay"] });
    const signer = new NDKPrivateKeySigner(TEST_PRIVKEY);
    ndk.signer = signer;
    await ndk.connect();

    // Pass ndk via props or use a test provider as needed
    render(<MyComponent />);
    // ...assertions
});
```

## 8. Summary

- All major features must be thoroughly E2E tested.
- Use the specified test private key for all authentication.
- Follow NDK and nostr best practices: offline-first, no loading flags, no custom event fetchers.
- Colocate all tests with the code they test.
- Use the provided test utilities for setup, teardown, and mocking.
- Never centralize auth or data outside of NDK hooks.