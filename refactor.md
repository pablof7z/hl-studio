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

## 1. Duplicate Utility Hooks

### Issue:
There are two versions of `useToast` and `useIsMobile` hooks.

*   `src/hooks/use-toast.ts` and `src/components/ui/use-toast.ts`
*   `src/hooks/use-mobile.tsx` and `src/components/ui/use-mobile.tsx`

The versions in `src/components/ui/` seem to be the more complete implementations, likely from ShadCN. The ones in `src/hooks/` might be earlier or simpler versions.

### Proposed Solution:

**Task:**
1.  Verify which implementation of `useToast` and `useIsMobile` is currently used and preferred (likely the ones in `src/components/ui/`).
2.  Remove the unused/simpler versions from `src/hooks/`.
3.  Update all import paths to point to the canonical version.

**Files to check/modify:**
*   `src/hooks/use-toast.ts` (potentially remove)
*   `src/components/ui/use-toast.ts` (keep)
*   `src/hooks/use-mobile.tsx` (potentially remove)
*   `src/components/ui/use-mobile.tsx` (keep)
*   All files importing these hooks.

---

## 2. Duplicate Global CSS Files

### Issue:
There are two global CSS files:
*   `src/styles/globals.css`
*   `styles/globals.css` (root level)

The `tailwind.config.ts` references `app/globals.css` (which implies `src/app/globals.css`, likely a typo and should be `src/globals.css` or `styles/globals.css`). The `src/app/globals.css` file contains Tailwind directives and TipTap editor styling, while `src/styles/globals.css` contains more general global styles and font imports. The root `styles/globals.css` also contains Tailwind directives and some base styles.

### Proposed Solution:

**Task:**
1.  Consolidate all global styles into a single file, preferably `src/app/globals.css` as it's referenced by Tailwind configuration.
2.  Ensure Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) are present at the top of the chosen file.
3.  Move font imports and other base styles from `src/styles/globals.css` and `styles/globals.css` into the consolidated file.
4.  Delete the redundant global CSS files (`src/styles/globals.css` and `styles/globals.css` if `src/app/globals.css` is chosen as canonical).
5.  Update `tailwind.config.ts` if necessary to point to the correct canonical global CSS file.

**Files to check/modify:**
*   `src/app/globals.css` (likely the canonical one)
*   `src/styles/globals.css` (potential duplicate)
*   `styles/globals.css` (potential duplicate)
*   `tailwind.config.ts` (for CSS path)
*   `src/app/layout.tsx` (for CSS import)

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

The `NostrEditor` in `src/components/editor/nostr-editor.tsx` defines an inline `NAddrNodeView` which seems to be a simplified version of `src/components/editor/NAddrEditor.tsx`.

### Proposed Solution:

**Decision Point: Editor Strategy**

Choose one of the following approaches for editor components:

*   **Option A: Centralize around `NostrEditor`**
    *   **Task:** Refactor `NostrEditor` to be the primary rich text editor.
    *   Replace the inline `NAddrNodeView` in `nostr-editor.tsx` with the more complete `src/components/editor/NAddrEditor.tsx`.
    *   Adapt `NostrEditor` to be usable by `src/app/editor/post/page.tsx` (LongFormPostPage) and potentially for `ThreadPost` if rich text is desired there.
    *   `PostEditor.tsx` might become a wrapper around `NostrEditor` or be deprecated if `LongFormPostPage` directly uses `NostrEditor`.
    *   `ThreadPost.tsx`'s textarea could be replaced by a simplified `NostrEditor` instance if rich text capabilities are needed, or its mention logic could be harmonized with `NostrEditor`'s mention extension.

*   **Option B: Maintain separate specialized editors but share common parts**
    *   **Task:** Identify common Tiptap extensions, NodeViews, or toolbar functionalities.
    *   Extract shared NodeViews (like the `ImageEditor`, `MentionEditor`, `NAddrEditor`, `NEventEditor`) to ensure they are consistently used.
    *   `NostrEditor` would remain the full-featured editor.
    *   `PostEditor` and `ThreadPost` would use simpler Tiptap instances, but could import specific shared extensions/NodeViews if needed. This might be suitable if `ThreadPost` needs only basic text and mentions, not full rich text.

**Specific Task (Regardless of A or B):**
1.  Resolve the `NAddrNodeView` duplication:
    *   Remove the inline `NAddrNodeView` from `src/components/editor/nostr-editor.tsx`.
    *   Ensure `NostrEditor` uses the `src/components/editor/NAddrEditor.tsx` component as its NodeViewRenderer for `naddr` entities.

