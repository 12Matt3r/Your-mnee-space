## 2024-05-22 - Standardized Button Loading State
**Learning:** The shared `Button` component lacked built-in support for loading states, causing consumers to implement ad-hoc solutions (like manually changing text).
**Action:** Enhanced `Button` to accept `isLoading` and `loadingText` props, ensuring consistent spinner placement and accessible status roles across the app.
