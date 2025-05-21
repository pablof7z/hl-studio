import NDK, { NDKEvent, NDKFilter, NDKRelay, NDKSimpleGroupMetadata } from '@nostr-dev-kit/ndk';
import { create, StateCreator } from 'zustand';
import { GroupId } from '../types';

type GroupFetchOpts = {
    // Whether to fetch kind:39000 (group metadata)
    metadata?: boolean;

    // Whether to fetch kind:39001 (group admins)
    admins?: boolean;

    // Whether to fetch kind:39002 (group members)
    members?: boolean;

    // Close subscription after we receive the data?
    closeOnEose?: boolean;
};

const DEFAULT_GROUP_FETCH_OPTS: GroupFetchOpts = {
    metadata: true,
    admins: true,
    members: true,
};

export type GroupEntry = {
    groupId: GroupId;
    relays: string[];
};

type GroupEntryWithMetadata = GroupEntry & {
    metadata?: NDKSimpleGroupMetadata;
};

type GroupStoreProperties = {
    groups: Record<GroupId, GroupEntryWithMetadata>;
};

type GroupActions = {
    // Fetch groups from the specified relays
    listGroups: (ndk: NDK, relays: string[], opts: GroupFetchOpts) => Promise<void>;

    // Fetch a specific set of groups from the specified relays
    fetchGroups: (ndk: NDK, groupEntries: GroupEntry[], opts: GroupFetchOpts) => Promise<void>;
};

type GroupStore = GroupStoreProperties & GroupActions;

function filterFromOptions(opts: GroupFetchOpts): NDKFilter {
    const filter: NDKFilter = { kinds: [] };
    if (opts.metadata) filter.kinds!.push(39000);
    if (opts.admins) filter.kinds!.push(39001);
    if (opts.members) filter.kinds!.push(39002);
    if (filter.kinds!.length === 0) throw new Error('No kinds specified for group fetch');
    return filter;
}

export const useGroupStore = create<GroupStore>((set) => ({
    groups: {},

    listGroups: async (ndk: NDK, relays: string[], opts: GroupFetchOpts = DEFAULT_GROUP_FETCH_OPTS) => {
        if (!ndk) throw new Error('NDK not initialized');

        const filter = filterFromOptions(opts);

        ndk.subscribe(
            [filter],
            { relayUrls: relays, wrap: true, closeOnEose: opts.closeOnEose },
            {
                onEvent: (event, relay?: NDKRelay) => {
                    const groupId = event.dTag;
                    if (!groupId) return;
                    if (!relay) throw new Error('Relay not specified');

                    if (event.kind === 39000) {
                        const metadata = NDKSimpleGroupMetadata.from(event);
                        const currentEntry = useGroupStore.getState().groups[groupId] || {
                            groupId,
                            relays: [relay.url],
                        };

                        set((state) => ({
                            groups: { ...state.groups, [groupId]: { ...currentEntry, metadata } },
                        }));
                    }
                },
            }
        );
    },

    fetchGroups: async (ndk: NDK, groupEntries: GroupEntry[], opts: GroupFetchOpts = DEFAULT_GROUP_FETCH_OPTS) => {
        const filter = filterFromOptions(opts);
        filter['#d'] = groupEntries.map((entry) => entry.groupId);
        const relayUrls = groupEntries.map((entry) => entry.relays).flat();

        console.log('Fetching groups:', filter);

        ndk.subscribe(
            [filter],
            { relayUrls, wrap: true, closeOnEose: opts.closeOnEose },
            {
                onEvent: (event, relay?: NDKRelay) => {
                    console.log(`Received group event ${event.kind} from relay ${relay?.url} for group ${event.dTag}`);
                    switch (event.kind) {
                        case 39000:
                            return updateMetadata(set, event, relay);
                    }
                },
            }
        );
    },
}));

function updateMetadata(set: Parameters<StateCreator<GroupStore>>[0], event: NDKEvent, relay?: NDKRelay) {
    const groupId = event.dTag;
    if (!groupId) return;
    if (!relay) throw new Error('Relay not specified');

    const metadata = NDKSimpleGroupMetadata.from(event);

    set((state) => {
        const prev = state.groups[groupId] ?? { groupId, relays: [] };
        if (prev?.metadata?.id === metadata.id) return {};

        console.log(
            'WIll set group:',
            groupId,
            'named:',
            metadata.name,
            'right now we have a total of ',
            state.groups,
            'groups'
        );

        return {
            groups: {
                ...state.groups,
                [groupId]: {
                    ...prev,
                    relays: [...new Set([...prev.relays, relay.url])],
                    metadata,
                },
            },
        };
    });
}
