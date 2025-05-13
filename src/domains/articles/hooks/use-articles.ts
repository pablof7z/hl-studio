import { useArticlesStore } from "../stores/articlesStore";

export function useArticles() {
    const published = useArticlesStore((state) => state.published);
    const drafts = useArticlesStore((state) => state.drafts);

    const publishedArticles = published.map((article) => {
        article.status = "published";
        return article;
    });
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