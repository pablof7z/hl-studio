import { useProfileValue } from '@/domains/profiles/hooks/useProfileValue';
import React from 'react';

type Article = {
    tagId: () => string;
    pubkey: string;
    content: string;
    created_at: number;
    // Add other fields as needed
};

type ArticleCardProps = {
    article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
    const profile = useProfileValue({ pubkey: article.pubkey });

    return (
        <li className="article-card p-4 bg-white rounded shadow mb-2">
            <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{profile?.displayName || article.pubkey.slice(0, 8)}</span>
                <span className="text-xs text-gray-400">{new Date(article.created_at * 1000).toLocaleString()}</span>
            </div>
            <div className="text-gray-800">{article.content}</div>
        </li>
    );
}

export default ArticleCard;
