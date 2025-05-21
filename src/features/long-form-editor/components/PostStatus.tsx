import { useNDK } from "@nostr-dev-kit/ndk-hooks";
import { useEditorStore } from "../stores";
import { useCallback } from "react";

export function PostStatus() {
    const { ndk } = useNDK();
    const { content, draft, saveDraft, changesSinceLastSave } = useEditorStore();

    const handleClick = useCallback(() => {
        if (!ndk) return;
        saveDraft(true);
    }, [ndk, draft?.id]);

    const hasUnsavedChanges = changesSinceLastSave > 0;

    return (
        <button className="flex items-center gap-2" onClick={handleClick}>
            <div
                className={`h-2 w-2 rounded-full ${hasUnsavedChanges ? 'bg-yellow-500' : !draft ? 'bg-blue-500' : 'bg-green-500'}`}
            ></div>
            <div className="flex flex-col items-start">
                <span className="text-sm text-muted-foreground">
                    {hasUnsavedChanges ? 'Unsaved Changes' : 'Saved'}
                </span>
                <span className="text-xs font-light text-muted-foreground">
                    {hasUnsavedChanges ? 'Click to save' : 'Last saved at ' + new Date(draft?.created_at! * 1000).toLocaleTimeString()}
                </span>
            </div>
        </button>
    )
}