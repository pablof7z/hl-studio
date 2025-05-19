import { create } from 'zustand';
import { EditorStore, EditorState } from './types';
import { createEditorActions } from './actions';

// Initial state
const initialState: EditorState = {
    content: '',
    title: '',
    summary: '',
    tags: [],
    publishedAt: null,
    zapSplits: [],
    image: null,
};

// Create the store
export const useEditorStore = create<EditorStore>((set, get, store) => ({
    ...initialState,
    ...createEditorActions(set, get, store),
}));