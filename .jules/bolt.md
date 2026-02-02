## 2024-05-23 - N+1 Frontend Optimization
**Learning:** Checking user state (liked/bookmarked) individually for each item in a list creates a massive N+1 performance bottleneck on the client-side, especially when using a backend-as-a-service like Supabase where each check is an HTTP request.
**Action:** Always batch these checks. Fetch all relevant IDs for the current user in a single query (e.g., `WHERE id IN (...)`) and use a `Set` or `Map` on the client to perform O(1) lookups during rendering.

## 2024-05-23 - Count Optimization
**Learning:** Fetching all related records (e.g., `select('*')`) just to count them (`.length`) is incredibly wasteful of bandwidth and memory.
**Action:** Use `select('*', { count: 'exact', head: true })` or `select('count')` (depending on the client/SQL capability) to retrieve only the number needed. Avoid downloading data you don't intend to display.

## 2024-05-23 - Route-based Code Splitting
**Learning:** React routes imported directly (statically) are bundled together, causing massive initial bundle sizes. Code splitting using `React.lazy` is essential for performance.
**Action:** Use `React.lazy` for all non-critical routes. For named exports, use `lazy(() => import('./path').then(module => ({ default: module.ExportName })))`. Keep critical entry points (Auth, Home) eager for better LCP.
