import { NDKArticle } from "@nostr-dev-kit/ndk-hooks";
import { useArticlesStore } from "../stores/articlesStore";
import { useAPI } from "@/domains/api/hooks/useAPI";
import { PostStatusEnum } from "@/domains/api/schemas";

type ArticleWithStatus = {
    article: NDKArticle;
    status: string;
}

/**
 * useArticles hook
 * - Returns merged list of published, draft, and scheduled (API) articles.
 * - Each article is extended with a `status` property: "published" | "draft" | "scheduled" | "archived"
 * - Sorted by created_at descending (newest first)
 * - Offline-first: no loading flags, hydrates as data arrives
 */
export function useArticles({ includeDeleted } = { includeDeleted: false }): ArticleWithStatus[] {
    const published = useArticlesStore((state) => state.published);
    const drafts = useArticlesStore((state) => state.drafts);

    // Fetch scheduled posts from API
    const api = useAPI();
    const {data: scheduledPosts} = api.getPosts();

    console.log("scheduledPosts", scheduledPosts);

    // Published articles
    const publishedArticles = [];
    for (const article of published) {
        const deleted = article.hasTag("deleted");
        if (includeDeleted && deleted) {
            publishedArticles.push({ article, status: "archived" });
        } else if (!deleted) {
            publishedArticles.push({ article, status: "published" });
        }
    }

    // Draft articles
    const draftArticles = drafts.map((article) => ({ article, status: "draft" }));

    // Scheduled articles from API
    const scheduledArticles =
        Array.isArray(scheduledPosts)
            ? scheduledPosts.map((post) => {
                console.log("scheduled post", post?.event?.inspect);
                return { article: post.event, status: "scheduled" };
            })
            : [];

    // Merge and sort all articles by created_at descending
    return [...publishedArticles, ...draftArticles, ...scheduledArticles].sort(
        (a, b) => {
            const aDate = a.created_at || a.scheduledAt || 0;
            const bDate = b.created_at || b.scheduledAt || 0;
            return bDate - aDate;
        }
    );
}