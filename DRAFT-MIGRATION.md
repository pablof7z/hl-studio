# Draft Saving and Retrieval in the App

This document explains in detail how draft saving and retrieval works in the application, including:
- NIP-37 _draft_ vs. _checkpoint_ kinds and their numeric specifications
- How drafts are serialized, encrypted, and published via NDKDraft
- Manual and automated saving flows in Svelte PostState / ArticleState
- How events are stored on Nostr relays and retrieved
- Deletion of drafts and checkpoints on final publish
- Draft status indicator: design, colors, and behavior

---

## 1. Draft Kinds and Numeric Specs

- **NDKKind.DraftCheckpoint** (kind 1234): non-replaceable checkpoint
  - Kinds &lt; 10000 in Nostr are non-editable; each save produces a new event
  - Builds an append-only history of incremental saves for undo/history
  - No `d` tag; queries use `#a` (anchor) tag referencing the primary draft ID

- **NDKKind.Draft** (kind 31234): replaceable draft
  - Kinds between 30000–40000 are editable using a `d` (document) tag
  - The `d` tag value is the draft identifier (e.g. article ID, or UUID)
  - Only the newest event per author+`d` tag is retained by relays

### NDKDraft Internals

To generate a draft event simply do:

const draft = new NDKDraft(ndk);
draft.event = eventToBeSavedAsDraft (NDKEvent)


NDKDraft wraps an underlying NDKEvent for NIP-37 drafts:
```ts
class NDKDraft extends NDKEvent {
  constructor(ndk: NDK, rawEvent?: NostrEvent|NDKEvent) {
    super(ndk, rawEvent);
    this.kind ||= NDKKind.Draft;    // default to kind=31234 replaceable draft
  }
  set event(e: NDKEvent | NostrEvent) { ... }        // serializes and tags the draft
  async save(opts: { publish?: boolean; signer?; relaySet? }) {
    // encrypt payload and publish to relays (or skip publish=false)
  }
  async getEvent() { ... }    // decrypts JSON payload back into NDKEvent
}
```

Key tags on a save:
- `["k", "<orig-kind>"]` &nbsp;– original event kind (e.g. 30023)
- `["p", "<pubkey>"]` &nbsp;– optional recipient (for proposals)

---

## 2. Saving Flow

### Manual Save (primary draft)
1. User clicks **Save draft**  (DraftButton.svelte)
2. Calls `postState.saveDraft(true)`
3. In `ArticleState.saveDraft(true)`:
   - Check if a prior draft exists (`draftExisted`)
   - Generate a new `NDKDraft` wrapping `generateEvent()`
   - If an existing draft: copy its `d` tag onto the new draft
   - `await draft.save({ publish: true })` → updates/overwrites replaceable draft
   - Store `postState.draft = draft`; reset change counter

### Automated Save (checkpoints)
1. Editor tracks `stateSignature` changes; auto-save triggers after 5 s inactivity or >500 changes
2. DraftButton’s `save(false)` runs when:
   - There is an existing primary draft, and
   - Change count exceeds small autosave threshold (100), or timer fires
3. In `ArticleState.saveDraft(false)`:
   - Recognize `isCheckpoint` (existing draft + not manual)
   - Generate new `NDKDraft` wrapping `generateEvent()`
   - **Do not** copy `d` tag; instead set checkpoint flag → uses kind=1234 internally
   - `await draft.save({ publish: true })` → publishes a new non-replaceable checkpoint
   - Primary draft remains unchanged

---

## 3. Storage and Retrieval on Nostr

- **Relays**: saved drafts/checkpoints go to user-configured `appState.draftRelays` (via `publish(relaySet)`)
- **Live history**: History modal subscribes with:
  ```ts
  ndk.$subscribe([
    { kinds: [NDKKind.DraftCheckpoint], ...draft.filter() },
    { kinds: [NDKKind.Draft], "#a" },
  ], undefined, NDKDraft)
  ```
- **Ordering**: sorted by `created_at` descending to list newest saves first

---

## 4. Cleanup on Final Publish

When the article/event is finally published:
1. Fetch all checkpoint events (kind=1234) for `#a` = draft ID, `authors` = draft.pubkey
2. Delete the replaceable draft: `await draft.delete()`
3. If checkpoints exist:
   - Construct an EventDeletion (kind=5) tagging each checkpoint
   - Sign & publish deletion to remove old checkpoints from relays

---

## 5. Draft Status Indicator (UI)
Component: **DraftButton.svelte** (`src/lib/components/buttons/Draft/DraftButton.svelte`)

