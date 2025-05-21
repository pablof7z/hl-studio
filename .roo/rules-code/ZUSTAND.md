Use Zustand slices pattern:

1. Create one slice per domain:
   - Filename: `slices/[name].ts`
   - Export: interface `[Name]Slice` + `create[Name]Slice` function.
   - Signature: `(set, get) => ({ state, actions })`.

2. Define the `Store` type by combining slices.

3. In main store (`index.ts`), combine slices explicitly:
   ```ts
   export const useStore = create<Store>((...args) => ({
       ...createUserSlice(...args),
       ...createPostSlice(...args),
   }));
Write concise, strongly-typed code.