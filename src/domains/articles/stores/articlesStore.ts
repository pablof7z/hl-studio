import NDK, { Hexpubkey, NDKArticle, NDKDraft, NDKKind } from '@nostr-dev-kit/ndk-hooks';
import { create } from 'zustand';

/**
 * Merge two arrays of NDKArticle, deduplicating by tagId() and keeping the one with the highest created_at.
 */
function mergeArticlesByTagId(existing: NDKArticle[], incoming: NDKArticle[]): NDKArticle[] {
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
    init: (ndk: NDK, pubkey: Hexpubkey) => void;
}

export const useArticlesStore = create<ArticlesStoreState>((set) => ({
    published: [],

    init: (ndk, pubkey) => {
        // articles
        ndk.subscribe(
            [{ kinds: [NDKKind.Article], authors: [pubkey] }],
            { wrap: true },
            {
                onEvents: (events) => {
                    console.log('Articles', events);
                    set((state) => ({
                        published: mergeArticlesByTagId(state.published, events.map((e) => NDKArticle.from(e))),
                    }));
                },
                onEvent: (event) => {
                    set((state) => ({
                        published: mergeArticlesByTagId(state.published, [NDKArticle.from(event)]),
                    }));
                },
                onEose: () => {
                    console.log('End of stream');
                },
            }
        );
    },
}));
