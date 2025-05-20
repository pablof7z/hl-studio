Home .env file found, loading env from /Users/pablofernandez/.vibe-tools/.env
Packing repository using Repomix...
Packed repository. 278 files. Approximate size 173203 tokens.
Trying provider: gemini
Analyzing repository using gemini-2.5-pro-preview-05-06...
Okay, I've analyzed the repository structure and code. Here's a markdown file detailing potential areas for refactoring, simplification, and improvement, focusing on duplicated code and functionality.

```markdown
# Code Refactoring and Improvement Plan

This document outlines areas in the codebase that exhibit duplication or could benefit from refactoring to improve maintainability, reduce redundancy, and enhance clarity. For each identified issue, a proposed solution or a set of choices is provided.

## Table of Contents

1.  [Duplicate Utility Hooks](#1-duplicate-utility-hooks)
2.  [Duplicate Global CSS Files](#2-duplicate-global-css-files)
3.  [Editor Component Consolidation](#3-editor-component-consolidation)
4.  [Dialog Component Overlap](#4-dialog-component-overlap)
5.  [Table Component Strategy](#5-table-component-strategy)
6.  [Header Component Unification](#6-header-component-unification)
7.  [Sidebar Component Strategy](#7-sidebar-component-strategy)
8.  [Avatar Component Standardization](#8-avatar-component-standardization)
9.  [Editor State Management](#9-editor-state-management)
10. [Import/Export UI Patterns](#10-importexport-ui-patterns)
11. [Minor Component Duplications/Similarities](#11-minor-component-duplicationssimilarities)

---

## 3. Editor Component Consolidation

### Issue:
Several editor-related components exist, potentially with overlapping responsibilities or opportunities for shared base components.
*   `src/components/editor/nostr-editor.tsx`: A complex editor integrating `NostrExtension` and various Tiptap extensions. It includes NodeViews for `nprofile`, `nevent`, `naddr`, and `image`.
*   `src/components/editor/ImageEditor.tsx`: A ReactNodeViewRenderer for images.
*   `src/components/editor/MentionEditor.tsx`: A ReactNodeViewRenderer for nprofile mentions.
*   `src/components/editor/NAddrEditor.tsx`: A ReactNodeViewRenderer for naddr entities.
*   `src/components/editor/NEventEditor.tsx`: A ReactNodeViewRenderer for nevent entities.
*   `src/components/posts/post-editor.tsx`: A more page-level component for creating long-form posts, seems simpler than `NostrEditor`.
*   `src/components/posts/thread-editor/thread-editor.tsx`: A page-level component for creating threads, uses `ThreadPost.tsx`.
*   `src/components/posts/thread-editor/thread-post.tsx`: Component for an individual post within a thread, includes a `Textarea` with mention support.

### Proposed Solution:

**Decision Point: Editor Strategy**

Choose one of the following approaches for editor components:

*   **Option A: Centralize around `NostrEditor`**
    *   **Task:** Refactor `NostrEditor` to be the primary rich text editor.
    *   Adapt `NostrEditor` to be usable by `src/app/editor/post/page.tsx` (LongFormPostPage) and potentially for `ThreadPost` if rich text is desired there.
    *   `PostEditor.tsx` might become a wrapper around `NostrEditor` or be deprecated if `LongFormPostPage` directly uses `NostrEditor`.
    *   `ThreadPost.tsx`'s textarea could be replaced by a simplified `NostrEditor` instance if rich text capabilities are needed, or its mention logic could be harmonized with `NostrEditor`'s mention extension.

*   **Option B: Maintain separate specialized editors but share common parts**
    *   **Task:** Identify common Tiptap extensions, NodeViews, or toolbar functionalities.
    *   Extract shared NodeViews (like the `ImageEditor`, `MentionEditor`, `NAddrEditor`, `NEventEditor`) to ensure they are consistently used.
    *   `NostrEditor` would remain the full-featured editor.
    *   `PostEditor` and `ThreadPost` would use simpler Tiptap instances, but could import specific shared extensions/NodeViews if needed. This might be suitable if `ThreadPost` needs only basic text and mentions, not full rich text.

**Files to check/modify:**
*   `src/components/editor/nostr-editor.tsx`
*   `src/app/editor/post/page.tsx`
*   `src/components/posts/post-editor.tsx`
*   `src/components/posts/thread-editor/thread-editor.tsx`
*   `src/components/posts/thread-editor/thread-post.tsx`

---

## 5. Table Component Strategy

### Issue:
Several components implement tables for displaying data:
*   `src/components/posts/import-export/export-posts-table.tsx`: Table for selecting posts to export.
*   `src/components/posts/posts-table.tsx`: Main table for displaying posts.
*   `src/components/subscribers/subscribers-list.tsx`: Displays subscribers in a table.
*   `src/ui/molecules/DataTable.tsx`: A generic data table component.

There's an opportunity to standardize on a reusable table component.

### Proposed Solution:

**Task:**
1.  Evaluate if `src/ui/molecules/DataTable.tsx` can serve as the base for the other table implementations.
2.  Refactor `ExportPostsTable`, `PostsTable`, and `SubscribersList` to use or extend `DataTable.tsx`.
    *   This might involve making `DataTable.tsx` more flexible (e.g., custom cell renderers, row actions, selection capabilities).
    *   Alternatively, if `DataTable.tsx` is too simple, enhance it or create a more advanced `EnhancedDataTable` component.
3.  Common features like search, filtering, and pagination (if applicable) should be handled consistently, possibly through props passed to the generic table component or via wrapper components.

**Files to check/modify:**
*   `src/ui/molecules/DataTable.tsx`
*   `src/components/posts/import-export/export-posts-table.tsx`
*   `src/components/posts/posts-table.tsx`
*   `src/components/subscribers/subscribers-list.tsx`

---

## 6. Header Component Unification

### Issue:
Multiple header components exist:
*   `src/components/dashboard/dashboard-header.tsx`: Used in dashboard pages, includes heading, text, and children for actions.
*   `src/features/dashboard/components/Header.tsx`: Simpler header with title and optional right content.
*   `src/components/layout/header.tsx`: Main application header with search, notifications, user menu.

### Proposed Solution:

**Decision Point: Header Strategy**

*   **Option A: Single, Configurable Header Component**
    *   **Task:** Create a new, highly configurable `AppHeader` (or similar name) component in `src/components/layout/` or `src/ui/organisms/`.
    *   This component would take props to define its sections (e.g., `title`, `subtitle`, `leftActions`, `rightActions`, `breadcrumbs`).
    *   Refactor `DashboardHeader`, `features/dashboard/components/Header.tsx`, and parts of `layout/header.tsx` to use this unified component.

*   **Option B: Distinguish Page-Specific Headers from Main Layout Header**
    *   **Task:**
        1.  Keep `src/components/layout/header.tsx` as the main application-wide header.
        2.  Consolidate `src/components/dashboard/dashboard-header.tsx` and `src/features/dashboard/components/Header.tsx` into a single, reusable `PageHeader` component (e.g., in `src/components/layout/` or `src/ui/molecules/`). This `PageHeader` would be used for section titles and actions within main content areas.

**Files to check/modify:**
*   `src/components/dashboard/dashboard-header.tsx`
*   `src/features/dashboard/components/Header.tsx`
*   `src/components/layout/header.tsx`

---

## 7. Sidebar Component Strategy

### Issue:
Several sidebar components are present:
*   `src/components/layout/sidebar.tsx`: Main application navigation sidebar.
*   `src/components/settings/settings-sidebar.tsx`: Navigation specific to settings pages.
*   `src/components/posts/thread-editor/thread-sidebar.tsx`: Sidebar for thread drafts, scheduled, posted.
*   `src/ui/organisms/Sidebar.tsx`: A very basic generic sidebar wrapper.
*   `src/components/ui/sidebar.tsx`: A complex, resizable, and cookie-aware sidebar system (seems to be the most advanced one, likely from ShadCN/UI or a similar library/template).

### Proposed Solution:

**Task:**
1.  **Adopt `src/components/ui/sidebar.tsx` as the primary sidebar system.** This component is feature-rich and seems intended for general use.
2.  Refactor other sidebar implementations (`layout/sidebar.tsx`, `settings/settings-sidebar.tsx`, `thread-editor/thread-sidebar.tsx`) to utilize the primitives or structure provided by `src/components/ui/sidebar.tsx`.
    *   For `layout/sidebar.tsx` (main navigation), its content can be structured using `SidebarMenu`, `SidebarMenuItem`, etc., from the advanced sidebar system.
    *   `settings/settings-sidebar.tsx` can also be rebuilt using these primitives.
    *   `thread-editor/thread-sidebar.tsx` might use it as a container if its layout fits, or remain custom if its structure is too unique but should still adhere to consistent styling.
3.  Deprecate or refactor the very basic `src/ui/organisms/Sidebar.tsx` if `src/components/ui/sidebar.tsx` covers its use cases.

**Files to check/modify:**
*   `src/components/ui/sidebar.tsx` (Review its API and ensure it's suitable as the base)
*   `src/components/layout/sidebar.tsx`
*   `src/components/settings/settings-sidebar.tsx`
*   `src/components/posts/thread-editor/thread-sidebar.tsx`
*   `src/ui/organisms/Sidebar.tsx`

---

## 9. Editor State Management

### Issue:
State related to editor functionalities, particularly for the long-form editor and its settings/confirmation modal, appears to be managed in two places:
*   `src/domains/editor/stores/editorStore.ts`: Contains `showConfirmation`, `isScheduled`, `isEarlyAccess`.
*   `src/features/long-form-editor/stores/index.ts` (and `types.ts`, `actions.ts`): Defines a more comprehensive `EditorStore` for content, title, summary, tags, publishedAt, zapSplits, and modal UI state (`isSettingsModalOpen`, `activeSettingsTab`). It also re-initializes a `showConfirmation` property.

This can lead to confusion and inconsistencies.

### Proposed Solution:

**Task:**
1.  **Consolidate editor state into `src/features/long-form-editor/stores/index.ts`**. This store already has a more complete definition for editor-related data.
2.  Remove `showConfirmation`, `isScheduled`, `isEarlyAccess` from `src/domains/editor/stores/editorStore.ts`. If `editorStore.ts` has no other unique responsibilities after this, consider deprecating it entirely.
3.  Ensure that all components related to the long-form editor workflow (including `NostrEditor` when used for articles, `SettingsModal`, `ConfirmationDialog`, `LongFormPostPage`) use the consolidated store from `src/features/long-form-editor/stores/`.
4.  The properties `isScheduled` and `isEarlyAccess` are also present as UI toggles in `SchedulingOptions.tsx` and used in `AudienceSelection.tsx`. These should be driven by the consolidated editor store.

**Files to check/modify:**
*   `src/features/long-form-editor/stores/index.ts` (and related files `actions.ts`, `types.ts`)
*   `src/app/editor/post/page.tsx` (LongFormPostPage)
*   `src/components/posts/ConfirmationDialog.tsx`
*   `src/features/long-form-editor/components/SchedulingOptions.tsx`
*   `src/features/long-form-editor/components/AudienceSelection.tsx`

---

## 10. Import/Export UI Patterns

### Issue:
The UI for importing posts (`src/components/posts/import-export/import-posts.tsx`) and importing subscribers (`src/components/subscribers/import-subscribers.tsx`) share similar steps:
1.  Source selection / File upload.
2.  Configuration options.
3.  Preview step (for posts, `ImportPreview.tsx`).
4.  Importing/Progress state.
5.  Completion state.

While `ExportPosts.tsx` is different, the import UIs have potential for shared logic or structure.

### Proposed Solution:

**Decision Point: Import UI Abstraction**

*   **Option A: Create a Generic ImportWorkflow Component**
    *   **Task:** Design a `<ImportWorkflow />` component that manages the multi-stage import process (file selection, options, preview, progress, completion).
    *   This component would take props for stage-specific content/renderers (e.g., `renderFileSelector`, `renderOptionsForm`, `renderPreviewTable`, `handleImportFunction`).
    *   Refactor `ImportPosts.tsx` and `ImportSubscribers.tsx` to use this generic workflow component.

*   **Option B: Shared Hooks and Helper Components**
    *   **Task:** Identify common logic (e.g., file handling, progress simulation, state management for stages) and extract it into reusable hooks (e.g., `useImportProcess`).
    *   Create smaller, shared UI components for common elements like progress bars with messages, completion summaries, or file dropzones, if not already covered by ShadCN.
    *   `ImportPosts.tsx` and `ImportSubscribers.tsx` would retain their overall structure but use these shared utilities.

**Files to check/modify:**
*   `src/components/posts/import-export/import-posts.tsx`
*   `src/components/posts/import-export/import-preview.tsx`
*   `src/components/subscribers/import-subscribers.tsx`

---

## 11. Minor Component Duplications/Similarities

### Issue: `ScheduleIndicator.tsx` and `TimePickerDemo.tsx`
*   `src/components/posts/schedule-indicator.tsx`: Displays scheduled information in a badge with a tooltip.
*   `src/components/posts/time-picker.tsx`: A simple time input component.
*   The `ConfirmationDialog` has its own date/time picker logic using ShadCN `Calendar` and `TimePickerDemo`.
*   `PostScheduleDialog` also has its own date/time picker logic.

### Proposed Solution:

**Task:**
1.  Ensure `TimePickerDemo` is the standard component for time selection across dialogs.
2.  Review if `ScheduleIndicator`'s functionality is needed in multiple places or if its display logic can be standardized for scheduled items (e.g., in tables or list views).
3.  The combination of ShadCN `Calendar` + `TimePickerDemo` is a good pattern. Consolidate any custom date/time picking logic to use this combination.

**Files to check/modify:**
*   `src/components/posts/ConfirmationDialog.tsx`
*   `src/components/posts/post-schedule-dialog.tsx`
*   `src/components/posts/time-picker.tsx`
*   `src/components/schedule/schedule-calendar.tsx` (uses `PostScheduleDialog`)

---

This plan should provide a good starting point for refactoring and improving the codebase. Remember to test thoroughly after each significant change.
```

