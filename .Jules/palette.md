## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).

## 2025-05-20 - Character Count Visibility
**Learning:** Hiding character count indicators until the user approaches the limit (e.g. 80% used) reduces visual clutter and cognitive load, allowing users to focus on writing until constraints become relevant.
**Action:** Implement progressive disclosure for limit indicators in input fields.
