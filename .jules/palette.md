## 2025-05-18 - Standardizing Button Loading States
**Learning:** The codebase contained multiple manual implementations of loading states (spinner + text change) within raw buttons or creating custom button logic. This led to inconsistent UI and code duplication.
**Action:** Enhanced the shared `Button` component to support `isLoading` and `loadingText` props natively. This simplifies usage (e.g., `<Button isLoading={isSubmitting} loadingText="Saving...">Save</Button>`) and ensures consistent accessibility (disabled state, aria attributes) and visual feedback (spinner) across the application. When refactoring, check for `disabled` logic to ensure it merges with `isLoading`.

## 2025-05-18 - Playwright Route Interception for Loading States
**Learning:** Verifying transient loading states in integration tests is difficult because they are often too fast.
**Action:** Use Playwright's `page.route` to intercept network requests (e.g., API calls) and hold them (store the route and do not call `continue()` immediately). This artificially prolongs the loading state, allowing `expect` assertions to verify the UI (e.g., "Posting..." text) reliably. Release the route afterwards to clean up.
