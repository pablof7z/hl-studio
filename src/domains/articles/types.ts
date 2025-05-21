import { NDKArticle } from '@nostr-dev-kit/ndk';

export type NDKArticleWithStatus = NDKArticle & {
    status: 'published' | 'draft' | 'scheduled';
};
