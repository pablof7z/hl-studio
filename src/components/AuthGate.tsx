'use client';

import React from 'react';
import { useAuthStatus } from '@/domains/auth/hooks/useAuthStatus';
import { LoginScreen } from '@/features/login/components/LoginScreen';

type AuthGateProps = {
    children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
    const isLoggedIn = useAuthStatus();
    return isLoggedIn ? <>{children}</> : <LoginScreen />;
}