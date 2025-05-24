'use client';

import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';

interface UserAvatarProps {
    pubkey: string;
}

export default function UserName({ pubkey }: UserAvatarProps) {
    const profile = useProfileValue(pubkey);

    return <span className="flex items-center gap-2">{profile?.displayName ?? profile?.name}</span>;
}
