import { create } from 'zustand';
import NDK, { Hexpubkey, NDKKind, NDKList, normalizeRelayUrl } from '@nostr-dev-kit/ndk';
import { GroupEntry } from '.';
import { useCallback, useMemo } from 'react';

type PinnedGroupStore = {
    pinnedGroups: Record<Hexpubkey, NDKList>;
};

type PinnedGroupActions = {
    // Fetch pinned groups for the specified pubkeys
    listPinnedGroups: (ndk: NDK, pubkeys: Hexpubkey[]) => Promise<void>;
};

export const usePinnedGroupsStore = create<PinnedGroupStore & PinnedGroupActions>((set, get) => ({
    pinnedGroups: {},

    listPinnedGroups: async (ndk: NDK, pubkeys: Hexpubkey[]) => {
        if (!ndk) throw new Error('NDK not initialized');

        ndk.subscribe([
            { kinds: [NDKKind.SimpleGroupList], authors: pubkeys },
        ], { closeOnEose: true }, {
            onEvent: (event) => {
                const currentList = get().pinnedGroups[event.pubkey];
                if (currentList?.created_at >= event.created_at) return;

                const list = NDKList.from(event);
                set((state) => ({
                    pinnedGroups: {
                        ...state.pinnedGroups,
                        [event.pubkey]: list,
                    }
                }));
            },
        });
    },
}));

export const usePinnedGroups = (pubkey: Hexpubkey | Hexpubkey[] | undefined) => {
    const pinnedGroups = usePinnedGroupsStore((state) => state.pinnedGroups);

    return useMemo(() => {
        if (!pinnedGroups || !pubkey) return [];
        
        const pubkeys = Array.isArray(pubkey) ? pubkey : [pubkey];
        const groups = new Set<GroupEntry>();

        for (const pubkey of pubkeys) {
            const list = pinnedGroups[pubkey];
            if (list) {
                for (const item of list.items) {
                    const groupId = item[1];
                    const relays = item.slice(2).map(normalizeRelayUrl);
                    const group = { groupId, relays };
                    groups.add(group);
                }
            }
        }

        return Array.from(groups);
    }, [pinnedGroups, pubkey]);
}