### States & Colors
- Unsaved:
  - Dot: `bg-gray-500`
  - Label: “Unsaved”
  - Tooltip: “Click to save”
- Saving:
  - Dot: `bg-yellow-500`
  - Label: “Saving”
- Saved:
  - Dot: `bg-green-500`
  - Label: “Saved”
  - If a draft exists: shows small timestamp via `<RelativeTime event={draft} />`
- Error:
  - Dot: `bg-red-500`
  - Label: “Error”

### Layout & Behavior
- Tailwind dot: `<div class="h-2 w-2 rounded-full bg-..."></div>` (8×8 px)
- Status text next to dot
- Wrapped in tooltip (`@components/ui/tooltip`) showing “Save draft”
- Click runs manual save (`save(true)`); autosaves run via timers in `<script>`

---
## 6. Proposals System

This section explains how the app’s proposal feature works — sending a draft privately to another user for review and potential publication under their account.

### 6.1 Differentiating Drafts vs. Proposals
- **Draft**: An NDKKind.Draft event with no `['p', …]` tag, or whose `['p', <pubkey>]` tag equals its own `pubkey`. These are private drafts the author edits personally.
- **Proposal**: An NDKKind.Draft event containing a `['p', '<recipient-pubkey>']` tag where `<recipient-pubkey> !== event.pubkey`. Indicates the draft is addressed to another user.

#### Incoming vs. Outgoing Proposals
- **Outgoing Proposal** (you sent it):
  ```ts
  draft.pubkey === currentUser.pubkey
  && draft.tagValue('p') !== currentUser.pubkey
  ```
- **Incoming Proposal** (you received it):
  ```ts
  draft.pubkey !== currentUser.pubkey
  && draft.tagValue('p') === currentUser.pubkey
  ```

### 6.2 Kinds & Tags for Proposals
- **NDKKind.Draft** (kind 31234) with tags:
  - `['k', '<orig-kind>']` — original event kind (e.g. Article)
  - `['d', '<draft-id>']` — replaceable draft identifier
  - `['p', '<recipient-pubkey>']` — target recipient

### 6.3 State & UI
- **postState.proposalRecipient** (Hexpubkey | undefined)
  - Set in **ProposalMode.svelte** (src/lib/components/Post/Shell/ProposalMode.svelte)
  - Cleared via **Disable Proposal Mode** or after acceptance
- **ProposalMode.svelte**
  - Lets user enter NIP-19 (npub/nprofile) or NIP-05 to pick recipient
  - Writes `postState.proposalRecipient`
- **Header.svelte** toggles proposal mode and shows current recipient avatar
- **Finalize/Modal.svelte** adapts the final publish button to “Send proposal to <Name>” when `proposalRecipient` is set

### 6.4 Publish Flow (Sending a Proposal)
In **PostState.publish()**:
```ts
if (this.proposalRecipient) {
  // 1. Build a draft wrapping generateEvent()
  const draft = this.generateDraft();
  // 2. Lookup the NDKUser for the proposalRecipient pubkey
  const recipientUser = this.getRecipient();
  // 3. Save & encrypt the draft for the recipient
  await draft.save({ publish: true, recipient: recipientUser });
  return [draft];
}
```
- **NDKDraft.save({ recipient, publish })**
  - Internally sets `event.recipientPubkey = recipient.pubkey` (adds `['p', pubkey]`)
  - Encrypts `content` for the recipient via NIP-44/NIP-04
  - Publishes to the configured draft relays

### 6.5 Delivery & Subscription
- **Outbound proposals** (sent by you): filter your own drafts with a `p` tag not matching you
- **Inbound proposals** (received by you): subscribe to Drafts where `#p` = your pubkey
  ```ts
  inbound = ndk.$subscribe(
    [{ kinds: [NDKKind.Draft], '#k': [NDKKind.Article.toString()], '#p': [user.pubkey] }],
    undefined,
    NDKDraft
  );
  ```
- All proposals are listed under the “Proposed” tab in the main Posts page

### 6.6 Opening & Accepting a Proposal
1. Click a proposal → navigate to `/article/${draft.encode()}`
2. **ArticleState.from(event: NDKEvent)**:
   - Wraps in `NDKDraft.from(event)`
   - `await draft.getEvent()` → decrypts and returns inner Article event
   - Calls `ArticleState.from(innerEvent)` to populate editor fields
   - Sets `state.draft = draft`
3. User reviews/edits, then publishes normally (proposalRecipient cleared)
4. Standard publish flow invokes `deleteDrafts()` to remove the primary draft & checkpoints

