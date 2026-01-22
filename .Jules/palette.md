## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).

## 2025-05-15 - Share API & Feedback
**Learning:** The "Share" button in social feeds is often implemented as a placeholder. Users expect immediate feedback. Implementing `navigator.share` with a fallback to clipboard copy provides a native feel, but it *must* have visual feedback (toast) when falling back to clipboard, otherwise the user thinks nothing happened. Also, `<Toaster />` must be present at the app root for these notifications to work.
**Action:** When implementing share features, always handle the fallback gracefully with a toast notification and verify the Toaster provider exists in the app root.
