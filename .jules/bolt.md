## 2024-05-23 - N+1 Frontend Optimization
**Learning:** Checking user state (liked/bookmarked) individually for each item in a list creates a massive N+1 performance bottleneck on the client-side, especially when using a backend-as-a-service like Supabase where each check is an HTTP request.
**Action:** Always batch these checks. Fetch all relevant IDs for the current user in a single query (e.g., `WHERE id IN (...)`) and use a `Set` or `Map` on the client to perform O(1) lookups during rendering.

## 2024-05-23 - Count Optimization
**Learning:** Fetching all related records (e.g., `select('*')`) just to count them (`.length`) is incredibly wasteful of bandwidth and memory.
**Action:** Use `select('*', { count: 'exact', head: true })` or `select('count')` (depending on the client/SQL capability) to retrieve only the number needed. Avoid downloading data you don't intend to display.

## 2024-05-24 - Route-Based Code Splitting
**Learning:** In a large SPA with many heavy pages (like 3D viewers or complex dashboards), eagerness to load all routes results in a massive initial bundle.
**Action:** Use `React.lazy` and `Suspense` to split code by route. Wrap the `Routes` or the inner content area with a `Suspense` boundary and a nice fallback loader. Be careful with named vs default exports when lazy loading; use `.then(module => ({ default: module.NamedComponent }))` for named exports.