**Files to check/modify:**
*   `src/components/editor/nostr-editor.tsx`
*   `src/components/editor/NAddrEditor.tsx`
*   `src/app/editor/post/page.tsx`
*   `src/components/posts/post-editor.tsx`
*   `src/components/posts/thread-editor/thread-editor.tsx`
*   `src/components/posts/thread-editor/thread-post.tsx`

---

## 4. Dialog Component Overlap

### Issue:
Two dialog components manage post publishing/scheduling with some overlapping functionality:
*   `src/components/posts/ConfirmationDialog.tsx`: Handles title, summary, tags, hero image, audience, and scheduling. It can POST to `/api/posts`.
*   `src/components/posts/post-schedule-dialog.tsx`: More focused on scheduling details (date, time, timezone, distribution, audience).

The `ConfirmationDialog` appears to be more comprehensive for pre-publish settings, while `PostScheduleDialog` is specifically for scheduling. `LongFormPostPage` uses `ConfirmationDialog`.

### Proposed Solution:

**Decision Point: Dialog Strategy**

*   **Option A: Consolidate into `ConfirmationDialog`**
    *   **Task:** Enhance `ConfirmationDialog` to fully cover all scheduling options from `PostScheduleDialog`.
    *   Deprecate `PostScheduleDialog`.
    *   Update all call sites (e.g., `ScheduleCalendar`, `ThreadEditor`) to use `ConfirmationDialog`. This dialog would need to be flexible enough to handle contexts where only scheduling is needed vs. full pre-publish confirmation.

*   **Option B: Clear Separation of Concerns**
    *   **Task:**
        1.  Refine `ConfirmationDialog` to focus solely on content metadata confirmation (title, summary, tags, hero image, audience for *immediate publish*).
        2.  Refine `PostScheduleDialog` to be the definitive component for *all* scheduling actions, potentially taking initial content metadata as props if needed for display.
        3.  `ConfirmationDialog` could optionally trigger `PostScheduleDialog` if "Schedule for later" is chosen.
        4.  Ensure the `ConfirmationDialog`'s internal API POST logic is robust or defers to a dedicated action/hook.

*   **Option C: Modular Dialog Composition**
    *   **Task:** Break down dialog functionalities into smaller, reusable components (e.g., `ScheduleDateTimeSelector`, `AudienceSelector`, `SocialPreviewEditor`).
    *   Compose these smaller parts within `ConfirmationDialog` and/or `PostScheduleDialog` as needed.
    *   This offers maximum flexibility but might be overkill if the use cases aren't diverse enough.

**Specific Task (Consider for Option B or C):**
1.  The `ConfirmationDialog.tsx` directly uses `useAPI` for posting.
    *   **Recommendation:** Abstract this API call into a dedicated server action (e.g., in `src/actions/post-actions.ts`) or a domain-specific hook for better separation of concerns and reusability. This aligns with the backend interaction guidelines.

**Files to check/modify:**
*   `src/components/posts/ConfirmationDialog.tsx`
*   `src/components/posts/post-schedule-dialog.tsx`
*   `src/app/editor/post/page.tsx`
*   `src/components/schedule/schedule-calendar.tsx` (uses `PostScheduleDialog`)
*   `src/components/posts/thread-editor/thread-editor.tsx` (uses `PostScheduleDialog`)

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

## 8. Avatar Component Standardization

### Issue:
Multiple Avatar components exist:
*   `src/components/ui/avatar.tsx`: ShadCN UI Avatar component (`Avatar`, `AvatarImage`, `AvatarFallback`).
*   `src/ui/atoms/Avatar.tsx`: A custom, simpler `img`-based avatar.
*   `src/features/nostr/components/user/UserAvatar.tsx`: Uses the ShadCN Avatar and fetches profile info for a Nostr pubkey.

### Proposed Solution:

**Task:**
1.  **Standardize on `src/components/ui/avatar.tsx` (ShadCN version) as the base.**
2.  Refactor `src/features/nostr/components/user/UserAvatar.tsx` to ensure it correctly uses the ShadCN `Avatar` primitives if it's not already doing so perfectly. It should encapsulate the logic for displaying a Nostr user's avatar including fallback to initials.
3.  Deprecate the custom `src/ui/atoms/Avatar.tsx`.
4.  Update all usages of avatars to use either the base ShadCN `Avatar` or the specialized `UserAvatar` for Nostr users.

**Files to check/modify:**
*   `src/ui/atoms/Avatar.tsx` (to be deprecated)
*   `src/components/ui/avatar.tsx` (canonical base)
*   `src/features/nostr/components/user/UserAvatar.tsx` (canonical for Nostr users)
*   All files currently importing `src/ui/atoms/Avatar.tsx`.

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
*   `src/domains/editor/stores/editorStore.ts` (likely to be removed or significantly reduced)
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
