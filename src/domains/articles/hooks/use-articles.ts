import { NDKArticle, NDKDraft, NDKEvent, NDKKind } from '@nostr-dev-kit/ndk-hooks';
import { useArticlesStore } from '../stores/articlesStore';
import { useDraftStore } from '@/features/drafts/stores';
import { useMemo } from 'react';
import { useScheduleStore } from '@/features/schedules/stores';
import { NDKSchedule } from '@/features/schedules/event/schedule';

type ArticleEntry = {
    article: NDKArticle;
    event: NDKEvent;
    draft?: NDKDraft;
    schedule?: NDKSchedule;
    created_at: number;
    status: string;
    counterparty?: string; // For proposals
};

/**
 * useArticles hook
 * - Returns merged list of published, draft, and scheduled (API) articles.
 * - Each article is extended with a `status` property: "published" | "draft" | "scheduled" | "archived"
 * - Sorted by created_at descending (newest first)
 * - Offline-first: no loading flags, hydrates as data arrives
 */
export function useArticles({ includeDeleted } = { includeDeleted: false }): ArticleEntry[] {
    const published = useArticlesStore((state) => state.published);
    const drafts = useDraftStore((state) => state.items);
    const scheduledPosts = useScheduleStore((state) => state.schedules);

    const scheduledArticles = useMemo(() => {
        return scheduledPosts
            .filter((post) => post.innerEvent.kind === NDKKind.Article)
            .map(({ innerEvent, schedule }) => ({
                dTag: innerEvent.dTag!,
                article: NDKArticle.from(innerEvent),
                schedule,
                created_at: innerEvent.created_at,
                status: 'scheduled',
            }))
    }, [scheduledPosts]);

    const draftArticles = useMemo(() => {
        return Object.values(drafts)
            .map((draftPost) => draftPost[0])
            .filter(({innerEvent}) => innerEvent.kind === NDKKind.Article)
            .filter(({draft}) => !draft.hasTag("deleted"))
            .map((draftPost) => {
                const dTag = draftPost.innerEvent.dTag ?? draftPost.draft.dTag;
                if (!dTag) {
                    return null; // Skip drafts without a dTag
                }
                return {
                    article: NDKArticle.from(draftPost.innerEvent),
                    draft: draftPost.draft,
                    created_at: draftPost.draft.created_at,
                    category: draftPost.category,
                    counterparty: draftPost.counterparty,
                    dTag
                };
            })
            .filter(d => !!d);
    }, [drafts]);

    return useMemo(() => {
        const items: Record<string, ArticleEntry> = {};

        // Add all the published articles
        for (const article of published) {
            const dTag = article.dTag ?? "";
            const status = article.hasTag('deleted') ? 'archived' : 'published';
            items[dTag] = { article, event: article, created_at: article.created_at, status };
        }

        // Add all the drafts (use the most recent version of each draft)
        for (const draftArticle of draftArticles) {
            const { dTag, article, draft, created_at, category, counterparty } = draftArticle;
            
            // Map category to status for display
            let status = 'draft';
            if (category === 'incoming_proposal') {
                status = 'incoming_proposal';
            } else if (category === 'outgoing_proposal') {
                status = 'outgoing_proposal';
            }
            
            items[dTag] ??= { article, event: draft, created_at, status, counterparty };
            items[dTag].draft = draftArticle.draft;
            items[dTag].counterparty = counterparty;

            // check if the draft is newer than whatever is in the event
            if (items[dTag].event.created_at > created_at) {
                items[dTag].event = draft;
                items[dTag].created_at = created_at;
                items[dTag].status = status;
                items[dTag].counterparty = counterparty;
            }
        }

        // Add all the scheduled articles
        for (const scheduledPost of scheduledArticles) {
            const { dTag, article, schedule, created_at } = scheduledPost;
            items[dTag] ??= { article, event: schedule, created_at, status: 'scheduled' };
            items[dTag].schedule = schedule;

            // check if the schedule is newer than whatever is in the event
            if (items[dTag].event.created_at > created_at) {
                items[dTag].event = schedule;
                items[dTag].created_at = created_at;
                items[dTag].status = 'scheduled';
            }
        }


        return Object.values(items);
    }, [published, draftArticles, scheduledArticles]);
}
