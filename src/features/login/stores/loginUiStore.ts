import { AuthError, AuthMethod } from '@/domains/auth';
import { create } from 'zustand';

interface LoginUiState {
    activeMethod: AuthMethod | null;
    error: AuthError | null;
    setActiveMethod: (method: AuthMethod | null) => void;
    setError: (error: AuthError | null) => void;
}

export const useLoginUiStore = create<LoginUiState>((set) => ({
    activeMethod: null,
    error: null,
    setActiveMethod: (method) => {
        console.log('Setting active method:', method);
        set({ activeMethod: method });
    },
    setError: (error) => set({ error }),
}));
