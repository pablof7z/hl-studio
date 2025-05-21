# Draft Support Documentation

This document provides comprehensive documentation for the draft functionality implementation in our Nostr-based application. It includes code definitions, implementation details, and usage examples for both the domain and feature layers.

## Table of Contents

1. [Introduction](#introduction)
2. [Domain Layer](#domain-layer)
   - [Types and Interfaces](#types-and-interfaces)
   - [NDKDraft Wrapper](#ndkdraft-wrapper)
   - [Hooks](#hooks)
   - [Store](#store)
3. [Feature Layer](#feature-layer)
   - [Components](#components)
   - [Editor Integration](#editor-integration)
   - [UI State Management](#ui-state-management)
4. [Usage Examples](#usage-examples)
5. [Implementation Notes](#implementation-notes)

## Introduction

The draft functionality enables users to save, autosave, and manage drafts of their content before publishing. It supports both personal drafts and proposal drafts that can be sent to other users for review. The implementation follows our offline-first and zero-centralization principles, leveraging NDK for all Nostr interactions.

Key features include:
- Manual saving of drafts
- Automatic checkpoint creation for version history
- Draft retrieval and restoration
- Proposal drafts for collaborative review
- Cleanup of drafts upon publishing

## Domain Layer

The domain layer contains all reusable logic, types, and hooks for draft events, checkpoints, and proposals.

---

### NDKDraft Wrapper

The `NDKDraft` class, provided by [`@nostr-dev-kit/ndk`](https://github.com/nostr-dev-kit/ndk), is the core abstraction for managing draft events in our application. It extends the base NDK event model to support draft-specific behaviors, such as replaceable and checkpoint events, proposal encryption, and tag management.

**Role in the Draft System:**
- All draft creation, updates, checkpoints, and proposals are performed using `NDKDraft` instances.
- The class handles the correct kind assignment (replaceable for main drafts, non-replaceable for checkpoints).
- It provides methods for content encryption (for proposal drafts) and tag manipulation (e.g., draft ID, original kind, recipient).
- Utility functions in [`src/domains/drafts/utils.ts`](src/domains/drafts/utils.ts:96) wrap and extend `NDKDraft` usage for common operations (see "Draft Utilities" below).

**Migration Note:**
As described in [`DRAFT-MIGRATION.md`](DRAFT-MIGRATION.md), the previous Svelte implementation also used `NDKDraft` for all draft logic. The React/NDK integration here continues this approach, ensuring compatibility and leveraging the latest NDK features.

---

### Types and Interfaces

```typescript
// src/domains/drafts/types.ts

import { NDKEvent, NDKKind, NDKUser } from "@nostr-dev-kit/ndk";

/**
 * Draft-related kind numbers
 */
export enum DraftKind {
    Draft = 31234,           // Replaceable draft event
    DraftCheckpoint = 1234   // Non-replaceable checkpoint event
}

/**
 * Unique identifier for a draft
 */
export type DraftId = string;

/**
 * Status of a draft
 */
export type DraftStatus = "unsaved" | "saving" | "saved" | "error";

/**
 * Interface for draft event data
 */
export interface DraftEventData {
    content: string;
    originalKind?: number;
    tags?: string[][];
    createdAt?: number;
}

/**
 * Type for a draft event
 */
export type DraftEvent = NDKEvent & {
    kind: DraftKind.Draft | DraftKind.DraftCheckpoint;
};

/**
 * Type for a proposal draft event
 */
export type ProposalDraftEvent = DraftEvent;

/**
 * Interface for draft history item
 */
export interface DraftHistoryItem {
    event: DraftEvent;
    timestamp: number;
    isCheckpoint: boolean;
    isProposal: boolean;
}
### Draft Utilities

```typescript
// src/domains/drafts/utils.ts

import { NDK, NDKEvent, NDKUser, NDKDraft } from "@nostr-dev-kit/ndk";
import { DraftId, DraftKind } from "./types";

/**
 * Get the draft ID from an event
 * @param event The NDKEvent to get the draft ID from
 */
export function getDraftId(event: NDKEvent): DraftId {
    return event.getTag("d") || "";
}

/**
 * Get the original kind from an event
 * @param event The NDKEvent to get the original kind from
 */
export function getOriginalKind(event: NDKEvent): number | undefined {
    const kindTag = event.getTag("k");
    return kindTag ? parseInt(kindTag, 10) : undefined;
}

/**
 * Check if an event is a proposal
 * @param event The NDKEvent to check
 */
export function isProposal(event: NDKEvent): boolean {
    return !!event.getTag("p");
}

/**
 * Get the proposal recipient from an event
 * @param event The NDKEvent to get the recipient from
 */
export function getProposalRecipient(event: NDKEvent): NDKUser | undefined {
    const recipientPubkey = event.getTag("p");
    if (recipientPubkey && event.ndk) {
        return event.ndk.getUser({ pubkey: recipientPubkey });
    }
    return undefined;
}

/**
 * Create a draft with the specified content and metadata
 * @param ndk NDK instance
 * @param draftId Unique identifier for the draft
 * @param content Content of the draft
 * @param originalKind Original event kind (what this draft will become when published)
 * @param tags Additional tags to add to the draft
 */
export function createDraft(
    ndk: NDK,
    draftId: DraftId,
    content: string,
    originalKind?: number,
    tags?: string[][]
): NDKDraft {
    const draft = new NDKDraft(ndk);
    
    // Set content
    draft.content = content;
    
    // Add tags
    if (tags) {
        tags.forEach(tag => {
            draft.tags.push(tag);
        });
    }
    
    // Set original kind tag if provided
    if (originalKind) {
        draft.tags.push(["k", `${originalKind}`]);
    }
    
    // Set draft ID tag
    draft.tags.push(["d", draftId]);
    
    return draft;
}

/**
 * Save a draft as a checkpoint
 * @param draft The draft to save as a checkpoint
 */
export function saveAsCheckpoint(draft: NDKDraft): void {
    draft.kind = DraftKind.DraftCheckpoint;
    draft.publish();
}

/**
 * Save a draft as a proposal for another user
 * @param draft The draft to save as a proposal
 * @param recipient The user to send the proposal to
 */
export async function saveAsProposal(draft: NDKDraft, recipient: NDKUser): Promise<void> {
    draft.kind = DraftKind.Draft;
    
    // Add recipient pubkey as p tag
    draft.tags.push(["p", recipient.pubkey]);
    
    // Encrypt content for recipient
    await draft.encrypt(recipient);
    
    draft.publish();
}

/**
 * Delete a draft and all its checkpoints
 * @param ndk NDK instance
 * @param draft The draft to delete
 */
export async function deleteDraftAndCheckpoints(ndk: NDK, draft: NDKDraft): Promise<void> {
    const draftId = getDraftId(draft);
    
    // Create deletion event (kind 5)
    const deletionEvent = new NDKEvent(ndk);
    deletionEvent.kind = 5;
    
    // Add e tag for the draft
    deletionEvent.tags.push(["e", draft.id]);
    
    // Fetch all checkpoints for this draft
    const { events: checkpoints } = await ndk.fetchEvents({
        kinds: [DraftKind.DraftCheckpoint],
        "#d": [draftId]
    });
    
    // Add e tags for all checkpoints
    checkpoints.forEach(checkpoint => {
        deletionEvent.tags.push(["e", checkpoint.id]);
    });
    
    // Publish deletion event
    deletionEvent.publish();
}
### Hooks

```typescript
// src/domains/drafts/hooks/useDraft.ts

import { useCallback, useMemo } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-hooks";
import { useSubscribe } from "@nostr-dev-kit/ndk-hooks";
import { NDKEvent, NDKDraft } from "@nostr-dev-kit/ndk";
import { DraftEvent, DraftId, DraftKind } from "../types";
import { getDraftId, getOriginalKind, createDraft as createDraftUtil } from "../utils";
import { useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks";

/**
 * Hook to fetch and manage a specific draft
 * @param draftId The ID of the draft to fetch
 */
export function useDraft(draftId: DraftId) {
    const { ndk } = useNDK();
    const pubkey = useNDKCurrentPubkey();
    
    // Fetch the replaceable draft event
    const { events } = useSubscribe(
        draftId && pubkey ? [{
            kinds: [DraftKind.Draft],
            authors: [pubkey],
            "#d": [draftId]
        }] : false,
        {},
        [draftId, pubkey]
    );
    
    // Get the latest draft event
    const latestDraft = useMemo(() => {
        if (events.length === 0) return null;
        // Events are already sorted by created_at
        return events[0] as DraftEvent;
    }, [events]);
    
    // Create NDKDraft wrapper if we have a draft event
    const draft = useMemo(() => {
        if (!latestDraft || !ndk) return null;
        
        const draft = new NDKDraft(ndk);
        draft.content = latestDraft.content;
        draft.tags = [...latestDraft.tags];
        draft.kind = latestDraft.kind;
        draft.created_at = latestDraft.created_at;
        
        return draft;
    }, [latestDraft, ndk]);
    
    // Function to create a new draft
    const createDraft = useCallback((content: string, originalKind?: number, tags?: string[][]) => {
        if (!ndk || !draftId) return null;
        return createDraftUtil(ndk, draftId, content, originalKind, tags);
    }, [ndk, draftId]);
    
    return {
        draft,
        latestDraft,
        createDraft
    };
}
```

```typescript
// src/domains/drafts/hooks/useDraftCheckpoints.ts

import { useMemo } from "react";
import { useSubscribe } from "@nostr-dev-kit/ndk-hooks";
import { useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks";
import { DraftEvent, DraftHistoryItem, DraftId, DraftKind } from "../types";

/**
 * Hook to fetch checkpoints for a specific draft
 * @param draftId The ID of the draft
 */
export function useDraftCheckpoints(draftId: DraftId) {
    const pubkey = useNDKCurrentPubkey();
    
    // Fetch checkpoint events
    const { events } = useSubscribe(
        draftId && pubkey ? [{
            kinds: [DraftKind.DraftCheckpoint],
            authors: [pubkey],
            "#d": [draftId]
        }] : false,
        {},
        [draftId, pubkey]
    );
    
    // Sort checkpoints by created_at (newest first)
    const checkpoints = useMemo(() => {
        return events as DraftEvent[];
    }, [events]);
    
    return { checkpoints };
}
```

```typescript
// src/domains/drafts/hooks/useDraftHistory.ts

import { useMemo } from "react";
import { useDraft } from "./useDraft";
import { useDraftCheckpoints } from "./useDraftCheckpoints";
import { DraftHistoryItem, DraftId } from "../types";
import { isProposal } from "../utils";

/**
 * Hook to get the complete history of a draft (main draft + checkpoints)
 * @param draftId The ID of the draft
 */
export function useDraftHistory(draftId: DraftId) {
    const { latestDraft } = useDraft(draftId);
    const { checkpoints } = useDraftCheckpoints(draftId);
    
    // Combine main draft and checkpoints into a single history
    const history = useMemo(() => {
        const items: DraftHistoryItem[] = [];
        
        // Add main draft if it exists
        if (latestDraft) {
            items.push({
                event: latestDraft,
                timestamp: latestDraft.created_at || 0,
                isCheckpoint: false,
                isProposal: isProposal(latestDraft)
            });
        }
        
        // Add checkpoints
        checkpoints.forEach(checkpoint => {
            items.push({
                event: checkpoint,
                timestamp: checkpoint.created_at || 0,
                isCheckpoint: true,
                isProposal: isProposal(checkpoint)
            });
        });
        
        // Sort by timestamp (newest first)
        return items.sort((a, b) => b.timestamp - a.timestamp);
    }, [latestDraft, checkpoints]);
    
    return { history };
}
```
        
```typescript
// src/domains/drafts/hooks/useProposals.ts

import { useMemo } from "react";
import { useSubscribe } from "@nostr-dev-kit/ndk-hooks";
import { useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks";
import { DraftEvent, DraftKind, ProposalDraftEvent } from "../types";

/**
 * Hook to fetch proposals sent to the current user
 */
export function useProposals() {
    const pubkey = useNDKCurrentPubkey();
    
    // Fetch proposals (drafts with p tag matching current user)
    const { events } = useSubscribe(
        pubkey ? [{
            kinds: [DraftKind.Draft],
            "#p": [pubkey]
        }] : false,
        {},
        [pubkey]
    );
    
    // Group proposals by author
    const proposalsByAuthor = useMemo(() => {
        const byAuthor = new Map<string, ProposalDraftEvent[]>();
        
        events.forEach(event => {
            const authorPubkey = event.pubkey;
            if (!byAuthor.has(authorPubkey)) {
                byAuthor.set(authorPubkey, []);
            }
            byAuthor.get(authorPubkey)?.push(event as ProposalDraftEvent);
        });
        
        return byAuthor;
    }, [events]);
    
    return {
        proposals: events as ProposalDraftEvent[],
        proposalsByAuthor
    };
### useDraftStatus

```typescript
// src/domains/drafts/hooks/useDraftStatus.ts

import { useState, useEffect, useCallback } from "react";
import { DraftId, DraftStatus } from "../types";
import { useDraft } from "./useDraft";
import { useDraftStore } from "../stores/draftStore";

/**
 * Hook to manage and track the status of a draft
 * @param draftId The ID of the draft
 */
export function useDraftStatus(draftId: DraftId) {
    const { latestDraft } = useDraft(draftId);
    const [status, setStatus] = useState<DraftStatus>("unsaved");
    const [lastSaved, setLastSaved] = useState<number | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const { savingDrafts } = useDraftStore();

    // Update status based on latest draft and saving state
    useEffect(() => {
        if (savingDrafts.includes(draftId)) {
            setStatus("saving");
            return;
        }

        if (error) {
            setStatus("error");
            return;
        }

        if (latestDraft) {
            setStatus("saved");
            setLastSaved(latestDraft.created_at || Date.now() / 1000);
        } else {
            setStatus("unsaved");
            setLastSaved(null);
        }
    }, [latestDraft, savingDrafts, draftId, error]);

    // Function to set error state
    const setErrorState = useCallback((err: Error) => {
        setError(err);

        // Clear error after 5 seconds
        setTimeout(() => {
            setError(null);
        }, 5000);
    }, []);

    return {
        status,
        lastSaved,
        error,
        setError: setErrorState
    };
}
```

### Store

```typescript
// src/domains/drafts/stores/draftStore.ts

import { create } from "zustand";
import { DraftId } from "../types";

interface DraftStoreState {
    // Drafts currently being saved
    savingDrafts: DraftId[];
    
    // Autosave settings
    autosaveEnabled: boolean;
    autosaveInterval: number; // in milliseconds
    autosaveChangeThreshold: number;
    
    // Change tracking
    changeCountByDraft: Record<DraftId, number>;
}

export const useDraftStore = create<DraftStoreState>((set) => ({
    savingDrafts: [],
    autosaveEnabled: true,
    autosaveInterval: 30000, // 30 seconds
    autosaveChangeThreshold: 10, // changes
    changeCountByDraft: {},
}));

// src/domains/drafts/stores/actions/setSavingDraft.ts

import { DraftId } from "../../types";
import { useDraftStore } from "../draftStore";

/**
 * Set a draft as saving or not saving
 * @param draftId The ID of the draft
 * @param isSaving Whether the draft is being saved
 */
export function setSavingDraft(draftId: DraftId, isSaving: boolean): void {
    useDraftStore.setState((state) => ({
        savingDrafts: isSaving 
            ? [...state.savingDrafts, draftId]
            : state.savingDrafts.filter(id => id !== draftId)
    }));
}

// src/domains/drafts/stores/actions/setAutosaveSettings.ts

import { useDraftStore } from "../draftStore";

/**
 * Set autosave settings
 * @param enabled Whether autosave is enabled
 * @param interval Autosave interval in milliseconds
 * @param threshold Number of changes before autosaving
 */
export function setAutosaveSettings(
    enabled?: boolean,
    interval?: number,
    threshold?: number
): void {
    useDraftStore.setState((state) => ({
        autosaveEnabled: enabled !== undefined ? enabled : state.autosaveEnabled,
        autosaveInterval: interval !== undefined ? interval : state.autosaveInterval,
        autosaveChangeThreshold: threshold !== undefined ? threshold : state.autosaveChangeThreshold
    }));
}

// src/domains/drafts/stores/actions/trackChanges.ts

import { DraftId } from "../../types";
import { useDraftStore } from "../draftStore";

/**
 * Increment the change count for a draft
 * @param draftId The ID of the draft
 */
export function incrementChangeCount(draftId: DraftId): void {
    useDraftStore.setState((state) => ({
        changeCountByDraft: {
            ...state.changeCountByDraft,
            [draftId]: (state.changeCountByDraft[draftId] || 0) + 1
        }
    }));
}

/**
 * Reset the change count for a draft
 * @param draftId The ID of the draft
 */
export function resetChangeCount(draftId: DraftId): void {
    useDraftStore.setState((state) => ({
        changeCountByDraft: {
            ...state.changeCountByDraft,
            [draftId]: 0
        }
    }));
}

// src/domains/drafts/stores/index.ts

import { useDraftStore } from "./draftStore";
import { setSavingDraft } from "./actions/setSavingDraft";
import { setAutosaveSettings } from "./actions/setAutosaveSettings";
import { incrementChangeCount, resetChangeCount } from "./actions/trackChanges";

// Bind actions to store
useDraftStore.setState({
    setSavingDraft,
    setAutosaveSettings,
    incrementChangeCount,
    resetChangeCount
});

export { useDraftStore };
```

## Feature Layer

The feature layer contains editor-specific UI, state, and glue logic for draft management.

### Components

```typescript
// src/features/long-form-editor/components/DraftButton.tsx

import React from "react";
import { Button } from "@/ui/atoms/Button";
import { Tooltip } from "@/ui/molecules/Tooltip";
import { DraftId, DraftStatus, useDraftStatus } from "@/domains/drafts";
import { formatDistanceToNow } from "date-fns";

interface DraftButtonProps {
    draftId: DraftId;
    onSave: () => void;
    className?: string;
}

export function DraftButton({ draftId, onSave, className }: DraftButtonProps) {
    const { status, lastSaved, error } = useDraftStatus(draftId);
    
    // Determine status indicator color
    const statusColor = {
        unsaved: "bg-yellow-500",
        saving: "bg-blue-500 animate-pulse",
        saved: "bg-green-500",
        error: "bg-red-500"
    }[status];
    
    // Format last saved time
    const lastSavedText = lastSaved 
        ? `Last saved ${formatDistanceToNow(lastSaved * 1000, { addSuffix: true })}`
        : "Not saved yet";
    
    // Tooltip content
    const tooltipContent = error 
        ? `Error: ${error.message}` 
        : lastSavedText;
    
    return (
        <Tooltip content={tooltipContent}>
            <Button 
                onClick={onSave}
                className={className}
                variant="outline"
                disabled={status === "saving"}
            >
                <span className={`w-2 h-2 rounded-full mr-2 ${statusColor}`} />
                {status === "saving" ? "Saving..." : "Save Draft"}
            </Button>
        </Tooltip>
    );
}

// src/features/long-form-editor/components/DraftHistorySidebar.tsx

import React, { useState } from "react";
import { Button } from "@/ui/atoms/Button";
import { DraftId, useDraftHistory } from "@/domains/drafts";
import { format } from "date-fns";

interface DraftHistorySidebarProps {
    draftId: DraftId;
    isOpen: boolean;
    onClose: () => void;
    onPreview: (content: string) => void;
    onRestore: (content: string) => void;
    currentContent: string;
}

export function DraftHistorySidebar({
    draftId,
    isOpen,
    onClose,
    onPreview,
    onRestore,
    currentContent
}: DraftHistorySidebarProps) {
    const { history } = useDraftHistory(draftId);
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    
    // Handle preview click
    const handlePreview = (index: number) => {
        setSelectedVersion(index);
        const selectedItem = history[index];
        onPreview(selectedItem.event.content);
        setIsPreviewMode(true);
    };
    
    // Handle restore click
    const handleRestore = () => {
        if (selectedVersion === null) return;
        
        const selectedItem = history[selectedVersion];
        onRestore(selectedItem.event.content);
        onClose();
    };
    
    // Handle exit preview
    const handleExitPreview = () => {
        onPreview(currentContent);
        setIsPreviewMode(false);
        setSelectedVersion(null);
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-50 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Draft History</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <span className="sr-only">Close</span>
                    <span aria-hidden="true">×</span>
                </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {history.length === 0 ? (
                    <p className="text-center py-4">No history available</p>
                ) : (
                    <ul className="divide-y">
                        {history.map((item, index) => (
                            <li
                                key={item.event.id}
                                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                    selectedVersion === index ? "bg-blue-50" : ""
                                }`}
                                onClick={() => handlePreview(index)}
                            >
                                <div>
                                    <span className="font-medium">
                                        {format(item.timestamp * 1000, "PPpp")}
                                    </span>
                                    <div className="flex space-x-2 mt-1">
                                        {item.isCheckpoint && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Checkpoint
                                            </span>
                                        )}
                                        {item.isProposal && (
                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                Proposal
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                    {item.event.content.substring(0, 100)}...
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
                {isPreviewMode ? (
                    <div className="space-y-2">
                        <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm">
                            You are previewing a previous version. Your current draft has not been modified.
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={handleExitPreview} className="flex-1">
                                Exit Preview
                            </Button>
                            <Button onClick={handleRestore} className="flex-1">
                                Restore This Version
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        Click on a version to preview it in the editor
                    </p>
                )}
            </div>
        </div>
    );
}
```

### Editor Integration

```typescript
// src/features/long-form-editor/hooks/useEditorDraft.ts

import { useCallback, useEffect, useState } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-hooks";
import { 
    DraftId, 
    useDraft, 
    useDraftStore,
    saveAsCheckpoint,
    createDraft
} from "@/domains/drafts";
import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";

interface UseEditorDraftOptions {
    draftId: DraftId;
    originalKind?: number;
    autosave?: boolean;
}

export function useEditorDraft({ draftId, originalKind, autosave = true }: UseEditorDraftOptions) {
    const { ndk } = useNDK();
    const { draft, latestDraft, createDraft: createDraftFromHook } = useDraft(draftId);
    const [content, setContent] = useState<string>("");
    const [isProposalMode, setIsProposalMode] = useState<boolean>(false);
    const [proposalRecipient, setProposalRecipient] = useState<NDKUser | null>(null);
    
    const { 
        autosaveEnabled, 
        autosaveInterval, 
        autosaveChangeThreshold,
        changeCountByDraft,
        setSavingDraft,
        incrementChangeCount,
        resetChangeCount
    } = useDraftStore();
    
    // Initialize content from latest draft
    useEffect(() => {
        if (latestDraft && latestDraft.content) {
            setContent(latestDraft.content);
        }
    }, [latestDraft]);
    
    // Handle content change
    const handleContentChange = useCallback((newContent: string) => {
        setContent(newContent);
        
        // Track changes for autosave
        if (autosave && autosaveEnabled) {
            incrementChangeCount(draftId);
        }
    }, [draftId, autosave, autosaveEnabled, incrementChangeCount]);
    
    // Autosave based on change count
    useEffect(() => {
        if (!autosave || !autosaveEnabled || !ndk) return;
        
        const changeCount = changeCountByDraft[draftId] || 0;
        
        if (changeCount >= autosaveChangeThreshold) {
            // Create checkpoint
            const newDraft = createDraftFromHook(originalKind);
            if (newDraft) {
                newDraft.content = content;
                saveAsCheckpoint(newDraft);
                resetChangeCount(draftId);
            }
        }
    }, [
        changeCountByDraft, 
        draftId, 
        autosave, 
        autosaveEnabled, 
        autosaveChangeThreshold, 
        content, 
        ndk, 
        originalKind, 
        createDraftFromHook, 
        resetChangeCount
    ]);
    
    // Autosave based on timer
    useEffect(() => {
        if (!autosave || !autosaveEnabled || !ndk) return;
        
        const timer = setInterval(() => {
            // Only save if there are changes
            if ((changeCountByDraft[draftId] || 0) > 0) {
                // Create checkpoint
                const newDraft = createDraftFromHook(originalKind);
                if (newDraft) {
                    newDraft.content = content;
                    saveAsCheckpoint(newDraft);
                    resetChangeCount(draftId);
                }
            }
        }, autosaveInterval);
        
        return () => clearInterval(timer);
    }, [
        autosave, 
        autosaveEnabled, 
        autosaveInterval, 
        changeCountByDraft, 
        content, 
        createDraftFromHook, 
        draftId, 
        ndk, 
        originalKind, 
        resetChangeCount
    ]);
    
    // Manual save
    const saveDraft = useCallback(async () => {
        if (!ndk) return;
        
        try {
            setSavingDraft(draftId, true);
            
            let newDraft;
            if (draft) {
                // Update existing draft
                newDraft = draft;
                newDraft.content = content;
            } else {
                // Create new draft
                newDraft = createDraftFromHook(originalKind);
                if (newDraft) {
                    newDraft.content = content;
                }
            }
            
            if (newDraft) {
                // Save as proposal if in proposal mode
                if (isProposalMode && proposalRecipient) {
                    await newDraft.encrypt(proposalRecipient);
                    newDraft.tags.push(["p", proposalRecipient.pubkey]);
                }
                
                newDraft.publish();
                resetChangeCount(draftId);
            }
        } catch (error) {
            console.error("Error saving draft:", error);
        } finally {
            setSavingDraft(draftId, false);
        }
    }, [
        ndk, 
        draft, 
        content, 
        draftId, 
        isProposalMode, 
        proposalRecipient, 
        createDraftFromHook, 
        originalKind, 
        setSavingDraft, 
        resetChangeCount
    ]);
    
    return {
        content,
        setContent: handleContentChange,
        saveDraft,
        isProposalMode,
        setIsProposalMode,
        proposalRecipient,
        setProposalRecipient
    };
}
```

## Usage Examples

### Basic Draft Usage

```typescript
// Example of using drafts in a component

import React, { useState, useRef } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-hooks";
import { DraftButton } from "@/features/long-form-editor/components/DraftButton";
import { DraftHistorySidebar } from "@/features/long-form-editor/components/DraftHistorySidebar";
import { useEditorDraft } from "@/features/long-form-editor/hooks/useEditorDraft";
import { NDKKind } from "@nostr-dev-kit/ndk";

export function ArticleEditor() {
    const draftId = "article-123"; // Unique identifier for this draft
    const originalKind = NDKKind.Article; // This draft will become an article when published
    
    const {
        content,
        setContent,
        saveDraft,
        isProposalMode,
        setIsProposalMode,
        proposalRecipient,
        setProposalRecipient
    } = useEditorDraft({
        draftId,
        originalKind,
        autosave: true
    });
    
    const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
    const originalContentRef = useRef(content);
    
    // Open history sidebar
    const openHistorySidebar = () => {
        // Store the current content before opening the sidebar
        originalContentRef.current = content;
        setIsHistorySidebarOpen(true);
    };
    
    // Handle content preview from history
    const handlePreview = (previewContent: string) => {
        // Just update the editor content for preview
        // This doesn't affect the actual draft state
        setContent(previewContent);
    };
    
    // Handle content restore from history
    const handleRestore = (restoredContent: string) => {
        // Update the content and close the sidebar
        setContent(restoredContent);
        // Save the restored content as the new draft
        saveDraft();
    };
    
    // Handle closing the sidebar
    const handleCloseSidebar = () => {
        // Restore the original content if the user hasn't restored a version
        setContent(originalContentRef.current);
        setIsHistorySidebarOpen(false);
    };
    
    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Article Editor</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={openHistorySidebar}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        History
                    </button>
                    <DraftButton
                        draftId={draftId}
                        onSave={saveDraft}
                    />
                </div>
            </div>
            
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 p-2 border rounded"
                placeholder="Write your article here..."
            />
            
            <DraftHistorySidebar
                draftId={draftId}
                isOpen={isHistorySidebarOpen}
                onClose={handleCloseSidebar}
                onPreview={handlePreview}
                onRestore={handleRestore}
                currentContent={originalContentRef.current}
            />
        </div>
    );
}
```

### Proposal Draft Usage

```typescript
// Example of using proposal drafts

import React, { useState } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-hooks";
import { DraftButton } from "@/features/long-form-editor/components/DraftButton";
import { useEditorDraft } from "@/features/long-form-editor/hooks/useEditorDraft";
import { NDKKind, NDKUser } from "@nostr-dev-kit/ndk";

export function ProposalEditor() {
    const { ndk } = useNDK();
    const draftId = "proposal-123";
    const originalKind = NDKKind.Article;
    
    const { 
        content, 
        setContent, 
        saveDraft,
        isProposalMode,
        setIsProposalMode,
        proposalRecipient,
        setProposalRecipient
    } = useEditorDraft({
        draftId,
        originalKind,
        autosave: true
    });
    
    const [recipientNpub, setRecipientNpub] = useState("");
    
    // Handle recipient change
    const handleRecipientChange = () => {
        if (!ndk || !recipientNpub) return;
        
        try {
            // Create NDKUser from npub
            const user = ndk.getUser({ npub: recipientNpub });
            setProposalRecipient(user);
            setIsProposalMode(true);
        } catch (error) {
            console.error("Invalid npub:", error);
        }
    };
    
    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Proposal Editor</h1>
                <DraftButton 
### UI State Management

```typescript
// src/features/long-form-editor/stores/types.ts

import { DraftId } from "@/domains/drafts";
import { NDKUser } from "@nostr-dev-kit/ndk";

export interface EditorState {
    // Current editor content
    content: string;
    
    // Draft ID for the current content
    draftId: DraftId | null;
    
    // Whether the content has been modified since last save
    isDirty: boolean;
    
    // Whether the editor is in proposal mode
    isProposalMode: boolean;
    
    // Whether the history modal is open
    isHistoryModalOpen: boolean;
    
    // Proposal recipient
    proposalRecipient: NDKUser | null;
}

// src/features/long-form-editor/stores/editorStore.ts

import { create } from "zustand";
import { EditorState } from "./types";

export const useEditorStore = create<EditorState>((set) => ({
    content: "",
    draftId: null,
    isDirty: false,
    isProposalMode: false,
    isHistoryModalOpen: false,
    proposalRecipient: null
}));

// src/features/long-form-editor/stores/actions/contentActions.ts

import { useEditorStore } from "../editorStore";
import { DraftId } from "@/domains/drafts";

/**
 * Set the editor content
 * @param content The new content
 */
export function setContent(content: string): void {
    useEditorStore.setState((state) => ({
        content,
        isDirty: true
    }));
}

/**
 * Set the draft ID
 * @param draftId The draft ID
 */
export function setDraftId(draftId: DraftId | null): void {
    useEditorStore.setState({ draftId });
}

/**
 * Mark content as saved (not dirty)
 */
export function markAsSaved(): void {
    useEditorStore.setState({ isDirty: false });
}

// src/features/long-form-editor/stores/actions/proposalActions.ts

import { useEditorStore } from "../editorStore";
import { NDKUser } from "@nostr-dev-kit/ndk";

/**
 * Toggle proposal mode
 * @param enabled Whether proposal mode is enabled
 */
export function toggleProposalMode(enabled: boolean): void {
    useEditorStore.setState({ 
        isProposalMode: enabled,
        // Clear recipient if disabling
        proposalRecipient: enabled ? useEditorStore.getState().proposalRecipient : null
    });
}

/**
 * Set the proposal recipient
 * @param recipient The recipient user
 */
export function setProposalRecipient(recipient: NDKUser | null): void {
    useEditorStore.setState({ proposalRecipient: recipient });
}

// src/features/long-form-editor/stores/actions/uiActions.ts

import { useEditorStore } from "../editorStore";

/**
 * Toggle the history modal
 * @param isOpen Whether the modal is open
 */
export function toggleHistoryModal(isOpen: boolean): void {
    useEditorStore.setState({ isHistoryModalOpen: isOpen });
}

// src/features/long-form-editor/stores/index.ts

import { useEditorStore } from "./editorStore";
import { setContent, setDraftId, markAsSaved } from "./actions/contentActions";
import { toggleProposalMode, setProposalRecipient } from "./actions/proposalActions";
import { toggleHistoryModal } from "./actions/uiActions";

// Bind actions to store
useEditorStore.setState({
    setContent,
    setDraftId,
    markAsSaved,
    toggleProposalMode,
    setProposalRecipient,
    toggleHistoryModal
});

export { useEditorStore };
```
                    draftId={draftId} 
                    onSave={saveDraft} 
                />
            </div>
            
            <div className="mb-4 p-4 border rounded">
                <h2 className="text-lg font-semibold mb-2">Proposal Settings</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isProposalMode}
                        onChange={(e) => setIsProposalMode(e.target.checked)}
                        id="proposal-mode"
                    />
                    <label htmlFor="proposal-mode">Send as proposal</label>
                </div>
                
                {isProposalMode && (
                    <div className="mt-2">
                        <label className="block mb-1">Recipient (npub)</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={recipientNpub}
                                onChange={(e) => setRecipientNpub(e.target.value)}
                                className="flex-1 p-2 border rounded"
                                placeholder="npub1..."
                            />
                            <button
                                onClick={handleRecipientChange}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Set Recipient
                            </button>
                        </div>
                        
                        {proposalRecipient && (
                            <div className="mt-2 p-2 bg-green-100 rounded">
                                Recipient set: {proposalRecipient.npub}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 p-2 border rounded"
                placeholder="Write your proposal here..."
            />
        </div>
    );
}
```

## Implementation Notes

1. **Offline-First Approach**
   - The draft functionality follows our offline-first principle
   - No global loading flags are used
   - UI renders available data immediately and updates reactively as data arrives
   - Optimistic updates are used for all draft operations

2. **NDK Integration**
   - All Nostr interactions are performed through NDK
   - The built-in NDKDraft class is used for draft management
   - Utility functions are provided for draft-specific operations
   - All events are published without awaiting to leverage optimistic updates

3. **Autosave Strategy**
   - Autosave is triggered by both a timer and a change threshold
   - Checkpoints are created as non-replaceable events for version history
   - Main drafts are replaceable events for the latest version

4. **Proposal Drafts**
   - Drafts can be sent as proposals to other users
   - Content is encrypted for the recipient
   - Recipients are identified by their pubkey
   - Proposals are tagged with the recipient's pubkey

5. **Performance Considerations**
   - Subscriptions are kept minimal and focused
   - Events are already sorted by created_at from useSubscribe
   - No unnecessary re-sorting or processing is performed

6. **Testing**
   - All hooks and components should have colocated tests
   - Tests should use the provided test private key
   - No global loading flags should be used in tests
   - Tests should follow the offline-first approach

/**
 * Hook to manage and track the status of a draft
 * @param draftId The ID of the draft
 */
export function useDraftStatus(draftId: DraftId) {
    const { latestDraft } = useDraft(draftId);
    const [status, setStatus] = useState<DraftStatus>("unsaved");
    const [lastSaved, setLastSaved] = useState<number | null>(null);
    const [error, setError] = useState<Error | null>(null);
    
    const { savingDrafts } = useDraftStore();
    
    // Update status based on latest draft and saving state
    useEffect(() => {
        if (savingDrafts.includes(draftId)) {
            setStatus("saving");
            return;
        }
        
        if (error) {
            setStatus("error");
            return;
        }
        
        if (latestDraft) {
            setStatus("saved");
            setLastSaved(latestDraft.created_at || Date.now() / 1000);
        } else {
            setStatus("unsaved");
            setLastSaved(null);
        }
    }, [latestDraft, savingDrafts, draftId, error]);
    
    // Function to set error state
    const setErrorState = useCallback((err: Error) => {
        setError(err);
        
        // Clear error after 5 seconds
        setTimeout(() => {
            setError(null);
        }, 5000);
    }, []);
    
    return {
        status,
        lastSaved,
        error,
        setError: setErrorState
    };
}
```