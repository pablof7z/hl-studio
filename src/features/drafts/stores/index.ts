import { create } from "zustand";
import { createDraftSlice, DraftSlice } from "./slices/drafts";

type DraftStore = DraftSlice;

export const useDraftStore = create<DraftStore>((...args) => ({
    ...createDraftSlice(...args)
}));