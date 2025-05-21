'use client';

import { useAuthStatus } from '@/domains/auth/hooks/useAuthStatus';
import { LoginScreen } from '@/features/login/components/LoginScreen';
import { useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import React from 'react';

type AuthGateProps = {
    children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
    const currentPubkey = useNDKCurrentPubkey();

    return !!currentPubkey ? <>{children}</> : <LoginScreen />;
}
