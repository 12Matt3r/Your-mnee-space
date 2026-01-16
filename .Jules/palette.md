## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).

## 2025-02-13 - Shared Loading States
**Learning:** Forms with multiple submission paths (like Sign In vs Demo Mode) often accidentally share a single `isLoading` state. This confuses users by showing loading indicators on buttons they didn't click.
**Action:** Always use distinct loading states (e.g., `isSignInLoading`, `isDemoLoading`) for multi-action forms and disable all controls during any active loading state.
