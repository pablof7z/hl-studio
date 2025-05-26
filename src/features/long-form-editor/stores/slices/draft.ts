import NDK, { NDKDraft, NDKUser } from '@nostr-dev-kit/ndk-hooks';
import type { StateCreator } from 'zustand';

export interface DraftSlice {
    ndk: NDK | null;
    draft: NDKDraft | null;
    author: NDKUser | null;
    proposalCounterparty: NDKUser | null;

    changesSinceLastSave: number;
    autosave: boolean;
    autosaveTimer: NodeJS.Timeout | null;

    init: (ndk: NDK) => void;

    setDraft: (draft: NDKDraft | null) => void;
    saveDraft: (manual: boolean, allowProposal?: boolean) => Promise<void>;

    setAuthor: (author: NDKUser | null) => void;
    clearAuthor: () => void;
    setProposalCounterparty: (counterparty: NDKUser) => void;
    clearProposalCounterparty: () => void;

    markChange: () => void;
}

export const createDraftSlice: StateCreator<any, [], [], DraftSlice> = (set, get) => ({
    draft: null,
    ndk: null,
    author: null,
    proposalCounterparty: null,

    changesSinceLastSave: 0,
    autosave: true,
    autosaveTimer: null,

    init: (ndk: NDK) => set({ ndk }),
    
    setDraft: (draft: NDKDraft | null) => {
        console.debug('[draftSlice] setDraftId:', { draftId: draft?.id });
        set({ draft });
    },

    saveDraft: async (manual: boolean, forceProposal?: boolean) => {
        const { ndk, draft, getEvent, autosaveTimer, author, counterparty } = get();

        if (!ndk) throw new Error('NDK is not initialized');

        if (autosaveTimer) clearTimeout(autosaveTimer);
        
        const event = getEvent(ndk);
        const draftEvent = (draft ?? new NDKDraft(ndk)) as NDKDraft;

        if (!manual && !!draft) {
            // if this is an automatic save,
            // and we already have a draft, save as checkpoint
            // Note: Using any type assertion as checkpoint might be a custom property
            draftEvent.checkpoint = draft;
            console.debug('[draftSlice] Saving draft as checkpoint');
        }

        draftEvent.event = event;

        const setCounterparty = forceProposal || draftEvent.hasTag('p');

        console.log('[draftSlice] Saving draft:', {
            forceProposal,
            author: author?.pubkey,
        })
        if (setCounterparty && author) draftEvent.counterparty = author;

        draftEvent.save({ publish: true }).then(() => {
            console.debug('[draftSlice] Draft saved:', { draftId: draftEvent.id });
            draftEvent.dump();
            set({ draft: draftEvent, changesSinceLastSave: 0 });
        });
    },

    markChange: () => {
        const { saveDraft, changesSinceLastSave, autosave, autosaveTimer } = get();
        
        if (autosave) {
            if (autosaveTimer) clearTimeout(autosaveTimer);

            const newTimer = setTimeout(() => {
                saveDraft(false);
            }, 4000);

            set({
                changesSinceLastSave: changesSinceLastSave + 1,
                autosaveTimer: newTimer,
            })
        }
    },

    setAuthor: (author: NDKUser | null) => {
        set({ author });
    },

    clearAuthor: () => {
        set({ author: null });
    },

    setProposalCounterparty: (counterparty: NDKUser) => {
        set({ proposalCounterparty: counterparty });
        // In proposal mode, the counterparty becomes the author
        set({ author: counterparty });
    },

    clearProposalCounterparty: () => {
        set({ proposalCounterparty: null, author: null });
    }
});