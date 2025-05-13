import React from "react";
import { Avatar } from "./Avatar";
import { useProfileValue } from "@nostr-dev-kit/ndk-hooks";

type NostrAvatarProps = {
    pubkey: string | undefined | null;
    size?: number;
    className?: string;
    alt?: string;
};

export const NostrAvatar: React.FC<NostrAvatarProps> = ({
    pubkey,
    size = 40,
    className,
    alt = "User avatar",
}) => {
    // Always call the hook, even if pubkey is undefined/null
    const profile = useProfileValue(pubkey ?? undefined);

    let avatarUrl = profile?.picture;

    // If no pubkey or no avatar, Avatar component will handle fallback
    return (
        <Avatar
            src={avatarUrl}
            alt={alt}
            size={size}
            className={className}
        />
    );
};