import { StateCreator } from 'zustand';
import type { NDKUser } from '@nostr-dev-kit/ndk-hooks';

export interface ZapSplit {
    user: NDKUser;
    split: number;
}

export interface ZapsSlice {
    zapSplits: ZapSplit[];
    addZapSplit: (user: NDKUser, split: number) => void;
    removeZapSplit: (userPubkey: string) => void;
    updateZapSplit: (userPubkey: string, split: number) => void;
}

export const createZapsSlice: StateCreator<ZapsSlice, [], [], ZapsSlice> = (set, get) => ({
    zapSplits: [],
    addZapSplit: (user: NDKUser, split: number) => {
        const { zapSplits } = get();
        set({ zapSplits: [...zapSplits, { user, split }] });
    },
    removeZapSplit: (userPubkey: string) => {
        const { zapSplits } = get();
        set({ zapSplits: zapSplits.filter((split) => split.user.pubkey !== userPubkey) });
    },
    updateZapSplit: (userPubkey: string, split: number) => {
        const { zapSplits } = get();
        const updatedSplits = zapSplits.map((s) =>
            s.user.pubkey === userPubkey ? { ...s, split } : s
        );
        set({ zapSplits: updatedSplits });
    },
});