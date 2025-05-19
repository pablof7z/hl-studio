import { NDKArticle, NDKUser } from '@nostr-dev-kit/ndk-hooks';

export type ZapSplit = {
    user: NDKUser;
    split: number; // integer, not a percentage
};

export interface EditorState {
    // Content state
    content: string;
    title: string;
    summary: string;
    
    // Metadata
    tags: string[];
    publishedAt: Date | null;
    image: string | null;
    
    // Monetization
    zapSplits: ZapSplit[];
}

export interface EditorActions {
    // Content actions
    setContent: (content: string) => void;
    setTitle: (title: string) => void;
    setSummary: (summary: string) => void;
    setTags: (tags: string[]) => void;
    setPublishedAt: (date: Date | null) => void;
    
    // Monetization actions
    addZapSplit: (user: NDKUser, split: number) => void;
    removeZapSplit: (userPubkey: string) => void;
    updateZapSplit: (userPubkey: string, split: number) => void;
    
    // Publishing actions
    publishArticle: () => void;
    saveAsDraft: () => void;
    setImage: (img: string | null) => void;

    getEvents: (publishAt?: Date) => NDKArticle[];
}

export type EditorStore = EditorState & EditorActions;