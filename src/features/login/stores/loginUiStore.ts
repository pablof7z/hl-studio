import { create } from "zustand";
import { AuthMethod, AuthError } from "@/domains/auth";

interface LoginUiState {
    activeMethod: AuthMethod | null;
    error: AuthError | null;
    setActiveMethod: (method: AuthMethod | null) => void;
    setError: (error: AuthError | null) => void;
}

export const useLoginUiStore = create<LoginUiState>((set) => ({
    activeMethod: null,
    error: null,
    setActiveMethod: (method) => set({ activeMethod: method }),
    setError: (error) => set({ error }),
}));