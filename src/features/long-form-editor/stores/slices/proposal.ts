import { StateCreator } from 'zustand';
import { NDKUser } from '@nostr-dev-kit/ndk';

export interface ProposalSlice {
    isProposalMode: boolean;
    proposalRecipient: NDKUser | null;
    toggleProposalMode: (enabled: boolean) => void;
    setProposalRecipient: (recipient: NDKUser | null) => void;
}

export const createProposalSlice: StateCreator<ProposalSlice, [], [], ProposalSlice> = (set, get) => ({
    isProposalMode: false,
    proposalRecipient: null,
    toggleProposalMode: (enabled: boolean) => {
        const prevRecipient = get().proposalRecipient;
        console.debug('[proposalSlice] toggleProposalMode:', {
            enabled,
            isProposalMode: enabled,
            proposalRecipient: enabled ? prevRecipient : null,
        });
        set({
            isProposalMode: enabled,
            proposalRecipient: enabled ? prevRecipient : null,
        });
    },
    setProposalRecipient: (recipient: NDKUser | null) => {
        console.debug('[proposalSlice] setProposalRecipient:', { recipient });
        set({ proposalRecipient: recipient });
    },
});