# Draft Functionality Testing Plan

This document outlines the testing strategy for the draft functionality implementation, including unit tests, integration tests, and end-to-end (E2E) tests.

**All tests must:**
- Use the provided test private key (`0000000000000000000000000000000000000000000000000000000000000000`) for authentication.
- Use NDK and ndk-hooks for all Nostr interactions (never nostr-tools or custom fetchers).
- Be colocated with the code they test, using `.test.ts` or `.test.tsx` suffixes.
- Avoid global `loading` flags; assert on data presence/absence as it becomes available.
- Use NDK test utilities for setup, teardown, and mocking as needed.

These requirements are enforced by project [`TESTING.md`](src/roo/rules/TESTING.md).

## Unit Tests

### Domain Layer Tests

#### Draft Utilities (`src/domains/drafts/utils.test.ts`)

```typescript
test("getDraftId should extract the draft ID from an event", () => {
  // Test that getDraftId correctly extracts the 'd' tag value
});

test("getOriginalKind should extract the original kind from an event", () => {
  // Test that getOriginalKind correctly extracts the 'k' tag value and parses it as a number
});

test("isProposal should correctly identify proposal drafts", () => {
  // Test that isProposal returns true for events with a 'p' tag
  // Test that isProposal returns false for events without a 'p' tag
});

test("getProposalRecipient should return an NDKUser for the recipient", () => {
  // Test that getProposalRecipient returns an NDKUser with the correct pubkey
  // Test that getProposalRecipient returns undefined when no 'p' tag exists
});

test("createDraft should create a draft with the correct content and tags", () => {
  // Test that createDraft returns an NDKDraft with the expected content and tags
  // Test that the draft has the correct kind (31234)
});

test("saveAsCheckpoint should set the correct kind and publish the draft", () => {
  // Test that saveAsCheckpoint sets the kind to DraftCheckpoint (1234)
  // Test that it calls publish on the draft
});

test("saveAsProposal should add recipient tag, encrypt content, and publish", () => {
  // Test that saveAsProposal adds the 'p' tag with the recipient's pubkey
  // Test that it calls encrypt with the recipient
  // Test that it calls publish on the draft
});

test("deleteDraftAndCheckpoints should create and publish a deletion event", () => {
  // Test that deleteDraftAndCheckpoints creates a kind 5 event
  // Test that it adds 'e' tags for the draft and all checkpoints
  // Test that it publishes the deletion event
});
```

#### Draft Hooks (`src/domains/drafts/hooks/useDraft.test.ts`)

```typescript
test("useDraft should return null when no draft exists", () => {
  // Test that useDraft returns null draft when no events are found
});

test("useDraft should return the latest draft when events exist", () => {
  // Test that useDraft returns the most recent draft when multiple events exist
});

test("useDraft should create an NDKDraft wrapper for the event", () => {
  // Test that the returned draft is an NDKDraft instance with the correct properties
});

test("createDraft function should create a new draft with the specified content", () => {
  // Test that the createDraft function returns a new NDKDraft with the expected content
});
```

#### Draft Checkpoints (`src/domains/drafts/hooks/useDraftCheckpoints.test.ts`)

```typescript
test("useDraftCheckpoints should return an empty array when no checkpoints exist", () => {
  // Test that useDraftCheckpoints returns an empty array when no events are found
});

test("useDraftCheckpoints should return all checkpoints for a draft", () => {
  // Test that useDraftCheckpoints returns all checkpoint events for the specified draft ID
});
```

#### Draft History (`src/domains/drafts/hooks/useDraftHistory.test.ts`)

```typescript
test("useDraftHistory should combine main draft and checkpoints", () => {
  // Test that useDraftHistory returns a combined array of the main draft and all checkpoints
});

test("useDraftHistory should sort items by timestamp in descending order", () => {
  // Test that the history items are sorted by timestamp (newest first)
});

test("useDraftHistory should correctly identify checkpoints and proposals", () => {
  // Test that isCheckpoint and isProposal flags are set correctly for each history item
});
```

#### Proposals (`src/domains/drafts/hooks/useProposals.test.ts`)

```typescript
test("useProposals should return proposals sent to the current user", () => {
  // Test that useProposals returns drafts with a 'p' tag matching the current user's pubkey
});

test("useProposals should group proposals by author", () => {
  // Test that proposalsByAuthor correctly groups proposals by their author's pubkey
});
```

