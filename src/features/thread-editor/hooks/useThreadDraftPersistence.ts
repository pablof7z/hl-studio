import { useCallback, useEffect } from "react";
import type { Post } from "../types";

const STORAGE_KEY = "thread-editor-draft-v1";

export interface ThreadDraft {
    posts: Post[];
    activePostId: string;
}

type SetPosts = (posts: Post[]) => void;
type SetActivePostId = (id: string) => void;

/**
 * Persists thread editor state to localStorage and provides restore/reset helpers.
 * 
 * @param posts Current posts array
 * @param activePostId Current active post id
 * @param setPosts Setter for posts
 * @param setActivePostId Setter for active post id
 * @returns { restoreDraft, resetDraft, hasDraft }
 */
export function useThreadDraftPersistence(
    posts: Post[],
    activePostId: string,
    setPosts: SetPosts,
    setActivePostId: SetActivePostId
) {
    // Save to localStorage on change
    useEffect(() => {
        const draft: ThreadDraft = { posts, activePostId };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } catch {}
    }, [posts, activePostId]);

    // Restore draft from localStorage
    const restoreDraft = useCallback(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const draft: ThreadDraft = JSON.parse(raw);
            if (
                Array.isArray(draft.posts) &&
                typeof draft.activePostId === "string" &&
                draft.posts.length > 0
            ) {
                setPosts(draft.posts);
                setActivePostId(draft.activePostId);
                return true;
            }
        } catch {}
        return false;
    }, [setPosts, setActivePostId]);

    // Reset draft in localStorage and state
    const resetDraft = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {}
        setPosts([{ id: "1", content: "", images: [] }]);
        setActivePostId("1");
    }, [setPosts, setActivePostId]);

    // Check if a draft exists
    const hasDraft = (() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const draft: ThreadDraft = JSON.parse(raw);
            return (
                Array.isArray(draft.posts) &&
                typeof draft.activePostId === "string" &&
                draft.posts.length > 0
            );
        } catch {
            return false;
        }
    })();

    return { restoreDraft, resetDraft, hasDraft };
}