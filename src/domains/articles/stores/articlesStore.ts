import { create } from "zustand";
import { Hexpubkey, NDKArticle, NDKDraft, NDKKind } from "@nostr-dev-kit/ndk";
import NDK from "@nostr-dev-kit/ndk";

interface ArticlesStoreState {
    published: NDKArticle[];
    
    drafts: NDKArticle[];

    init: (ndk: NDK, pubkey: Hexpubkey) => void;
}

export const useArticlesStore = create<ArticlesStoreState>((set) => ({
    published: [],
    drafts: [],

    init: (ndk, pubkey) => {
        // articles
        ndk.subscribe([
            { kinds: [NDKKind.Article], authors: [pubkey] },
        ], { wrap: true }, {
            onEvents: (events) => {
                set((state) => ({
                    published: [...state.published, ...events as NDKArticle[]],
                }))
            },
            onEvent: (event) => {
                set((state) => ({
                    published: [...state.published, NDKArticle.from(event)],
                }));
            },
            onEose: () => {
                console.log("End of stream");
            },
        });

        ndk.subscribe([
            { kinds: [NDKKind.Draft], "#k": [NDKKind.Article.toString()], authors: [pubkey] },
        ], {}, {
            onEvents: async (events) => {
                const decryptedEvents: NDKArticle[] = [];
                for (const event of events) {
                    if (event.hasTag('deleted')) continue;
                    const draft = NDKDraft.from(event);
                    const draftEvent = await draft.getEvent();
                    console.log("Draft event:", draft.inspect);
                    if (!draftEvent) {
                        console.error("Failed to get event from draft:", draft);
                    } else {
                        console.log("Decrypted event:", draftEvent.inspect);
                        decryptedEvents.push(NDKArticle.from(draftEvent));
                    }
                }
                
                set((state) => ({
                    drafts: [...state.drafts, ...decryptedEvents],
                }))
            },
            onEvent: async (event) => {
                const draft = NDKDraft.from(event);
                const draftEvent = await draft.getEvent();
                if (!draftEvent) {
                    console.error("Failed to get event from draft:", draft);
                } else {
                    console.log("Decrypted event:", draftEvent.inspect);
                    set((state) => ({
                        drafts: [...state.drafts, NDKArticle.from(draftEvent)],
                    }));
                }
            },
            onEose: () => {
                console.log("End of stream");
            },
        });
    },
}));