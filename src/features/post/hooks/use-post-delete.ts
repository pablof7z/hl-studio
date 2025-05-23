import { useDraftStore } from "@/features/drafts/stores";
import { useScheduleStore } from "@/features/schedules/stores";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk-hooks";
import { useCallback } from "react";

export function usePostDelete() {
    const deleteDraft = useDraftStore((state) => state.deleteDraft);
    const deleteSchedule = useScheduleStore((state) => state.deleteSchedule);
    
    return useCallback((event: NDKEvent) => {
        const isArticle = event.kind === NDKKind.Article;
        const isDraft = event.kind === NDKKind.Draft || event.kind === NDKKind.DraftCheckpoint;
        const isSchedule = event.kind === NDKKind.DVMEventSchedule;
        
        if (isArticle) {
            event.content = "This post has been deleted.";
            event.tags.push(["deleted"]);
            event.publishReplaceable();
            event.delete();
        }

        if (isDraft) {
            console.debug('[usePostDelete] using draft deletion', event.kind);
            deleteDraft(event);
        }

        if (isSchedule) {
            console.debug('[usePostDelete] using schedule deletion', event.kind);
            deleteSchedule(event);
        }
    }, [deleteDraft, deleteSchedule]);
}