## Relevant Files List:

Based on the analysis and the requested refactoring plan, here's a list of files that are most relevant to addressing the identified issues of duplicated code and functionality:

*   `src/hooks/use-toast.ts`
*   `src/components/ui/use-toast.ts`
*   `src/hooks/use-mobile.tsx`
*   `src/components/ui/use-mobile.tsx`
*   `src/styles/globals.css`
*   `styles/globals.css`
*   `src/app/globals.css`
*   `tailwind.config.ts`
*   `src/components/editor/nostr-editor.tsx`
*   `src/components/editor/NAddrEditor.tsx`
*   `src/app/editor/post/page.tsx`
*   `src/components/posts/post-editor.tsx`
*   `src/components/posts/thread-editor/thread-editor.tsx`
*   `src/components/posts/thread-editor/thread-post.tsx`
*   `src/components/posts/ConfirmationDialog.tsx`
*   `src/components/posts/post-schedule-dialog.tsx`
*   `src/ui/molecules/DataTable.tsx`
*   `src/components/posts/import-export/export-posts-table.tsx`
*   `src/components/posts/posts-table.tsx`
*   `src/components/subscribers/subscribers-list.tsx`
*   `src/components/dashboard/dashboard-header.tsx`
*   `src/features/dashboard/components/Header.tsx`
*   `src/components/layout/header.tsx`
*   `src/components/layout/sidebar.tsx`
*   `src/components/settings/settings-sidebar.tsx`
*   `src/components/posts/thread-editor/thread-sidebar.tsx`
*   `src/ui/organisms/Sidebar.tsx`
*   `src/components
