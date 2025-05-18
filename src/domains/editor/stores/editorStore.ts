import { create } from 'zustand';

interface EditorStore {
    showConfirmation: boolean;
    isScheduled: boolean;
    isEarlyAccess: boolean;
    setShowConfirmation: (show: boolean) => void;
    setIsScheduled: (scheduled: boolean) => void;
    setIsEarlyAccess: (earlyAccess: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    showConfirmation: false,
    isScheduled: false,
    isEarlyAccess: false,
    setShowConfirmation: (show) => set({ showConfirmation: show }),
    setIsScheduled: (scheduled) => set({ isScheduled: scheduled }),
    setIsEarlyAccess: (earlyAccess) => set({ isEarlyAccess: earlyAccess }),
}));