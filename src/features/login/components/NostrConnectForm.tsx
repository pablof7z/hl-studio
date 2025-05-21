// NostrConnectForm.tsx
import { Button } from '@/components/ui/button';
import { AuthMethod, useNostrConnectLogin } from '@/domains/auth';
import React, { useState } from 'react';
import { useLoginUi } from '../hooks/useLoginUi';

// Inline NostrConnect SVG icon
const NostrConnectIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="12" fill="#7C3AED" />
        <path d="M12 20a8 8 0 0116 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="4" fill="#fff" />
        <path d="M20 24v4M20 12v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export function NostrConnectForm() {
    const [uri, setUri] = useState('');
    const nostrConnectLogin = useNostrConnectLogin();
    const { setError, error } = useLoginUi();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            nostrConnectLogin(uri);
        } catch (err) {
            setError({
                method: AuthMethod.NostrConnect,
                message: err instanceof Error ? err.message : 'NostrConnect login failed',
            });
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 flex flex-col items-center gap-6 shadow-lg bg-white rounded-xl border border-gray-100">
            <div className="flex flex-col items-center gap-2 w-full">
                <NostrConnectIcon />
                <h2 className="text-2xl font-bold mt-2">NostrConnect Login</h2>
                <p className="text-gray-500 text-center text-sm">
                    Connect your Nostr account using a <span className="font-mono">nostrconnect://</span> URI.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <label htmlFor="nostrconnect-uri" className="font-medium text-gray-700">
                    NostrConnect URI
                </label>
                <input
                    id="nostrconnect-uri"
                    type="text"
                    placeholder="nostrconnect://..."
                    value={uri}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUri(e.target.value)}
                    autoFocus
                    className="text-base px-4 py-2 rounded border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition outline-none"
                    autoComplete="off"
                />
                {/* Error message display */}
                {error?.method === AuthMethod.NostrConnect && error.message && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 text-sm">
                        {error.message}
                    </div>
                )}
                <Button variant="default" className="w-full mt-2">
                    Login with NostrConnect
                </Button>
            </form>
            {/* Optional: QR code placeholder */}
            <div className="w-full flex flex-col items-center mt-4">
                <div className="text-xs text-gray-400">or scan a QR code</div>
                <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded flex items-center justify-center mt-2">
                    {/* QR code would go here */}
                    <span className="text-gray-300">QR</span>
                </div>
            </div>
        </div>
    );
}
