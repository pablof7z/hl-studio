import { StateCreator } from 'zustand';
import { Hexpubkey, NDKUser } from '@nostr-dev-kit/ndk';

export interface ProposalSlice {
    isProposalMode: boolean;
    proposalCounterparty: NDKUser | null;
    author: NDKUser | null; // Added author field
    toggleProposalMode: (enabled: boolean) => void;
    setProposalCounterparty: (counterparty: NDKUser | null) => void;
    setAuthor: (author: NDKUser | null) => void; // Added setAuthor function
}

export const createProposalSlice: StateCreator<ProposalSlice, [], [], ProposalSlice> = (set, get) => ({
    isProposalMode: false,
    proposalCounterparty: null,
    author: null, // Initialize author
    toggleProposalMode: (enabled: boolean) => {
        const prevCounterparty = get().proposalCounterparty;
        console.debug('[proposalSlice] toggleProposalMode:', {
            enabled,
            isProposalMode: enabled,
            proposalCounterparty: enabled ? prevCounterparty : null,
        });
        set({
            isProposalMode: enabled,
            proposalCounterparty: enabled ? prevCounterparty : null,
        });
    },
    setProposalCounterparty: (counterparty: NDKUser | null) => {
        console.debug('[proposalSlice] setProposalCounterparty:', { counterparty });
        set({ proposalCounterparty: counterparty });
    },
    setAuthor: (author: NDKUser | null) => {
        console.debug('[proposalSlice] setAuthor:', { author });
        set({ author });
    },
});