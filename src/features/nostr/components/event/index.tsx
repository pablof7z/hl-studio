import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { TextEvent } from "@/features/nostr/components/event/TextEvent";

export type NostrEventProps = {
    event: NDKEvent;
};

export function NostrEvent({ event }: NostrEventProps) {
    switch (event.kind) {
        case NDKKind.Text: return <TextEvent event={event} />;
}