#### Draft Status Hook (`src/domains/drafts/hooks/useDraftStatus.test.ts`)

```typescript
test("useDraftStatus should initialize with 'unsaved' status when no draft exists", () => {
  // Test that status is 'unsaved' and lastSaved is null when no draft is present
});

test("useDraftStatus should set status to 'saving' when draft is being saved", () => {
  // Test that status is 'saving' when the draftId is in savingDrafts
});

test("useDraftStatus should set status to 'saved' and update lastSaved when a draft is present", () => {
  // Test that status is 'saved' and lastSaved is set to the draft's created_at
});

test("useDraftStatus should set status to 'error' when an error is set", () => {
  // Test that status is 'error' and error is set when setError is called
});

test("useDraftStatus should clear error after timeout", () => {
  // Test that error is cleared after 5 seconds
});

test("useDraftStatus should reset to 'unsaved' if draft is deleted", () => {
  // Test that status returns to 'unsaved' and lastSaved is null if the draft is removed
});
```

#### Draft Store (`src/domains/drafts/stores/draftStore.test.ts`)

```typescript
test("setSavingDraft should add the draft ID to savingDrafts when saving", () => {
  // Test that setSavingDraft adds the draft ID to the savingDrafts array when isSaving is true
});

test("setSavingDraft should remove the draft ID from savingDrafts when not saving", () => {
  // Test that setSavingDraft removes the draft ID from the savingDrafts array when isSaving is false
});

test("setAutosaveSettings should update the autosave settings", () => {
  // Test that setAutosaveSettings updates the autosaveEnabled, autosaveInterval, and autosaveChangeThreshold values
});

test("incrementChangeCount should increment the change count for a draft", () => {
  // Test that incrementChangeCount increases the change count for the specified draft ID
});

test("resetChangeCount should reset the change count for a draft to zero", () => {
  // Test that resetChangeCount sets the change count to 0 for the specified draft ID
});
```

### Feature Layer Tests

#### DraftButton Component (`src/features/long-form-editor/components/DraftButton.test.tsx`)

```typescript
test("DraftButton should display the correct status color based on status", () => {
  // Test that the status indicator has the correct color for each status (unsaved, saving, saved, error)
});

test("DraftButton should display the correct label based on status", () => {
  // Test that the button text is correct for each status
});

test("DraftButton should display the last saved time when available", () => {
  // Test that the tooltip shows the formatted last saved time when a draft exists
});

test("DraftButton should call onSave when clicked", () => {
  // Test that the onSave callback is called when the button is clicked
});

test("DraftButton should be disabled when status is 'saving'", () => {
  // Test that the button is disabled when the status is 'saving'
});
```

#### DraftHistorySidebar Component (`src/features/long-form-editor/components/DraftHistorySidebar.test.tsx`)

```typescript
test("DraftHistorySidebar should not render when isOpen is false", () => {
  // Test that the sidebar is not rendered when isOpen is false
});

test("DraftHistorySidebar should render a list of history items", () => {
  // Test that the sidebar renders all history items from the useDraftHistory hook
});

test("DraftHistorySidebar should call onPreview with the selected item's content when clicked", () => {
  // Test that clicking a history item calls onPreview with the item's content
});

test("DraftHistorySidebar should show preview mode UI when a version is selected", () => {
  // Test that the preview mode UI is shown when isPreviewMode is true
});

test("DraftHistorySidebar should call onRestore when the 'Restore This Version' button is clicked", () => {
  // Test that clicking the restore button calls onRestore with the selected item's content
});

test("DraftHistorySidebar should call onPreview with the original content when 'Exit Preview' is clicked", () => {
  // Test that clicking the exit preview button calls onPreview with the currentContent
});

test("DraftHistorySidebar should display the correct timestamp and labels for each item", () => {
  // Test that each history item shows the correct timestamp and labels (Checkpoint/Proposal)
});
```

#### Editor Draft Hook (`src/features/long-form-editor/hooks/useEditorDraft.test.tsx`)

