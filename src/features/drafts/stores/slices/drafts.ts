import NDK, { NDKArticle, NDKDraft, NDKEvent, NDKEventId, NDKKind, NDKSubscription, wrapEvent } from '@nostr-dev-kit/ndk';
import { StateCreator } from 'zustand';

export type DraftCategory = "draft" | "incoming_proposal" | "outgoing_proposal";

export type DraftItem = {
    draft: NDKDraft;
    innerEvent: NDKEvent | NDKArticle;
    category: DraftCategory;
    counterparty?: string; // pubkey of the other party in proposals
}

export interface DraftSlice {
    ndk: NDK | null;
    sub: NDKSubscription | null;

    items: Record<string, DraftItem[]>;

    deletedIds: Set<NDKEventId>;

    init: (ndk: NDK, currentPubkey: string) => void;

    deleteDraft: (draft: NDKEvent) => void;

    // Helper methods for proposals
    categorizeDraft: (draft: NDKDraft, currentPubkey: string) => DraftCategory;
    getCounterparty: (draft: NDKDraft, currentPubkey: string) => string | undefined;
}

export const createDraftSlice: StateCreator<DraftSlice, [], [], DraftSlice> = (set, get) => ({
    ndk: null,
    sub: null,
    items: {},

    deletedIds: new Set(),

    init: (ndk: NDK, currentPubkey: string) => {
        const currentSub = get().sub;
        if (currentSub) currentSub.stop();
        
        // Get drafts, draft checkpoints, deleted drafts, and incoming proposals
        const sub = ndk.subscribe([
            { kinds: [NDKKind.Draft], "#k": [NDKKind.Article.toString()], authors: [currentPubkey] },
            { kinds: [NDKKind.Draft], "#k": [NDKKind.Article.toString()], "#p": [currentPubkey] },
            { kinds: [NDKKind.DraftCheckpoint], authors: [currentPubkey] },
            { kinds: [NDKKind.EventDeletion], "#k": [NDKKind.DraftCheckpoint.toString()], authors: [currentPubkey] },
        ], { wrap: true }, {
            onEvent: (event) => {
                console.log('Draft event', event.kind, event.hasTag("deleted"));
                
                if (event.kind === NDKKind.EventDeletion) {
                    const deletedIds = new Set(get().deletedIds);
                    const items = {...get().items};
                    
                    for (const tag of event.tags) {
                        if (tag[0] === "e") deletedIds.add(tag[1]);
                    }

                    // remove any draft that matches the deleted ID
                    for (const draftId of Object.keys(items)) {
                        items[draftId] = items[draftId].filter((d) => !deletedIds.has(d.draft.id));
                        if (items[draftId].length === 0) delete items[draftId];
                    }

                    set({ deletedIds, items });
                    
                    return;
                }
                
                const draft = event instanceof NDKDraft ? event : NDKDraft.from(event);

                if (draft.hasTag("deleted")) return;

                draft.getEvent().then(async (innerEvent: NDKEvent | null | undefined) => {
                    if (!innerEvent) {
                        console.error('Draft event does not have an inner event:', event.inspect);
                        return;
                    }

                    let draftId: string | undefined;
                    if (event.kind === NDKKind.Draft) draftId = event.dTag;
                    else if (event.kind === NDKKind.DraftCheckpoint) {
                        const aTag = event.tagValue("a");
                        draftId = aTag?.split(":")[2];
                        console.log('Draft checkpoint event', event.inspect, aTag, { draftId });
                    }

                    if (!draftId) {
                        console.error('Draft event does not have a draft ID:', event.inspect);
                        return;
                    }
                    
                    const items = {...get().items};
                    
                    const existingDraft = items[draftId];
                    if (!existingDraft) {
                        items[draftId] = [];
                    }
                    // check if we already have this draft
                    const existingDrafts = items[draftId];
                    if (existingDrafts.find((d) => d.draft.id === draft.id)) {
                        console.log('Draft already exists:', draftId);
                        return;
                    }

                    // add it and sort it
                    const category = get().categorizeDraft(draft, currentPubkey);
                    const counterparty = get().getCounterparty(draft, currentPubkey);
                    items[draftId].push({
                        draft,
                        innerEvent: await wrapEvent(innerEvent),
                        category,
                        counterparty
                    });
                    items[draftId].sort((a, b) => {
                        if (a.draft.created_at === b.draft.created_at) return 0;
                        return b.draft.created_at < a.draft.created_at ? -1 : 1;
                    });
                    console.log('Draft event', event.inspect, { draftId }, items[draftId]);
                    set({ items });
                });
            },
        });

        set({ ndk, sub });
    },

    /**
     * Deletes the draft and any previous checkpoint associated with it.
     */
    deleteDraft: async (draft: NDKEvent) => {
        const { ndk, items } = get();
        if (!ndk) throw new Error("NDK not initialized");

        const deletedIds = new Set(get().deletedIds);
        let draftId: string | undefined;

        if (draft.kind === NDKKind.Draft) {
            draftId = draft.dTag;
        } else if (draft.kind === NDKKind.DraftCheckpoint) {
            const aTag = draft.tagValue("a");
            draftId = aTag?.split(":")[2];
        }

        if (!draftId) throw new Error("Draft event does not have a draft ID");

        const deleteEvent = new NDKEvent(ndk);
        deleteEvent.kind = NDKKind.EventDeletion;

        const remainingEntries = [];
        const entries = items[draftId];
        if (!entries) throw new Error("Draft not found");

        for (const entry of entries) {
            // compare created_at so we don't delete newer drafts
            if (entry.draft.created_at > draft.created_at) {
                console.log('Draft is newer, not deleting:', entry.draft.created_at, draft.created_at);
                remainingEntries.push(entry);
                continue;
            }
            // add the deleted tag
            deleteEvent.tags.push(["e", entry.draft.id]);
            deletedIds.add(entry.draft.id);
            console.log('\tTagging event for deletion:', entry.draft.kind, entry.draft.id);
        }

        if (remainingEntries.length > 0) {
            items[draftId] = remainingEntries;
            console.log('keeping draft:', draftId, {remainingEntries});
        } else {
            delete items[draftId];
            console.log('removing entire draft:', draftId);
        }

        set({ items: { ...items }, deletedIds });

        await deleteEvent.sign();
        deleteEvent.dump();
        deleteEvent.publish();

    },

    categorizeDraft: (draft: NDKDraft, currentPubkey: string): DraftCategory => {
        const isAuthor = draft.pubkey === currentPubkey;
        const pTags = draft.tags.filter(tag => tag[0] === "p");
        const hasPTags = pTags.length > 0;
        const isTaggedInP = pTags.some(tag => tag[1] === currentPubkey);

        if (isAuthor && hasPTags) {
            return "outgoing_proposal";
        } else if (!isAuthor && isTaggedInP) {
            return "incoming_proposal";
        } else {
            return "draft";
        }
    },

    getCounterparty: (draft: NDKDraft, currentPubkey: string): string | undefined => {
        const isAuthor = draft.pubkey === currentPubkey;
        const pTags = draft.tags.filter(tag => tag[0] === "p");

        if (isAuthor && pTags.length > 0) {
            // For outgoing proposals, the counterparty is the first p-tagged user
            return pTags[0][1];
        } else if (!isAuthor) {
            // For incoming proposals, the counterparty is the author
            return draft.pubkey;
        }

        return undefined;
    }
});