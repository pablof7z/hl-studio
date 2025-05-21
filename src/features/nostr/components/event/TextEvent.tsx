import { NostrEventProps } from '.';

export function TextEvent({ event }: NostrEventProps) {
    return <div className="text-event">{event.content}</div>;
}
