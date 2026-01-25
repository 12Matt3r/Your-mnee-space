## 2026-01-25 - Button Loading States
**Learning:** The base `Button` component lacked built-in loading states, forcing developers to manually handle disabled states and spinners, leading to inconsistent UX.
**Action:** Implemented `isLoading` and `loadingText` props on the `Button` component to standardize loading feedback and accessibility (automatically disabling the button).
