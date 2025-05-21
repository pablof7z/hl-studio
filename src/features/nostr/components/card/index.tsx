import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { TextEventCard } from './TextEventCard';

export type NostrEventCardProps = {
    event: NDKEvent;
};

export function NostrEventCard({ event }: NostrEventCardProps) {
    switch (event.kind) {
        case NDKKind.Text:
            return <TextEventCard event={event} />;
    }
}
