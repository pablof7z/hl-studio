import { useArticlesStore } from "../stores/articlesStore";

export function useArticles({ includeDeleted } = { includeDeleted: false }) {
    const published = useArticlesStore((state) => state.published);
    const drafts = useArticlesStore((state) => state.drafts);

    const publishedArticles = published.map((article) => {
        if (article.hasTag("deleted")) {
            if (includeDeleted) {
                article.status = "archived";
            } else {
                return null;
            }
        }
        
        article.status = "published";
        return article;
    }).filter(Boolean)
    const draftArticles = drafts.map((article) => {
        article.status = "draft";
        return article;
    });

    return [
        ...publishedArticles,
        ...draftArticles,
    ].sort((a, b) => {
        const aDate = a.created_at || 0;
        const bDate = b.created_at || 0;

        return bDate - aDate;
    });
}