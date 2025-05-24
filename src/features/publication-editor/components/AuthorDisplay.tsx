'use client';

import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import UserAvatar from '@/features/nostr/components/user/UserAvatar';

interface AuthorDisplayProps {
    pubkey: string;
    currentPubkey: string | undefined;
    onRemove: (pubkey: string) => void;
}

export function AuthorDisplay({ pubkey, currentPubkey, onRemove }: AuthorDisplayProps) {
    const profile = useProfileValue(pubkey);
    
    return (
        <div className="flex items-center gap-2 group">
            <UserAvatar pubkey={pubkey} size="xs" />
            <span className="text-sm">{profile?.displayName || profile?.name || pubkey.slice(0, 8)}</span>
            {currentPubkey !== pubkey && (
                <button
                    onClick={() => onRemove(pubkey)}
                    className="text-gray-500 hover:text-red-500 ml-1 group-hover:opacity-100 opacity-0 transition-opacity"
                >
                    ×
                </button>
            )}
        </div>
    );
}