### 6.7 Cleanup Behavior
- **deleteDrafts()** only removes replaceable drafts (31234) and non-replaceable checkpoints (1234)
- **Proposals** remain on relays unless manually deleted; they are not auto-cleaned on send or accept

Here is the full set of source files of the original svelte codebase. (and one NDK wrapper) that implement every piece
  of draft-and-proposal functionality in the app.

  This is provided to you AS REFERENCE only, you are not supposed to change this code, only consult it whenever you need help understanding how things work.
    
     I’ve organized them by category:

        1. App-wide state & configuration
           • reference-implementation-DONT-CHANGE/src/lib/state/app.svelte.ts
             – Defines `appState.draftRelays` (which relays to use for saving drafts)
           • reference-implementation-DONT-CHANGE/src/lib/components/Settings/Relays.svelte
             – UI for the user to pick their draft-relay list
        2. Low-level NDK “draft” wrapper:
           • node_modules/@nostr-dev-kit/ndk/src/events/kinds/drafts.ts
             – The `NDKDraft` class: sets `kind=31234`, handles `d` tag,
    encryption/decryption and `.save()`/`.getEvent()`
        3. Core draft/proposal logic (“model” / state classes)
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/state/index.svelte.ts
             – `PostState` base: stubs out `saveDraft()`, implements `publish()` including
     proposal branch, and `deleteDrafts()` cleanup
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/state/article.svelte.ts
             – `ArticleState` subclass: `generateDraft()`, `saveDraft(manual)` with
    checkpoint logic, `generateEvent()`, and populating `state.proposalRecipient` when
    loading a proposal
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/state/article.svelte.test.ts
             – Unit tests for draft generation, tagging a proposal recipient, and proposal
     re-saving behavior
        4. Draft-saving UI / button
           • reference-implementation-DONT-CHANGE/src/lib/components/buttons/Draft/DraftButton.svelte
             – “Save” / autosave button: timers, change thresholds, status indicators,
    calls `postState.saveDraft(manual)`
        5. Editor “shell” and modals
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/Shell/index.svelte
             – Wires up Header, Article, Footer, plus Settings/History/Finalize modals;
    handles `onSaveDraft()` (update URL) and `onPublish()` (toast/link logic for
    proposals)
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/Shell/Header.svelte
             – Top bar: Back button, DraftButton, “⋮” menu with Proposal Mode entry
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/Shell/Article.svelte
             – The actual rich‐text editor UI (Tiptap) bound to `postState.content` etc.
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/Shell/Footer.svelte
             – Bottom bar: History & Settings toggles
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/Shell/History/Modal.svelte
             – Fetch & display all checkpoints (kind 1234) + primary draft (kind 31234)
    via `ndk.$subscribe(...)`, preview + “Restore”
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/Shell/ProposalMode.svelte
             – Proposal setup modal: enter npub/nprofile/NIP-05, sets
    `postState.proposalRecipient`
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/Shell/Finalize/Modal.svelte
             – Final publish modal: when `proposalRecipient` is set it says “Send proposal
     to <Name>” and invokes the proposal branch of `publish()`
           • reference-implementation-DONT-CHANGE/src/lib/components/Post/Shell/Settings/Modal.svelte
             – Advanced per-draft settings (not draft-specific but lives in the Shell
    stack)
        6. List-view integration
           • reference-implementation-DONT-CHANGE/src/lib/components/lists/Draft.svelte
             – Renders a single draft/proposal item in lists (used by the main posts page)

           • reference-implementation-DONT-CHANGE/src/routes/(app)/+page.svelte
             – Subscribes to three draft streams via `ndk.$subscribe` for: your drafts,
    inbound proposals (`#p = you`), outbound proposals (`author = you ∧ p ≠ you`), and
    displays them under the “Drafts” and “Proposed” tabs
        7. Utilities
           • reference-implementation-DONT-CHANGE/src/lib/utils/wrapEvent.js
             – Helper used in History modal (and other list items) to take an
    `NDKEvent`/`NDKDraft` and unwrap its inner content for rendering

    Together, these files cover:

    – How drafts (replaceable) and checkpoints (append-only) are created, encrypted,
    published, and cleaned up
    – UI for manual vs. auto-save with status indication
    – Full history modal showing past checkpoints
    – Proposal mode: UI for picking a recipient, embedding a ['p', pubkey] tag, encrypting
     for that user, and subscribing to inbound vs. outbound proposals
    – Final publish flow branching for proposals vs. normal posts
    – Cleanup and listing of drafts/proposals in the main posts dashboard