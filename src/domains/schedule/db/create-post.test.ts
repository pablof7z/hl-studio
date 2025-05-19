import NDK, { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk-hooks";
import { expect, test, beforeEach, afterEach } from "vitest";
import { createNip98AuthHeader } from "../../api/utils/createNip98AuthHeader";

const TEST_PRIVKEY = "0000000000000000000000000000000000000000000000000000000000000000";
const API_BASE = "http://localhost:3000/api/posts"; // Adjust if test server runs elsewhere

let ndk: NDK;
let signer: NDKPrivateKeySigner;
let pubkey: string;

beforeEach(async () => {
    ndk = new NDK({ explicitRelayUrls: [] }); // No relays needed for local signing
    signer = new NDKPrivateKeySigner(TEST_PRIVKEY);
    ndk.signer = signer;
    pubkey = signer.pubkey;
});

afterEach(async () => {
    // Clean up if needed (e.g., delete test posts via DB or API if supported)
});

test("schedules a post and lists it for the user", async () => {
    // 1. Create a post event to be scheduled
    const postEvent = new NDKEvent(ndk);
    postEvent.kind = 1; // Example kind for a post
    postEvent.content = "Scheduled post from test";
    postEvent.tags = [["test", "schedule-e2e"]];
    await postEvent.sign(signer);

    // 2. Prepare the POST body
    const scheduledAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour in the future
    const status = "scheduled";
    const body = {
        authorPubkey: pubkey,
        status,
        scheduledAt: scheduledAt.toISOString(),
        rawEvent: JSON.stringify(postEvent.rawEvent()),
    };

    // 3. Create NIP-98 auth header for POST (include body for payload hash)
    // TypeScript: workaround for NDK type mismatch between test and utility
    const postAuthHeader = await createNip98AuthHeader(ndk, API_BASE, "POST", body, signer);

    // 4. POST to /api/posts to schedule the post
    const postRes = await fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: postAuthHeader,
        },
        body: JSON.stringify(body),
    });
    expect(postRes.status).toBe(200);
    const postJson = await postRes.json();
    expect(postJson).toHaveProperty("id");

    // 5. Create NIP-98 auth header for GET
    // TypeScript: workaround for NDK type mismatch between test and utility
    const getAuthHeader = await createNip98AuthHeader(ndk, API_BASE, "GET", undefined, signer);

    // 6. GET /api/posts to list posts for the user
    const getRes = await fetch(API_BASE, {
        method: "GET",
        headers: {
            Authorization: getAuthHeader,
        },
    });
    expect(getRes.status).toBe(200);
    const getJson = await getRes.json();
    expect(getJson).toHaveProperty("posts");
    const posts = getJson.posts;

    // 7. Find the scheduled post by content/tag
    const found = posts.find(
        (p: any) =>
            p.authorPubkey === pubkey &&
            p.status === status &&
            p.scheduledAt &&
            JSON.parse(p.rawEvent).content === "Scheduled post from test"
    );
    expect(found).toBeDefined();
    expect(new Date(found.scheduledAt).toISOString()).toBe(scheduledAt.toISOString());
});