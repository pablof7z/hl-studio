# 🏗️ Project Architecture & Nostr/NDK Integration Blueprint — v4

## 0. First Principles

* **Zero centralisation.** Identity & data live in NDK hooks — no custom auth context.
* **Offline‑first.** Never store `loading` flags. Render what exists; let subscriptions hydrate.
* **NDK singleton.** One instance, boot in `src/ndk/`, accessed via `const { ndk } = useNDK()`.

---

## 1. Mental Model for File Organisation (🚦)

There are **two axes**:

1. **Domain (entity)‑centric** code → `src/domains/` (re‑usable data hooks, stores, types).
2. **UI feature‑centric** code → `src/features/` (screen‑specific UI flows).

> **Rule of thumb:** *If code is reused across screens, put it in **domain**; if it’s only useful for one flow, put it in **feature**.*

> NEVER create files before they are actually needed, for example, don't create a types.ts file just because, or a stores dir. Only create parts of the structure that are actually needed.

### 1.1 Domain skeleton

```text
src/domains/<entity>/
├── hooks/         # data‑fetching hooks (e.g. useArticles)
├── stores/        # Zustand/Jotai caches specific to the entity
├── types.ts       # zod schemas / TS models
└── index.ts       # barrel – public surface
```

*No React components here.*

### 1.2 Feature skeleton

Only pull stores when strictly necessary, don't overengineer solutions, only pull state into stores when strictly necessary and clearly more convenient, otherwise just use local `useState` inside of components.

```text
src/features/<feature>/
├── components/    # UI only – dumb visuals
├── hooks/         # UI logic (compose domain hooks)
├── stores/        # transient UI state (filters, toggles)
├── index.ts       # barrel
```

## 6. Data Fetching Pattern (domain example)

```tsx
// domains/articles/hooks/useArticles.ts
export function useArticles(limit = 100) {
    return useSubscribe<NDKArticle>([
        { kinds: [NDKKind.Article], limit }
    ], { wrap: true }, [limit]);
}

// features/feed/components/ArticleFeed.tsx
import { useArticles } from "@/domains/articles";

const { events: articles } = useArticles();
return (
    <ul>
        {articles.map(a => <ArticleCard key={a.tagId()} article={a} />)}
    </ul>
);
```

*Child `ArticleCard` pulls author profile via `useProfileValue(pubkey)`. Prefetch at leaf components; NDK merges filters automatically.*

---

Target size: **≤120 LOC per file**.

---

## 8. Design‑system Guidelines

* **Atoms**: Button, Avatar, Badge.
* **Molecules**: DataTable, Modal.
* **Organisms**: Sidebar, Header.
* Barrel export in `ui/index.ts`:

  ```ts
  export * from "./atoms";
  export * from "./molecules";
  export * from "./organisms";
  ```
* Absolutely **no business logic** in design-system.

---

## 9. Coding & Tooling Standards

| Area            | Decision                                                 |
| --------------- | -------------------------------------------------------- |
| Indent          | **4 spaces**, never tabs                                 |
| Naming          | `PascalCase.tsx` for components, `useCamel.ts` for hooks |
| Linting         | `typescript-eslint` + stylistic; CI fails on error       |
| Testing         | Vitest + React Testing Library; colocate `*.test.tsx`    |
| Package manager | Bun (`bun.lockb` committed)                              |
| CI              | `bun test` & `next build` GitHub Action                  |
| Formatting      | Prettier (tabWidth 4, printWidth 100)                    |

---

## 10. Anti‑Patterns (🚫 never do this)

| 🚫                                  | Why                                               |
| ----------------------------------- | ------------------------------------------------- |
| React Context for auth/ndk          | ndk-hooks exposes `useNDK()`; duplication = waste |
| Global `loading` flags              | Nostr is offline‑first; render partial data       |
| `useEvents`, `nostr-tools`          | Outdated; always use `useSubscribe` or `useEvent` |
| Manual relay retry/back‑off         | Handled by NDK internals                          |
| Awaiting `event.publish()`          | UI shouldn't block; optimistic cache              |
| Sorting events after `useSubscribe` | Already sorted; wasted compute                    |
---

When in doubt: **domain first, feature second**.

