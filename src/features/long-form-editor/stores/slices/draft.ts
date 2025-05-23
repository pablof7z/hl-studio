import { StateCreator } from 'zustand';
import NDK, { NDKDraft } from '@nostr-dev-kit/ndk-hooks';

export interface DraftSlice {
    ndk: NDK | null;
    draft: NDKDraft | null;

    changesSinceLastSave: number;
    autosave: boolean;
    autosaveTimer: NodeJS.Timeout | null;

    init: (ndk: NDK) => void;

    setDraft: (draft: NDKDraft | null) => void;
    saveDraft: (manual: boolean) => Promise<void>;

    markChange: () => void;
}

export const createDraftSlice: StateCreator<any, [], [], DraftSlice> = (set, get) => ({
    draft: null,
    ndk: null,

    changesSinceLastSave: 0,
    autosave: true,
    autosaveTimer: null,

    init: (ndk: NDK) => set({ ndk }),
    
    setDraft: (draft: NDKDraft | null) => {
        console.debug('[draftSlice] setDraftId:', { draftId: draft?.id });
        set({ draft });
    },

    saveDraft: async (manual: boolean) => {
        const { ndk, draft, getEvent, autosaveTimer } = get();

        if (!ndk) throw new Error('NDK is not initialized');

        if (autosaveTimer) clearTimeout(autosaveTimer);
        
        const event = getEvent(ndk);
        const draftEvent = (draft ?? new NDKDraft(ndk)) as NDKDraft;

        if (!manual && !!draft) {
            // if this is an automatic save,
            // and we already have a draft, save as checkpoint
            draftEvent.checkpoint = draft;
            console.debug('[draftSlice] Saving draft as checkpoint');
        }

        draftEvent.event = event;

        draftEvent.save({ publish: true }).then((event) => {
            console.debug('[draftSlice] Draft saved:', { draftId: draftEvent.id });
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
    }
});