'use client';

import './globals.css';
import { AuthGate } from '@/components/AuthGate';
import { useArticlesStore } from '@/domains/articles';
import { useDraftStore } from '@/features/drafts/stores';
import { useEditorStore } from '@/features/long-form-editor';
import { useScheduleStore } from '@/features/schedules/stores';
import { getRelayUrls } from '@/ndk/config';
import {
    NDKCacheAdapter,
    NDKHeadless,
    NDKPrivateKeySigner,
    NDKSessionLocalStorage,
    useNDK,
    useNDKCurrentPubkey,
    useNDKSessionLogin,
} from '@nostr-dev-kit/ndk-hooks';
import NDKCacheSqliteWasm from '@nostr-dev-kit/ndk-cache-sqlite-wasm';
import { useEffect, useRef } from 'react';

const testSigner = new NDKPrivateKeySigner('nsec1gz92f7qu9ctxwdztzjramxmkg05say892r5thumarwyj3zde0edss0c9yt'); // MANUAL TESTER AGENT KEY ENABLED
// const testSigner = null;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const sessionStorage = useRef(new NDKSessionLocalStorage());
    const cache = useRef(new NDKCacheSqliteWasm({
        wasmUrl: '/sql-wasm.wasm'
    }));
    const currentPubkey = useNDKCurrentPubkey();
    const articleStoreInit = useArticlesStore((s) => s.init);
    const draftStoreInit = useDraftStore((s) => s.init);
    const scheduleStoreInit = useScheduleStore((s) => s.init);
    const editorStoreInit = useEditorStore((s) => s.init);
    const { ndk } = useNDK();

    // If the manual tester mode is enabled, directly login into the app.
    // const login = useNDKSessionLogin();
    // useEffect(() => {
    //     if (testSigner) {
    //         // login(testSigner);
    //     }
    // }, [login]);

    useEffect(() => {
        if (ndk && currentPubkey) {
            articleStoreInit(ndk, currentPubkey);
            draftStoreInit(ndk, currentPubkey);
            scheduleStoreInit(ndk, currentPubkey);
            editorStoreInit(ndk);
        }
    }, [articleStoreInit, currentPubkey, draftStoreInit, editorStoreInit, ndk, scheduleStoreInit]);

    return (
        <html lang="en">
            <body>
                <NDKHeadless
                    ndk={{
                        explicitRelayUrls: getRelayUrls(),
                        cacheAdapter: cache.current as unknown as NDKCacheAdapter, // yes, this is correct
                    }}
                    session={{
                        storage: sessionStorage.current,
                        opts: { follows: true, profile: true },
                    }}
                />
                <AuthGate>{children}</AuthGate>
            </body>
        </html>
    );
}
