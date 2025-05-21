import { useAPI } from '@/domains/api/hooks/useAPI';
import { NDKArticle, NDKEvent, NDKKind } from '@nostr-dev-kit/ndk-hooks';
import { useArticlesStore } from '../stores/articlesStore';
import { useDraftStore } from '@/features/drafts/stores';
import { useMemo } from 'react';

type ArticleWithStatus = {
    article: NDKArticle;
    event: NDKEvent;
    created_at: number;
    status: string;
};

/**
 * useArticles hook
 * - Returns merged list of published, draft, and scheduled (API) articles.
 * - Each article is extended with a `status` property: "published" | "draft" | "scheduled" | "archived"
 * - Sorted by created_at descending (newest first)
 * - Offline-first: no loading flags, hydrates as data arrives
 */
export function useArticles({ includeDeleted } = { includeDeleted: false }): ArticleWithStatus[] {
    const published = useArticlesStore((state) => state.published);
    const drafts = useDraftStore((state) => state.items);
    console.log('[useArticles] drafts', Object.keys(drafts).length);
    const draftArticles = useMemo(() => {
        return Object.values(drafts)
            .map((versions) => versions[0])
            .filter((item) => !item.draft.hasTag("deleted"))
            .filter((item) => item.innerEvent.kind === NDKKind.Article)
            .map(({ innerEvent, draft }) => (
                { article: innerEvent, event: draft, created_at: draft.created_at, status: 'draft' }
            ));
    }, [drafts]);

    // Fetch scheduled posts from API
    const api = useAPI();
    const { data: scheduledPosts } = api.getPosts();

    // Published articles
    const publishedArticles: ArticleWithStatus[] = [];
    for (const article of published) {
        const deleted = article.hasTag('deleted');
        if (includeDeleted && deleted) {
            publishedArticles.push({ article, event: article, created_at: article.created_at, status: 'archived' });
        } else if (!deleted) {
            publishedArticles.push({ article, event: article, created_at: article.created_at, status: 'published' });
        }
    }

    // Scheduled articles from API
    // const scheduledArticles = Array.isArray(scheduledPosts)
    //     ? scheduledPosts.map((post) => {
    //           console.log('scheduled post', post?.event?.inspect);
    //           return { article: post.event, status: 'scheduled' };
    //       })
    //     : [];

    // Merge and sort all articles by created_at descending
    return [...publishedArticles, ...draftArticles].sort((a, b) => {
        const aDate = a.created_at || a.scheduledAt || 0;
        const bDate = b.created_at || b.scheduledAt || 0;
        return bDate - aDate;
    });
}
