import { NDKUser } from '@nostr-dev-kit/ndk';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as contentActions from './actions/contentActions';
import * as proposalActions from './actions/proposalActions';
import * as uiActions from './actions/uiActions';
import { useEditorStore } from './index.js';

describe('editorStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useEditorStore.setState({
            content: '',
            draftId: null,
            isDirty: false,
            isProposalMode: false,
            isHistoryModalOpen: false,
            proposalRecipient: null,
        });
    });

    it('setContent updates content and sets isDirty', () => {
        contentActions.setContent('Hello world');
        const state = useEditorStore.getState();
        expect(state.content).toBe('Hello world');
        expect(state.isDirty).toBe(true);
    });

    it('setDraftId updates draftId', () => {
        contentActions.setDraftId('draft-123');
        const state = useEditorStore.getState();
        expect(state.draftId).toBe('draft-123');
    });

    it('markAsSaved sets isDirty to false', () => {
        useEditorStore.setState({ isDirty: true });
        contentActions.markAsSaved();
        const state = useEditorStore.getState();
        expect(state.isDirty).toBe(false);
    });

    it('toggleProposalMode enables and disables proposal mode, clears recipient when disabling', () => {
        // Enable with recipient
        const fakeUser = { pubkey: 'abc' } as NDKUser;
        useEditorStore.setState({ proposalRecipient: fakeUser });
        proposalActions.toggleProposalMode(true);
        let state = useEditorStore.getState();
        expect(state.isProposalMode).toBe(true);
        expect(state.proposalRecipient).toBe(fakeUser);

        // Disable, should clear recipient
        proposalActions.toggleProposalMode(false);
        state = useEditorStore.getState();
        expect(state.isProposalMode).toBe(false);
        expect(state.proposalRecipient).toBeNull();
    });

    it('setProposalRecipient updates proposalRecipient', () => {
        const fakeUser = { pubkey: 'xyz' } as NDKUser;
        proposalActions.setProposalRecipient(fakeUser);
        const state = useEditorStore.getState();
        expect(state.proposalRecipient).toBe(fakeUser);
    });

    it('toggleHistoryModal toggles isHistoryModalOpen', () => {
        uiActions.toggleHistoryModal(true);
        let state = useEditorStore.getState();
        expect(state.isHistoryModalOpen).toBe(true);

        uiActions.toggleHistoryModal(false);
        state = useEditorStore.getState();
        expect(state.isHistoryModalOpen).toBe(false);
    });
});
