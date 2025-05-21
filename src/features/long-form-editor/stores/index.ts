import { create } from 'zustand';
import { createContentSlice, ContentSlice } from './slices/content';
import { createMetadataSlice, MetadataSlice } from './slices/metadata';
import { createZapsSlice, ZapsSlice } from './slices/zaps';
import { createEventSlice, EventSlice } from './slices/event';
import { createDraftSlice, DraftSlice } from './slices/draft';

export type EditorStore = ContentSlice &
    MetadataSlice &
    ZapsSlice &
    EventSlice &
    DraftSlice;

export const useEditorStore = create<EditorStore>((...args) => ({
    ...createContentSlice(...args),
    ...createMetadataSlice(...args),
    ...createZapsSlice(...args),
    ...createEventSlice(...args),
    ...createDraftSlice(...args),
}));
