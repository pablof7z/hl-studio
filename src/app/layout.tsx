'use client';

import './globals.css';

import { AuthGate } from '@/components/AuthGate';
import { useArticlesStore } from '@/domains/articles';
import { NDKHeadless, NDKSessionLocalStorage, useNDK, useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import { useEffect, useRef } from 'react';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const sessionStorage = useRef(new NDKSessionLocalStorage());
    const currentPubkey = useNDKCurrentPubkey();
    const articleStoreInit = useArticlesStore(s => s.init);
    const { ndk } = useNDK();

    useEffect(() => {
        if (ndk && currentPubkey) {
            articleStoreInit(ndk, currentPubkey);
        }
    }, [currentPubkey]);
    
    return (
        <html lang="en">
            <body>
                <NDKHeadless
                    ndk={{
                        explicitRelayUrls: [ 'wss://relay.primal.net', 'wss://purplepag.es', 'wss://relay.nostr.band', 'wss://relay.damus.io' ],
                    }}
                    session={{
                        storage: sessionStorage.current,
                        opts: { follows: true, profile: true }
                    }}
                />
                <AuthGate>{children}</AuthGate>
            </body>
        </html>
    );
}
