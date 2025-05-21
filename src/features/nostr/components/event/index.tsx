import { TextEvent } from '@/features/nostr/components/event/TextEvent';
import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';

export type NostrEventProps = {
    event: NDKEvent;
};

export function NostrEvent({ event }: NostrEventProps) {
    switch (event.kind) {
        case NDKKind.Text:
            return <TextEvent event={event} />;
        default:
            return <div>Unsupported event kind: {event.kind}</div>;
    }
}
