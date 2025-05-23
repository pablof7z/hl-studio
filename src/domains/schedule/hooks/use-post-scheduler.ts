import NDK, { dvmSchedule, NDKEvent, NDKKind, NDKUser } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-hooks";
import { useCallback } from "react";

const HIGHLIGHTER_DVM_PUBKEY = "366826604721a653b1bb53418b0ca02495569c90cc325d14363a6b7b3489492b";

export function usePostScheduler() {
    const { ndk } = useNDK();
    const dvm = ndk?.getUser({ pubkey: HIGHLIGHTER_DVM_PUBKEY });
    
    return useCallback((event: NDKEvent) => {
        if (!dvm) throw new Error('DVM is not initialized');
        if (!ndk) throw new Error('NDK is not initialized');
        
        schedule(
            ndk,
            event,
            dvm,
        )
    }, [dvm])
}

async function schedule(
    ndk: NDK,
    event: NDKEvent,
    dvm: NDKUser
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
