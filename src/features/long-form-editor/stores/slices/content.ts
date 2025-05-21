import { StateCreator } from 'zustand';

export interface ContentSlice {
    content: string;
    setContent: (content: string) => void;
}

export const createContentSlice: StateCreator<any, [], [], ContentSlice> = (set, get) => ({
    content: '',

    setContent: (content: string) => {
        const { markChange } = get();
        set({ content });
        setTimeout(markChange, 0);
    },
});