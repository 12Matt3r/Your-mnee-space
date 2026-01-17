## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).

## 2025-05-22 - [Music Player Accessibility]
**Learning:** Audio players are complex interactive widgets that often rely on visual metaphors (sliders, icons). Ensuring every control has an explicit text label and that playlists are navigable via keyboard is critical for usability.
**Action:** Convert clickable list items (like tracks) to native `<button>` elements to get free keyboard accessibility, and ensure sliders report their values via ARIA.
