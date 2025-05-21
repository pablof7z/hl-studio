import type { ContentSlice } from './slices/content';
import type { MetadataSlice } from './slices/metadata';
import type { ZapsSlice } from './slices/zaps';
import type { EventSlice } from './slices/event';
import { DraftSlice } from './slices/draft';
import { ProposalSlice } from './slices/proposal';

// EditorState is the intersection of all slice types used in the editor store
export type EditorState =
    & ContentSlice
    & MetadataSlice
    & ZapsSlice
    & EventSlice
    & DraftSlice
    & ProposalSlice;