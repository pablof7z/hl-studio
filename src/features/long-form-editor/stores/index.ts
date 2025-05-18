import { create } from 'zustand';
import { EditorStore, EditorState } from './types';
import { createEditorActions } from './actions';

// Initial state
const initialState: EditorState & { showConfirmation: boolean } = {
    content: '',
    title: '',
    summary: '',
    tags: [],
    publishedAt: null,
    zapSplits: [],
    isSettingsModalOpen: false,
    activeSettingsTab: 'metadata',
    showConfirmation: false,
};

// Create the store
export const useEditorStore = create<EditorStore & { showConfirmation: boolean; setShowConfirmation: (show: boolean) => void }>((set, get, store) => ({
    ...initialState,
    ...createEditorActions(set, get, store),
    setShowConfirmation: (show: boolean) => set({ showConfirmation: show }),
}));