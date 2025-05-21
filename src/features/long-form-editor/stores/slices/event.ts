import { StateCreator } from 'zustand';
import NDK, { NDKArticle, NDKKind } from '@nostr-dev-kit/ndk-hooks';
import { NDKDraft, NDKEvent, NDKTag, NDKUser } from '@nostr-dev-kit/ndk';

export interface EventSlice {
    getEvent: (ndk: NDK, publishAt?: Date) => NDKArticle;
    getEvents: (ndk: NDK, publishAt?: Date) => NDKArticle[];

    restoreFromEvent: (event: NDKArticle, draft?: NDKDraft) => void;

    reset: () => void;
}

// This type should match the combined store, but for slice typing, we use 'any' for flexibility.
export const createEventSlice: StateCreator<any, [], [], EventSlice> = (set, get) => ({
    getEvent: (ndk: NDK, publishAt?: Date) => {
        const publishTimestamp = publishAt ? Math.floor(publishAt.getTime() / 1000) : undefined;
        const {
            content,
            title,
            summary,
            tags,
            image,
            zapSplits,
        } = get();

        const article = new NDKArticle(ndk);
        article.tags = [...tags];

        article.content = content;
        article.title = title;
        article.summary = summary;
        article.image = image ?? undefined;
        if (publishTimestamp) article.created_at = publishTimestamp;
        article.published_at = publishTimestamp;
        article.tags.push(
            ...zapSplits.map((split) => ['zap', split.user.pubkey, split.split.toString()] as NDKTag)
        );

        return article;
    },

    getEvents: (ndk: NDK, publishAt?: Date) => {
        return [get().getEvent(ndk, publishAt)];
    },

    restoreFromEvent: (event: NDKArticle, draft?: NDKDraft) => {
        if (event instanceof NDKArticle) {
            set({
                content: event.content,
                title: event.title,
                summary: event.summary,
                tags: event.tags,
                image: event.image,
                draft,
                zapSplits: event.tags
                    .filter((tag) => tag[0] === 'zap')
                    .map((tag) => ({
                        user: new NDKUser({ pubkey: tag[1] }),
                        split: parseInt(tag[2], 10),
                    })),
            });
        }
    },

    reset: () => {
        set({
            content: '',
            title: '',
            summary: '',
            tags: [],
            image: null,
            zapSplits: [],
            draft: null,
        });
    },
});