import { StateCreator } from 'zustand';
import { EditorStore, EditorState, ZapSplit } from './types';
import { NDKUser } from '@nostr-dev-kit/ndk';

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
    
    // UI actions
    openSettingsModal: (tab) => set({ 
        isSettingsModalOpen: true, 
        activeSettingsTab: tab || get().activeSettingsTab 
    }),
    
    closeSettingsModal: () => set({ isSettingsModalOpen: false }),
    
    setActiveSettingsTab: (tab) => set({ activeSettingsTab: tab }),
    
    // Publishing actions - these will be implemented in a separate hook
    publishArticle: () => {
        // This is a placeholder - actual implementation will be in useEditorPublish hook
        console.log('Publishing article with state:', get());
    },
    
    saveAsDraft: () => {
        // This is a placeholder - actual implementation will be in useEditorPublish hook
        console.log('Saving as draft with state:', get());
    }
});