## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).

## 2025-02-12 - Focus Ring on Transparent Textareas
**Learning:** Adding a focus ring to a transparent textarea (`bg-transparent border-none`) requires careful padding and margin adjustments (e.g., `p-2 -ml-2`) to ensure the ring appears "around" the text without causing layout shifts or overlapping adjacent content.
**Action:** When adding focus styles to borderless inputs, always compensate for the ring's space using negative margins or wrapper elements to maintain alignment.
