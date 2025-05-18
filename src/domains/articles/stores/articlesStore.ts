import { create } from "zustand";
import { Hexpubkey, NDKArticle, NDKDraft, NDKKind } from "@nostr-dev-kit/ndk";
import NDK from "@nostr-dev-kit/ndk";

/**
 * Merge two arrays of NDKArticle, deduplicating by tagId() and keeping the one with the highest created_at.
 */
function mergeArticlesByTagId(
    existing: NDKArticle[],
    incoming: NDKArticle[]
): NDKArticle[] {
    const map = new Map<string, NDKArticle>();
    // Add existing articles to the map
    for (const article of existing) {
        const tagId = article.tagId();
        if (!tagId) continue;
        map.set(tagId, article);
    }
    // Merge/replace with incoming articles if newer
    for (const article of incoming) {
        const tagId = article.tagId();
        if (!tagId) continue;
        const current = map.get(tagId);
        if (!current || (article.created_at && article.created_at > (current.created_at ?? 0))) {
            map.set(tagId, article);
        }
    }
    return Array.from(map.values());
}

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
                    published: mergeArticlesByTagId(
                        state.published,
                        events as NDKArticle[]
                    ),
                }))
            },
            onEvent: (event) => {
                set((state) => ({
                    published: mergeArticlesByTagId(
                        state.published,
                        [NDKArticle.from(event)]
                    ),
                }));
            },
            onEose: () => {
                console.log("End of stream");
            },
        });

        ndk.subscribe([
            { kinds: [NDKKind.Draft+10], "#k": [NDKKind.Article.toString()], authors: [pubkey] },
        ], {}, {
            onEvents: async (events) => {
                const decryptedEvents: NDKArticle[] = [];
                for (const event of events) {
                    if (event.hasTag('deleted')) continue;
                    const draft = NDKDraft.from(event);
                    const draftEvent = await draft.getEvent();
                    console.log("Draft event:", draft.inspect);
                    if (draftEvent) {
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
                if (draftEvent) {
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