import { NDKUser } from '@nostr-dev-kit/ndk';

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
    
    // Monetization
    zapSplits: ZapSplit[];
    
    // UI state
    isSettingsModalOpen: boolean;
    activeSettingsTab: 'metadata' | 'monetization';
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
    
    // UI actions
    openSettingsModal: (tab?: 'metadata' | 'monetization') => void;
    closeSettingsModal: () => void;
    setActiveSettingsTab: (tab: 'metadata' | 'monetization') => void;
    
    // Publishing actions
    publishArticle: () => void;
    saveAsDraft: () => void;
}

export type EditorStore = EditorState & EditorActions;