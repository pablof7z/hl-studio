import { useLoginUiStore } from "../stores/loginUiStore";

/**
 * Hook to access and control login UI state.
 */
export function useLoginUi() {
    const activeMethod = useLoginUiStore((s) => s.activeMethod);
    const error = useLoginUiStore((s) => s.error);
    const setActiveMethod = useLoginUiStore((s) => s.setActiveMethod);
    const setError = useLoginUiStore((s) => s.setError);

    return {
        activeMethod,
        error,
        setActiveMethod,
        setError,
    };
}