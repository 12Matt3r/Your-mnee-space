## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).
## 2026-01-27 - Standardized Loading States
**Learning:** Developers often implement loading states manually on buttons, leading to inconsistent UI (missing disabled state, different spinner styles). A standardized `isLoading` prop on the base `Button` component ensures consistent accessibility and visual feedback.
**Action:** Bake common interaction states (loading, error) into base UI components to prevent ad-hoc implementations.
