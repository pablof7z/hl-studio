import { AuthError as AuthErrorType } from '@/domains/auth';
import React from 'react';

interface AuthErrorProps {
    error: AuthErrorType;
    onClear: () => void;
}

export function AuthError({ error, onClear }: AuthErrorProps) {
    return (
        <div style={{ color: 'red', border: '1px solid red', padding: 12, borderRadius: 4 }}>
            <div>
                <strong>Auth Error ({error.method}):</strong> {error.message}
            </div>
            <button onClick={onClear} style={{ marginTop: 8 }}>
                Dismiss
            </button>
        </div>
    );
}
