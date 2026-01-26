## 2025-10-26 - Missing Loading States on Core Buttons
**Learning:** The `Button` component, widely used for actions (submit, save), lacked a built-in loading state. This is a critical pattern for preventing double submissions and providing feedback during async operations in this app.
**Action:** Always check core UI components for "busy" states. When implementing async actions, ensure the button handles the loading state natively via props to ensure consistency and reduce boilerplate in parent components.
