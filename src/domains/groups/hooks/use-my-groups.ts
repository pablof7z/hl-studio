import { useNDK, useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import { useEffect, useMemo } from 'react';
import { GroupEntry, useGroupStore } from '../stores';
import { usePinnedGroups, usePinnedGroupsStore } from '../stores/pinned-groups';

export function useMyGroups() {
    const { ndk } = useNDK();
    const currentPubkey = useNDKCurrentPubkey();
    const myPinnedGroups = usePinnedGroups(currentPubkey);
    const groups = useGroupStore((s) => s.groups);
    const fetchGroups = useGroupStore((s) => s.fetchGroups);

    useEffect(() => {
        if (!ndk || !currentPubkey) return;

        const groupsToFetch: GroupEntry[] = [];

        for (const groupId in myPinnedGroups) {
            if (myPinnedGroups[groupId] && !groups[groupId]) {
                groupsToFetch.push(myPinnedGroups[groupId]);
            }
        }

        if (groupsToFetch.length > 0) {
            // Fetch the groups from the relays
            fetchGroups(ndk, groupsToFetch, {
                metadata: true,
                admins: false,
                members: false,
                closeOnEose: true,
            });
        }
    }, [myPinnedGroups?.length, groups]);

    return useMemo(() => {
        if (!currentPubkey || !myPinnedGroups) return [];
        const ret = [];
        myPinnedGroups.forEach((entry, index) => {
            if (groups[entry.groupId]) ret.push(groups[entry.groupId]);
        });

        return ret;
    }, [myPinnedGroups, groups]);
}
