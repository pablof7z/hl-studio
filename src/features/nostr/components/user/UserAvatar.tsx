'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';

interface UserAvatarProps {
    pubkey: string;
    size?: 'xs' | 'sm' | 'default' | 'lg';
}

export default function UserAvatar({ pubkey, size = 'default' }: UserAvatarProps) {
    const profile = useProfileValue(pubkey);

    // Determine size class
    const sizeClass = {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-16 w-16',
    }[size];

    // Get initials from profile or use first characters of pubkey
    const initials = profile?.name ? profile?.name.substring(0, 2).toUpperCase() : pubkey.substring(0, 2).toUpperCase();

    return (
        <Avatar className={sizeClass}>
            <AvatarImage src={profile?.picture || '/placeholder.svg'} alt={profile?.name || pubkey.substring(0, 8)} />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}
