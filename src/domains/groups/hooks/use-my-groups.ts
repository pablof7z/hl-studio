import { useNDK, useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks";
import { usePinnedGroups, usePinnedGroupsStore } from "../stores/pinned-groups";
import { useEffect, useMemo } from "react";
import { GroupEntry, useGroupStore } from "../stores";

export function useMyGroups() {
    const { ndk } = useNDK();
    const currentPubkey = useNDKCurrentPubkey();
    const myPinnedGroups = usePinnedGroups(currentPubkey);
    const groups = useGroupStore(s => s.groups);
    const fetchGroups = useGroupStore(s => s.fetchGroups);

    useEffect(() => {
        if (!ndk || !currentPubkey) return;

        const groupsToFetch: GroupEntry[] = [];
        
        for (const groupId in myPinnedGroups) {
            if (myPinnedGroups[groupId] && !groups[groupId]) {
                groupsToFetch.push(myPinnedGroups[groupId]);
            }
        }

        console.log('Groups to fetch:', groupsToFetch);
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

    console.log('current groups:', groups);

    return useMemo(() => {
        if (!currentPubkey || !myPinnedGroups) return [];
        console.log('My pinned groups:', Object.keys(groups));
        const ret = [];
        console.log('typeof myPinnedGroups:', typeof myPinnedGroups);
        myPinnedGroups.forEach((entry, index) => {
            console.log('\tGroup:', entry.groupId, index);
            if (groups[entry.groupId]) ret.push(groups[entry.groupId]);
            else console.log('\tGroup not found:', entry.groupId);
        });

        console.log('My groups ret:', ret);
        
        return ret;
    }, [myPinnedGroups, groups]);
}