import { StateCreator } from 'zustand';
import type { NDKDraft, NDKTag } from '@nostr-dev-kit/ndk-hooks';

export interface MetadataSlice {
    title: string;
    summary: string;
    tags: NDKTag[];
    image: string | null;
    publishedAt: Date | null;
    setTitle: (title: string) => void;
    setSummary: (summary: string) => void;
    setTags: (tags: NDKTag[]) => void;
    addTag: (tag: NDKTag | string) => void;
    setImage: (img: string | null) => void;
    setPublishedAt: (date: Date | null) => void;
}

export const createMetadataSlice: StateCreator<MetadataSlice, [], [], MetadataSlice> = (set, get) => ({
    title: '',
    summary: '',
    tags: [],
    image: null,
    publishedAt: null,
    setTitle: (title: string) => {
        console.log('Setting title:', title);
        set({ title });
    },
    setSummary: (summary: string) => {
        set({ summary });
    },
    setTags: (tags: NDKTag[]) => {
        set({ tags });
    },
    addTag: (tag: NDKTag | string) => {
        const { tags } = get();
        const newTag: NDKTag = typeof tag === 'string' ? ['t', tag] : tag;
        set({ tags: [...tags, newTag] });
    },
    setImage: (img: string | null) => {
        set({ image: img });
    },
    setPublishedAt: (date: Date | null) => {
        set({ publishedAt: date });
    }
});