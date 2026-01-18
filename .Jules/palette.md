## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).

## 2025-05-21 - Distinct Loading States
**Learning:** Sharing a single `isLoading` state between primary (Sign In) and secondary (Demo Mode) actions causes UI confusion. When a user clicks one, the other shouldn't indicate "loading" unless it's truly involved.
**Action:** Use distinct loading state variables (e.g., `isSignInLoading`, `isDemoLoading`) for independent actions to provide accurate feedback.
