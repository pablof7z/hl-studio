import { create } from 'zustand';
import { createPublicationSlice, PublicationSlice } from './slices/publication';

export type PublicationEditorStore = PublicationSlice;

export const usePublicationEditorStore = create<PublicationEditorStore>((...args) => ({
    ...createPublicationSlice(...args),
}));