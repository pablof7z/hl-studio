import { useDraftStore } from "@/features/drafts/stores";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk-hooks";
import { useCallback } from "react";

export function usePostDelete() {
    const deleteDraft = useDraftStore((state) => state.deleteDraft);
    
    return useCallback((event: NDKEvent) => {
        const isArticle = event.kind === NDKKind.Article;
        const isDraft = event.kind === NDKKind.Draft || event.kind === NDKKind.DraftCheckpoint;
        
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
    }, [deleteDraft]);
}