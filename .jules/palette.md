## 2024-05-22 - Tailwind Focus Accessibility
**Learning:** This codebase uses `outline-none` extensively on inputs to remove browser defaults, but often forgets to re-apply `focus-visible` rings. This renders inputs inaccessible to keyboard users.
**Action:** When seeing `outline-none` on interactive elements, always verify that a replacement focus indicator (like `focus-visible:ring-2`) is present.
## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).
