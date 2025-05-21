import { NostrEventSearchResult } from '@/domains/events';
import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import React from 'react';

interface MentionUserResultProps {
    user: NDKUser;
    index: number;
    isSelected: boolean;
    onSelect: (user: NDKUser, index: number) => void;
}

const MentionUserResult: React.FC<MentionUserResultProps> = ({ user, index, isSelected, onSelect }) => {
    const profile = useProfileValue(user.pubkey);

    return (
        <div
            className={`flex items-center p-2 cursor-pointer ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}`}
            onClick={() => onSelect(user, index)}
            data-testid={`mention-user-result-${index}`}
        >
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-muted">
                {profile?.image && (
                    <img
                        src={profile.image}
                        alt={profile?.displayName || profile?.name || user.npub.slice(0, 8)}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="font-medium truncate">{profile?.displayName || profile?.name || 'Anonymous'}</div>
                <div className="text-xs text-muted-foreground truncate">{user.npub.slice(0, 12)}...</div>
            </div>
        </div>
    );
};

interface MentionEventResultProps {
    eventResult: NostrEventSearchResult;
    onSelect: (event: NDKEvent) => void;
}

const MentionEventResult: React.FC<MentionEventResultProps> = ({ eventResult, onSelect }) => {
    const { event, type, isValid } = eventResult;

    if (!event || !isValid) {
        return <div className="p-2 text-sm text-muted-foreground">Invalid or unsupported event identifier</div>;
    }

    // Get author profile if available
    const profile = useProfileValue(event.pubkey);

    // Get a summary of the event content
    const summary = event.content?.slice(0, 60) + (event.content?.length > 60 ? '...' : '');

    return (
        <div
            className="flex flex-col p-2 cursor-pointer hover:bg-muted"
            onClick={() => onSelect(event)}
            data-testid="mention-event-result"
        >
            <div className="flex items-center mb-1">
                <div className="text-sm font-medium">
                    {type === 'note' ? 'Note' : type === 'nevent' ? 'Event' : 'Address'}
                </div>
                <div className="text-xs text-muted-foreground ml-2">
                    by {profile?.displayName || profile?.name || event.pubkey.slice(0, 8)}
                </div>
            </div>
            <div className="text-sm text-muted-foreground">{summary || 'No content'}</div>
        </div>
    );
};

interface MentionSearchResultsProps {
    users: NDKUser[];
    selectedIndex: number;
    event?: NDKEvent | null;
    onSelectUser: (user: NDKUser, index: number) => void;
    onSelectEvent: (event: NDKEvent) => void;
}

export const MentionSearchResults: React.FC<MentionSearchResultsProps> = ({
    users,
    selectedIndex,
    event,
    onSelectUser,
    onSelectEvent,
}) => {
    if (event) {
        // Show event result
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
                        <div className="text-sm font-medium">Event</div>
                        <div className="text-xs text-muted-foreground ml-2">
                            by {profile?.displayName || profile?.name || event.pubkey.slice(0, 8)}
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{summary || 'No content'}</div>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No users found</div>;
    }

    return (
        <div className="max-h-[300px] overflow-y-auto">
            {users.map((user, index) => (
                <MentionUserResult
                    key={user.pubkey}
                    user={user}
                    index={index}
                    isSelected={index === selectedIndex}
                    onSelect={onSelectUser}
                />
            ))}
        </div>
    );
};
