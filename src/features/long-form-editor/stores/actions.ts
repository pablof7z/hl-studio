import { StateCreator } from 'zustand';
import { EditorStore, EditorState, ZapSplit } from './types';
import { NDKArticle, NDKUser } from '@nostr-dev-kit/ndk-hooks';

export const createEditorActions: StateCreator<
    EditorStore,
    [],
    [],
    Omit<EditorStore, keyof EditorState>
> = (set, get) => ({
    // Content actions
    setContent: (content) => set({ content }),
    setTitle: (title) => set({ title }),
    setSummary: (summary) => set({ summary }),
    setTags: (tags) => set({ tags }),
    setPublishedAt: (date) => set({ publishedAt: date }),
    
    // Monetization actions
    addZapSplit: (user: NDKUser, split: number) => {
        const { zapSplits } = get();
        set({ zapSplits: [...zapSplits, { user, split }] });
    },

    removeZapSplit: (userPubkey: string) => {
        const { zapSplits } = get();
        set({ zapSplits: zapSplits.filter(split => split.user.pubkey !== userPubkey) });
    },

    updateZapSplit: (userPubkey: string, split: number) => {
        const { zapSplits } = get();
        const updatedSplits = zapSplits.map(s =>
            s.user.pubkey === userPubkey ? { ...s, split } : s
        );
        set({ zapSplits: updatedSplits });
    },
    
    // Publishing actions - these will be implemented in a separate hook
    publishArticle: () => {
        // This is a placeholder - actual implementation will be in useEditorPublish hook
        console.log('Publishing article with state:', get());
    },
    
    saveAsDraft: () => {
        // This is a placeholder - actual implementation will be in useEditorPublish hook
        console.log('Saving as draft with state:', get());
    },

    setImage: (img: string | null) => set({ image: img }),

    getEvents: (publishAt?: Date) => {
        const publisheTimestamp = publishAt ? Math.floor(publishAt.getTime() / 1000) : undefined;
        const { content, title, summary, tags, image, zapSplits } = get();
        const article = new NDKArticle(undefined);
        article.content = content;
        article.title = title;
        article.summary = summary;
        article.image = image ?? undefined;
        article.tags = tags.map(tag => ['t', tag]);
        if (publisheTimestamp) article.created_at = publisheTimestamp;
        article.published_at = publisheTimestamp;
        article.tags.push(
            ...zapSplits.map(split => ['zap', split.user.pubkey, split.split.toString()])
        )

        return [article];
    }
});