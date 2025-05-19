import NDK, { NDKEvent, NDKSigner } from "@nostr-dev-kit/ndk";

/**
 * Create a NIP-98 Authorization header for a given URL, method, and optional body.
 * Works in both browser and Node.js environments.
 *
 * @param ndk - The NDK instance
 * @param signer - The NDKSigner (can be private key, NIP-07, NIP-46, etc.)
 * @param url - The absolute URL being requested
 * @param method - The HTTP method (GET, POST, etc.)
 * @param body - Optional request body (string or object)
 * @returns Promise<string> - The value for the Authorization header
 */
export async function createNip98AuthHeader(
    ndk: NDK,
    url: string,
    method: string,
    body?: any,
    signer?: NDKSigner,
): Promise<string> {
    // NIP-98 kind
    const NIP98_KIND = 27235;
    // TypeScript workaround: force type for NDK instance to match NDKEvent constructor
    // This is safe as long as all NDK imports resolve to the same package version.
    const event = new NDKEvent(ndk as any);
    event.kind = NIP98_KIND;
    event.created_at = Math.floor(Date.now() / 1000);
    event.tags = [
        ["u", url],
        ["method", method.toUpperCase()],
    ];
    event.content = "";

    // If there's a body and it's a mutating method, add payload hash
    if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
        let bodyText: string;
        if (typeof body === "string") {
            bodyText = body;
        } else {
            bodyText = JSON.stringify(body);
        }

        let hashHex: string;
        if (typeof window !== "undefined" && window.crypto?.subtle) {
            // Browser: use crypto.subtle
            const encoder = new TextEncoder();
            const data = encoder.encode(bodyText);
            const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        } else {
            // Node.js: use crypto module
            const crypto = await import("crypto");
            hashHex = crypto.createHash("sha256").update(bodyText).digest("hex");
        }
        event.tags.push(["payload", hashHex]);
    }

    await event.sign(signer);

    const eventJson = JSON.stringify(event.rawEvent());
    let base64: string;
    if (typeof window !== "undefined" && window.btoa) {
        base64 = window.btoa(eventJson);
    } else {
        base64 = Buffer.from(eventJson).toString("base64");
    }
    return `Nostr ${base64}`;
}