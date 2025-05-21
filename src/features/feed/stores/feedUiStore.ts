import { create } from 'zustand';

type FeedUiStore = {
    selectedArticleId: string | null;
    setSelectedArticleId: (id: string | null) => void;
};

export const useFeedUiStore = create<FeedUiStore>((set) => ({
    selectedArticleId: null,
    setSelectedArticleId: (id) => set({ selectedArticleId: id }),
}));
