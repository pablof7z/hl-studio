import NDK, { NDKArticle, NDKEvent, NDKEventId, NDKKind, NDKSubscription, wrapEvent } from '@nostr-dev-kit/ndk';
import { StateCreator } from 'zustand';
import { NDKSchedule } from '../../event/schedule';

export type ScheduleItem = {
    schedule: NDKSchedule;
    innerEvent: NDKEvent | NDKArticle;
}

export interface ScheduleSlice {
    ndk: NDK | null;
    sub: NDKSubscription | null;

    schedules: ScheduleItem[];
    deletedIds: Set<NDKEventId>;

    init: (ndk: NDK, currentPubkey: string) => void;

    deleteSchedule: (schedule: NDKEvent) => void;
}

export const createScheduleSlice: StateCreator<ScheduleSlice, [], [], ScheduleSlice> = (set, get) => ({
    ndk: null,
    sub: null,

    schedules: [],
    deletedIds: new Set(),

    init: (ndk: NDK, currentPubkey: string) => {
        const currentSub = get().sub;
        if (currentSub) currentSub.stop();
        
        // Get Schedules, schedule checkpoints, and deleted Schedules
        const sub = ndk.subscribe([
            { kinds: [NDKKind.DVMEventSchedule], authors: [currentPubkey] },
            { kinds: [NDKKind.DVMEventSchedule], "#p": [currentPubkey] },
            { kinds: [NDKKind.EventDeletion], "#k": [NDKKind.DVMEventSchedule.toString()], authors: [currentPubkey] },
        ], { wrap: true }, {
            onEvent: (event) => {
                const deletedIds = new Set(get().deletedIds);
                
                console.log('schedule event', event.kind, event.hasTag("deleted"));
                
                if (event.kind === NDKKind.EventDeletion) {
                    let schedules = [...get().schedules];
                    
                    for (const tag of event.tags) {
                        if (tag[0] === "e") {
                            deletedIds.add(tag[1]);
                            schedules = schedules.filter((d) => d.schedule.id !== tag[1]);
                        }
                    }

                    set({ deletedIds, schedules });
                    
                    return;
                }

                // make sure it's not deleted
                if (deletedIds.has(event.id)) {
                    console.log('skipping deleted schedule event', event.inspect);
                    return;
                }
                
                const schedule = event instanceof NDKSchedule ? event : NDKSchedule.from(event);

                schedule.getEvent().then(async (innerEvent: NDKEvent | null | undefined) => {
                    if (!innerEvent) {
                        console.error('schedule event does not have an inner event:', event.inspect);
                        return;
                    }

                    const schedules = [...get().schedules];

                    // make sure we don't already have this schedule ID
                    let alreadyHaveIt = false;
                    for (const s of schedules) {
                        if (s.schedule.id === schedule.id) {
                            alreadyHaveIt = true;
                            break;
                        }
                    }

                    if (!alreadyHaveIt) {
                        schedules.push({ schedule, innerEvent: await wrapEvent(innerEvent) });
                        schedules.sort((a, b) => {
                            if (a.schedule.created_at === b.schedule.created_at) return 0;
                            return b.schedule.created_at < a.schedule.created_at ? -1 : 1;
                        });
                        console.log('schedule event', event.inspect, { scheduleId: schedule.id }, schedules);
                        set({ schedules });
                    }
                });
            },
        });

        set({ ndk, sub });
    },

    /**
     * Deletes the schedule event
     */
    deleteSchedule: async (schedule: NDKEvent) => {
        const { ndk, schedules } = get();
        if (!ndk) throw new Error("NDK not initialized");

        const deletedIds = new Set(get().deletedIds);

        // add the deleted
        deletedIds.add(schedule.id);

        set({
            deletedIds,
            schedules: schedules.filter((s) => s.schedule.id !== schedule.id),
        });

        schedule.delete();
    }
});