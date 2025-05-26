import { schedule } from '@/features/schedules/utils/schedule';
import { NDKDraft, NDKEvent, NDKTag, NDKUser } from '@nostr-dev-kit/ndk-hooks';
import NDK, { NDKArticle } from '@nostr-dev-kit/ndk-hooks';
import { StateCreator } from 'zustand';
import type { ZapSplit } from './zaps';

export interface EventSlice {
    getEvent: (ndk: NDK, publishAt?: Date) => NDKArticle;
    getEvents: (ndk: NDK, publishAt?: Date) => NDKArticle[];

    restoreFromEvent: (event: NDKArticle, draft?: NDKDraft) => void;

    post: (ndk: NDK) => Promise<NDKEvent[]>;
    reset: () => void;
}

// This type should match the combined store, but for slice typing, we use 'any' for flexibility.
export const createEventSlice: StateCreator<any, [], [], EventSlice> = (set, get) => ({
    getEvent: (ndk: NDK) => {
        const { content, title, summary, tags, author, image, zapSplits, publishAt } = get();

        // Use the provided publishAt parameter, or fall back to the store's publishAt
        const effectivePublishAt = publishAt;
        const publishTimestamp = effectivePublishAt ? Math.floor(effectivePublishAt.getTime() / 1000) : undefined;

        const article = new NDKArticle(ndk);
        article.tags = [...tags];

        if (author) article.pubkey = author.pubkey;
        article.content = content;
        article.title = title;
        article.summary = summary;
        article.image = image ?? undefined;
        if (publishTimestamp) article.created_at = publishTimestamp;
        article.published_at = publishTimestamp;
        article.tags.push(
            ...zapSplits.map((split: ZapSplit) => ['zap', split.user.pubkey, split.split.toString()] as NDKTag)
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
            publishAt: null,
        });
    },

    post: async (ndk: NDK): Promise<NDKEvent[]> => {
        const { author, publishAt, getEvents, saveDraft } = get();
        const currentUser = ndk.activeUser;

        const events = getEvents(ndk);

        if (author && author?.pubkey != currentUser?.pubkey) {
            console.debug('[EventSlice] Creating proposal event');
            saveDraft(true, true);
        } else if (publishAt && publishAt > Date.now() / 1000) {
            // this is a scheduled post
            for (const event of events) {
                await event.sign();
                await schedule(ndk, event);
            }
        } else {
            // this is a normal post
            for (const event of events) {
                await event.publish();
            }
        }

        return events;
    },
});
