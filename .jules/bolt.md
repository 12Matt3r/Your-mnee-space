## 2024-05-23 - N+1 Frontend Optimization
**Learning:** Checking user state (liked/bookmarked) individually for each item in a list creates a massive N+1 performance bottleneck on the client-side, especially when using a backend-as-a-service like Supabase where each check is an HTTP request.
**Action:** Always batch these checks. Fetch all relevant IDs for the current user in a single query (e.g., `WHERE id IN (...)`) and use a `Set` or `Map` on the client to perform O(1) lookups during rendering.

## 2024-05-23 - Count Optimization
**Learning:** Fetching all related records (e.g., `select('*')`) just to count them (`.length`) is incredibly wasteful of bandwidth and memory.
**Action:** Use `select('*', { count: 'exact', head: true })` or `select('count')` (depending on the client/SQL capability) to retrieve only the number needed. Avoid downloading data you don't intend to display.

## 2024-05-24 - Unstable Mock Data
**Learning:** Generating mock data with random values (e.g. `Math.random()`) inside a component's render loop or `useEffect` callback creates new object references on every render. This breaks `React.memo` optimizations on child components (like `PostItem`), causing unnecessary re-renders even when the data "looks" the same.
**Action:** Move static mock data generation outside the component scope or wrap it in `useMemo` to ensure referential stability.