```typescript
test("useEditorDraft should initialize content from the latest draft", () => {
  // Test that content is initialized from the latest draft's content
});

test("useEditorDraft should track changes when content is updated", () => {
  // Test that handleContentChange updates the content and increments the change count
});

test("useEditorDraft should trigger autosave when change count exceeds threshold", () => {
  // Test that autosave is triggered when the change count exceeds the threshold
});

test("useEditorDraft should trigger autosave based on timer", () => {
  // Test that autosave is triggered when the timer fires
});

test("useEditorDraft should save draft with proposal recipient when in proposal mode", () => {
  // Test that saveDraft adds the proposal recipient tag and encrypts the content when in proposal mode
});

test("useEditorDraft should reset change count after saving", () => {
  // Test that the change count is reset after a successful save
});
```

## Integration Tests

These tests verify that multiple components and hooks work together correctly. They will be written in plain English.

### Draft Creation and Saving Flow

1. Test that when a user creates a new draft and clicks the save button:
   - The content is correctly wrapped in an NDKDraft
   - The draft is published to the configured relays
   - The draft status indicator updates to "Saved"
   - The change counter is reset

2. Test that when a user edits an existing draft:
   - The change counter increments with each change
   - Autosave is triggered after the threshold is reached
   - A checkpoint is created and published
   - The original draft remains unchanged

3. Test that when a user publishes a draft:
   - The draft and all checkpoints are deleted
   - A deletion event (kind 5) is published

### Draft History and Restoration Flow

1. Test that when a user opens the history sidebar:
   - The original content is preserved
   - All checkpoints and the main draft are displayed in chronological order
   - Clicking on a version shows a preview in the editor without modifying the draft
   - Closing the sidebar without restoring returns to the original content

2. Test that when a user restores a version from history:
   - The selected version's content replaces the current content
   - The sidebar closes
   - The draft is saved with the restored content

### Proposal Flow

1. Test that when a user enables proposal mode and selects a recipient:
   - The proposal recipient is stored
   - The draft is encrypted for the recipient when saved
   - The draft includes the recipient's pubkey in a 'p' tag

2. Test that when a user receives a proposal:
   - The proposal appears in their incoming proposals list
   - Opening the proposal decrypts the content
   - The user can edit and publish the proposal under their own account

## End-to-End (E2E) Tests with Playwright

These tests simulate real user interactions with the application. They will be written in plain English.

### Manual Draft Saving

1. Test the manual draft saving flow:
   - Navigate to the editor page
   - Type content into the editor
   - Click the "Save Draft" button
   - Verify the status indicator changes to "Saved"
   - Verify the tooltip shows the correct timestamp
   - Reload the page and verify the content is restored

### Autosave and Checkpoints

1. Test the autosave functionality:
   - Navigate to the editor page with an existing draft
   - Make multiple changes to trigger the autosave threshold
   - Wait for autosave to occur
   - Verify a checkpoint is created (check network requests)
   - Verify the original draft remains unchanged

### Draft History Sidebar

1. Test the history sidebar functionality:
   - Navigate to the editor page with an existing draft that has multiple checkpoints
   - Click the "History" button to open the sidebar
   - Verify all versions are listed with correct timestamps
   - Click on a previous version
   - Verify the editor content changes to show the selected version
   - Verify the preview mode notification is displayed
   - Click "Exit Preview"
   - Verify the original content is restored
   - Click on a version again and click "Restore This Version"
   - Verify the content is updated and the sidebar closes
   - Verify a new save occurs with the restored content

### Proposal Creation and Acceptance

1. Test the proposal creation flow:
   - Navigate to the editor page
   - Create content
   - Enable proposal mode
   - Enter a recipient's npub
   - Save the draft
   - Verify the draft is encrypted and includes the recipient's pubkey
   - Verify the draft appears in the outgoing proposals list

2. Test the proposal acceptance flow:
   - Log in as the recipient user
   - Navigate to the proposals page
   - Verify the incoming proposal is listed
   - Open the proposal
   - Verify the content is decrypted and displayed
   - Make edits to the proposal
   - Publish the proposal
   - Verify it's published under the recipient's account
   - Verify the proposal remains in the list (not auto-deleted)

### Draft Deletion on Publish

1. Test the draft cleanup on publish:
   - Navigate to the editor page with an existing draft that has checkpoints
   - Make final edits
   - Publish the article
   - Verify a deletion event is created for the draft and checkpoints
   - Navigate back to the drafts page
   - Verify the published draft no longer appears in the list