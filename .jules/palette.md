## 2024-05-22 - Loading States in Buttons
**Learning:** The shared `Button` component defaults to a gradient background (`bg-gradient-to-r`). To use a solid background color (e.g., specific brand blue) on a button, you must explicitly apply `bg-none` in `className` to remove the background image property, otherwise the gradient takes precedence over `bg-color` utilities.
**Action:** When overriding button styles for brand-specific colors, always include `bg-none`.
