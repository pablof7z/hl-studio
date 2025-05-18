import { useCallback } from 'react';
import { ZapSplit } from '../stores/types';

export function useZapSplitValidation() {
    // Check if a user already exists in the zap splits
    const isDuplicateUser = useCallback((zapSplits: ZapSplit[], pubkey: string): boolean => {
        return zapSplits.some(split => split.user.pubkey === pubkey);
    }, []);

    // Validate a single split value (must be positive integer)
    const isValidSplit = useCallback((split: number): boolean => {
        return Number.isInteger(split) && split > 0;
    }, []);

    return {
        isDuplicateUser,
        isValidSplit,
    };
}