## 2024-05-23 - N+1 Frontend Optimization
**Learning:** Checking user state (liked/bookmarked) individually for each item in a list creates a massive N+1 performance bottleneck on the client-side, especially when using a backend-as-a-service like Supabase where each check is an HTTP request.
**Action:** Always batch these checks. Fetch all relevant IDs for the current user in a single query (e.g., `WHERE id IN (...)`) and use a `Set` or `Map` on the client to perform O(1) lookups during rendering.

## 2024-05-23 - Count Optimization
**Learning:** Fetching all related records (e.g., `select('*')`) just to count them (`.length`) is incredibly wasteful of bandwidth and memory.
**Action:** Use `select('*', { count: 'exact', head: true })` or `select('count')` (depending on the client/SQL capability) to retrieve only the number needed. Avoid downloading data you don't intend to display.

## 2024-05-24 - Route Code Splitting Strategy
**Learning:** This application uses a hybrid routing strategy where critical routes (Home, Login) are eager-loaded for FCP, while feature routes are lazy-loaded. Crucially, routes wrapped in the shared `Layout` component rely on a single `Suspense` boundary inside `Layout` (wrapping `{children}`), while standalone lazy routes (e.g., `/buy-mnee`) crash without their own individual `Suspense` wrappers.
**Action:** When adding new lazy routes, check if they use `Layout`. If yes, no extra `Suspense` is needed. If no, wrap the route element in `Suspense` manually.
