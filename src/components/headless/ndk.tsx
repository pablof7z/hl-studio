'use client';

import { useArticlesStore } from "@/domains/articles";
import ndk from "@/ndk";
import { NDKSessionLocalStorage, useNDKCurrentPubkey, useNDKInit, useNDKSessionMonitor } from "@nostr-dev-kit/ndk-hooks"
import { useEffect } from "react";

const sessionStorage = new NDKSessionLocalStorage();

export function NDKHeadless() {
    const initNDK = useNDKInit();
    const articleStoreInit = useArticlesStore(s => s.init);
    const currentPubkey = useNDKCurrentPubkey();

    useNDKSessionMonitor(sessionStorage, {
        profile: true,
        follows: true,
    });
    
    useEffect(() => {
        initNDK(ndk);
    }, []);

    useEffect(() => {
        if (currentPubkey) {
            articleStoreInit(ndk, currentPubkey);
        }
    }, [currentPubkey, ndk]);

    return null;
}