import { create } from "zustand";
import { createScheduleSlice, ScheduleSlice } from "./slices/schedules";

type ScheduleStore = ScheduleSlice;

export const useScheduleStore = create<ScheduleStore>((...args) => ({
    ...createScheduleSlice(...args)
}));