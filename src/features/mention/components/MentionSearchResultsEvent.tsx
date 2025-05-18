import React from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useProfileValue } from "@nostr-dev-kit/ndk-hooks";

interface MentionSearchResultsEventProps {
    event: NDKEvent | null | undefined;
    onSelectEvent: (event: NDKEvent) => void;
}

export const MentionSearchResultsEvent: React.FC<MentionSearchResultsEventProps> = ({
    event,
    onSelectEvent
}) => {
    if (!event) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                No event found
            </div>
        );
    }

    const profile = useProfileValue(event.pubkey);
    const summary = event.content?.slice(0, 60) + (event.content?.length > 60 ? '...' : '');

    return (
        <div className="max-h-[300px] overflow-y-auto">
            <div
                className="flex flex-col p-2 cursor-pointer hover:bg-muted"
                onClick={() => onSelectEvent(event)}
                data-testid="mention-event-result"
            >
                <div className="flex items-center mb-1">
                    <div className="text-sm font-medium">
                        Event
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">
                        by {profile?.displayName || profile?.name || event.pubkey.slice(0, 8)}
                    </div>
                </div>
                <div className="text-sm text-muted-foreground">
                    {summary || 'No content'}
                </div>
            </div>
        </div>
    );
};