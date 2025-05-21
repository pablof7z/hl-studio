import { useArticles } from '@/domains/articles';
import { useMemo } from 'react';

/**
 * Composes domain hooks to provide dashboard data.
 * No loading flags, offline-first.
 */
export function useDashboardData() {
    const articles = useArticles();

    // Example stats: total articles, total authors
    const stats = useMemo(
        () => [
            {
                label: 'Articles',
                value: articles.length,
            },
            {
                label: 'Authors',
                value: new Set(articles.map((a) => a.pubkey)).size,
            },
        ],
        [articles]
    );

    // Example: subscriber growth (stub)
    const subscriberGrowth = useMemo(
        () =>
            Array.from({ length: 12 }).map((_, i) => ({
                date: `2025-${(i + 1).toString().padStart(2, '0')}`,
                value: Math.floor(Math.random() * 100 + 100),
            })),
        []
    );

    return {
        stats,
        articles,
        subscriberGrowth,
    };
}
