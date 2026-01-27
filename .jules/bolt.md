## 2024-05-23 - N+1 Frontend Optimization
**Learning:** Checking user state (liked/bookmarked) individually for each item in a list creates a massive N+1 performance bottleneck on the client-side, especially when using a backend-as-a-service like Supabase where each check is an HTTP request.
**Action:** Always batch these checks. Fetch all relevant IDs for the current user in a single query (e.g., `WHERE id IN (...)`) and use a `Set` or `Map` on the client to perform O(1) lookups during rendering.

## 2024-05-23 - Count Optimization
**Learning:** Fetching all related records (e.g., `select('*')`) just to count them (`.length`) is incredibly wasteful of bandwidth and memory.
**Action:** Use `select('*', { count: 'exact', head: true })` or `select('count')` (depending on the client/SQL capability) to retrieve only the number needed. Avoid downloading data you don't intend to display.

## 2026-01-27 - Unstable Props Defeating Memoization
**Learning:** `MneeTransactionButton` was effectively re-rendering on every parent render despite being a heavy component (wagmi hooks), because its parent `PostItem` passed unstable inline functions (`onSuccess`) and JSX objects (`icon`). This is a common pattern in list items.
**Action:** When optimizing list items, ensure child components, especially those with expensive hooks or heavy rendering, are wrapped in `memo` AND that their props (handlers, icons) are stabilized with `useCallback` or constants.
