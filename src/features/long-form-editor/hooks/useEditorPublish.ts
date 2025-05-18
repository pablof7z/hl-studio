import { useCallback } from 'react';
import { useNDK } from '@nostr-dev-kit/ndk-hooks';
import { NDKEvent, NDKKind, NDKArticle } from '@nostr-dev-kit/ndk';
import { useEditorStore } from '../stores';

export function useEditorPublish() {
    const { ndk } = useNDK();
    const { 
        content, 
        title, 
        summary, 
        tags, 
        publishedAt, 
        zapSplits 
    } = useEditorStore();

    const publishArticle = useCallback(() => {
        if (!ndk) return null;

        // Create a new article
        const article = new NDKArticle(ndk);
        
        // Set content and metadata
        article.content = content;
        article.title = title;
        article.summary = summary;
        
        // Add tags
        if (tags.length > 0) {
            tags.forEach(tag => {
                article.tags.push(['t', tag]);
            });
        }
        
        // Add zap splits if any
        if (zapSplits.length > 0) {
            zapSplits.forEach(split => {
                article.tags.push(['zap', split.user.pubkey, '', split.split.toString()]);
            });
        }
        
        // Set published date if specified
        if (publishedAt) {
            article.tags.push(['published_at', Math.floor(publishedAt.getTime() / 1000).toString()]);
        }
        
        // Publish the article - no need to await since we use optimistic updates
        article.publish();
        
        return article;
    }, [ndk, content, title, summary, tags, zapSplits, publishedAt]);

    const saveAsDraft = useCallback(() => {
        if (!ndk) return null;
        
        // Create a draft article
        const article = new NDKArticle(ndk);
        
        // Set content and metadata
        article.content = content;
        article.title = title;
        article.summary = summary;
        
        // Add tags
        if (tags.length > 0) {
            tags.forEach(tag => {
                article.tags.push(['t', tag]);
            });
        }
        
        // Add draft tag
        article.tags.push(['status', 'draft']);
        
        // Add zap splits if any
        if (zapSplits.length > 0) {
            zapSplits.forEach(split => {
                article.tags.push(['zap', split.user.pubkey, '', split.split.toString()]);
            });
        }
        
        // Publish the draft - no need to await since we use optimistic updates
        article.publish();
        
        return article;
    }, [ndk, content, title, summary, tags, zapSplits]);

    return {
        publishArticle,
        saveAsDraft
    };
}