import { create } from 'zustand';

type DashboardStore = {
    selectedStat: string | null;
    setSelectedStat: (stat: string | null) => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
    selectedStat: null,
    setSelectedStat: (stat) => set({ selectedStat: stat }),
}));
