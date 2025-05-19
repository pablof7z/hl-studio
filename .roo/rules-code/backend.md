# Backend API Integration Guidelines

## 1. General Approach

This application follows an **offline-first** and **zero-centralization** philosophy. The backend API is used to persist and synchronize data that cannot be handled purely via Nostr/NDK, such as scheduled posts or user-specific server-side actions. All API interactions are performed through well-defined hooks, ensuring:

- **No global loading flags:** UI should render available data immediately and hydrate as responses arrive.
- **No custom auth context:** Authentication is managed via NDK and passed to API requests as needed.
- **Data consistency:** SWR (stale-while-revalidate) is used for caching and background updates.

## 2. Authenticated API Requests with `useAPI`

All frontend API calls should use the [`useAPI`](src/domains/api/hooks/useAPI.ts) hook. This hook abstracts authentication, error handling, and SWR integration.

**Key points:**
- `useAPI` automatically attaches the user's NDK authentication (e.g., pubkey, signature) to each request.
- It exposes a simple interface for GET, POST, PUT, DELETE, etc.
- It is designed to be composable and used within domain or feature hooks.

**Example:**
```ts
import { useAPI } from "@/domains/api/hooks/useAPI";

const api = useAPI();
const { data, error, mutate } = api.get("/api/posts");
```

## 3. Scheduled Posts: `/api/posts` Endpoint

Scheduled posts are managed via the `/api/posts` REST endpoint. This endpoint supports:

- **GET** `/api/posts`: Fetch all scheduled posts for the authenticated user.
- **POST** `/api/posts`: Create a new scheduled post.
- **PUT** `/api/posts/[id]`: Update an existing scheduled post.
- **DELETE** `/api/posts/[id]`: Remove a scheduled post.

All requests must be authenticated. The backend will verify the user's NDK signature and pubkey.

**Example payload for creating a post:**
```json
{
    "content": "Post body",
    "scheduledAt": "2025-05-20T10:00:00Z"
}
```

## 4. Reading and Writing Examples

**Reading scheduled posts:**
```ts
const api = useAPI();
const { data: posts, error, mutate } = api.get("/api/posts");
// posts is an array of scheduled post objects
```

**Creating a scheduled post:**
```ts
const api = useAPI();
const { mutate } = api.get("/api/posts"); // for SWR revalidation

async function schedulePost(content, scheduledAt) {
    await api.post("/api/posts", { content, scheduledAt });
    mutate(); // revalidate the posts list
}
```

**Updating a scheduled post:**
```ts
await api.put(`/api/posts/${postId}`, { content, scheduledAt });
mutate();
```

**Deleting a scheduled post:**
```ts
await api.delete(`/api/posts/${postId}`);
mutate();
```

## 5. SWR Integration for Caching and Consistency

SWR (stale-while-revalidate) is used under the hood for all API data fetching:

- **Immediate UI updates:** Data is shown from cache instantly, then revalidated in the background.
- **Mutations:** After any write (POST/PUT/DELETE), call `mutate()` to refresh the relevant cache key.
- **No loading flags:** Components should render available data and update reactively as SWR provides new data.

**Pattern:**
- Use the `mutate` function returned by `useAPI().get()` to trigger cache updates after mutations.
- Avoid manual cache management; let SWR handle consistency.

---

**Summary:**  
- Use `useAPI` for all backend communication.
- Always authenticate via NDK; never use custom auth context.
- Use `/api/posts` for all scheduled post operations.
- Rely on SWR for data caching and background revalidation.
- Never use global loading flags; render what exists and hydrate as data arrives.