
"use client"

import { useProfileValue } from "@nostr-dev-kit/ndk-hooks"

interface UserAvatarProps {
    pubkey: string
}

export default function UserName({ pubkey }: UserAvatarProps) {
    const profile = useProfileValue(pubkey)

    // Get initials from profile or use first characters of pubkey
    const initials = profile?.name ? profile.name.substring(0, 2).toUpperCase() : pubkey.substring(0, 2).toUpperCase()

    return (
        <span className="flex items-center gap-2">
            {profile?.displayName}
        </span>
    )
}
