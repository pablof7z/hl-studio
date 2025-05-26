import NDK, { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';

export const HIGHLIGHTER_DVM_USER = new NDKUser({ pubkey: "366826604721a653b1bb53418b0ca02495569c90cc325d14363a6b7b3489492b" });

export async function schedule(
    ndk: NDK,
    event: NDKEvent,
    dvm: NDKUser = HIGHLIGHTER_DVM_USER
) {
    const req = new NDKEvent(ndk, {
        kind: 5905,
        content: JSON.stringify({
            event: event.rawEvent()
        }),
        tags: [
            ["p", dvm.pubkey]
        ]
    })
    await req.encrypt(dvm);
    req.publish();
}
