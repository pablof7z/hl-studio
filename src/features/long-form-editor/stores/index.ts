import { create } from 'zustand';
import { createContentSlice, ContentSlice } from './slices/content';
import { createMetadataSlice, MetadataSlice } from './slices/metadata';
import { createZapsSlice, ZapsSlice } from './slices/zaps';
import { createEventSlice, EventSlice } from './slices/event';
import { createDraftSlice, DraftSlice } from './slices/draft';
import { createProposalSlice, ProposalSlice } from './slices/proposal';

export type EditorStore = ContentSlice &
    MetadataSlice &
    ZapsSlice &
    EventSlice &
    DraftSlice &
    ProposalSlice;

export const useEditorStore = create<EditorStore>((...args) => ({
    ...createContentSlice(...args),
    ...createMetadataSlice(...args),
    ...createZapsSlice(...args),
    ...createEventSlice(...args),
    ...createDraftSlice(...args),
    ...createProposalSlice(...args),
}));
