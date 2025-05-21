import { create } from 'zustand';

export type SelectedAccount = { type: 'user'; id: string } | { type: 'publication'; id: string };

interface AccountStoreState {
    selectedAccount: SelectedAccount | null;
    setSelectedAccount: (account: SelectedAccount) => void;
}

export const useAccountStore = create<AccountStoreState>((set) => ({
    selectedAccount: null,
    setSelectedAccount: (account) => set({ selectedAccount: account }),
}));
