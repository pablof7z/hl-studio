import React from "react";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { useProfileValue } from "@nostr-dev-kit/ndk-hooks";

interface MentionUserResultProps {
    user: NDKUser;
    index: number;
    isSelected: boolean;
    onSelect: (user: NDKUser, index: number) => void;
}

const MentionUserResult: React.FC<MentionUserResultProps> = ({
    user,
    index,
    isSelected,
    onSelect
}) => {
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
                <div className="font-medium truncate">
                    {profile?.displayName || profile?.name || "Anonymous"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                    {user.npub.slice(0, 12)}...
                </div>
            </div>
        </div>
    );
};

interface MentionSearchResultsUsersProps {
    users: NDKUser[];
    selectedIndex: number;
    onSelectUser: (user: NDKUser, index: number) => void;
}

export const MentionSearchResultsUsers: React.FC<MentionSearchResultsUsersProps> = ({
    users,
    selectedIndex,
    onSelectUser
}) => {
    if (users.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                No users found
            </div>
        );
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