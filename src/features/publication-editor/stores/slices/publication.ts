import { StateCreator } from 'zustand';
import NDKBlossom from '@nostr-dev-kit/ndk-blossom';
import { NDK } from '@nostr-dev-kit/ndk-hooks';

export interface PublicationSlice {
    // State
    step: number;
    title: string;
    about: string;
    image: string;
    banner: string;
    category: string;
    hashtags: string[];
    authors: string[];

    // Actions
    setStep: (step: number) => void;
    updateField: <K extends keyof Omit<PublicationSlice, 'setStep' | 'updateField' | 'addAuthor' | 'removeAuthor' | 'uploadImage' | 'reset'>>(
        field: K, 
        value: PublicationSlice[K]
    ) => void;
    addAuthor: (pubkey: string) => void;
    removeAuthor: (pubkey: string) => void;
    uploadImage: (field: 'banner' | 'image', file: File, ndk: NDK) => Promise<void>;
    reset: () => void;
}

const initialState = {
    step: 1,
    title: '',
    about: '',
    image: '',
    banner: '',
    category: '',
    hashtags: [],
    authors: [],
};

export const createPublicationSlice: StateCreator<PublicationSlice> = (set, get) => ({
    ...initialState,

    setStep: (step) => set({ step }),

    updateField: (field, value) => set({ [field]: value }),

    addAuthor: (pubkey) => {
        const { authors } = get();
        if (!authors.includes(pubkey)) {
            set({ authors: [...authors, pubkey] });
        }
    },

    removeAuthor: (pubkey) => {
        const { authors } = get();
        set({ authors: authors.filter(p => p !== pubkey) });
    },

    uploadImage: async (field, file, ndk) => {
        if (!ndk || !file) return;

        const blossom = new NDKBlossom(ndk as any);
        
        // Show preview immediately
        const reader = new FileReader();
        reader.onload = () => {
            set({ [field]: reader.result as string });
        };
        reader.readAsDataURL(file);
        
        try {
            const imeta = await blossom.upload(file, { maxRetries: 3, server: 'https://nostr.download' });
            if (imeta?.url) {
                if (field === '')
                set({ [field]: imeta.url });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // Keep the preview image if upload fails
        }
    },

    reset: () => set(initialState),
});