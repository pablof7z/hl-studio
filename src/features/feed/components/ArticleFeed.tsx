import { useArticlesStore } from '@/domains/articles';
import React from 'react';
import { ArticleCard } from './ArticleCard';

export function ArticleFeed() {
    const articles = useArticlesStore((state) => state.articles);

    return (
        <ul className="article-feed space-y-2">
            {articles.map((article) => (
                <ArticleCard key={article.tagId()} article={article} />
            ))}
        </ul>
    );
}

export default ArticleFeed;
