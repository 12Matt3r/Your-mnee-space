## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).

## 2025-02-12 - Music Player Accessibility
**Learning:** Complex interactive components like media players often rely on div with onClick for list items, breaking keyboard navigation. Also missing aria-labels on icon-only controls.
**Action:** Always check interactive lists (playlists, menus) and convert divs to buttons (with type='button' and w-full text-left to preserve layout) for full accessibility. Ensure all icon-only buttons have aria-labels.
