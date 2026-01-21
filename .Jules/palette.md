## 2025-02-12 - Accessible Action Buttons
**Learning:** Icon-only buttons in social cards (like reply/repost) often lack text labels, making them inaccessible to screen readers. Adding dynamic `aria-label`s (e.g., "Unlike" vs "Like") significantly improves the experience without changing the visual design.
**Action:** Always verify `aria-label` is present on icon-only buttons and that it reflects the current state (pressed/active).

## 2025-05-21 - Non-Intrusive Progress Indicators
**Learning:** For character limits, showing the exact number constantly adds visual noise. A visual ring that fills up is cleaner, only revealing the number when the user is approaching the limit (e.g., >80%). This reduces cognitive load while keeping critical info available when needed.
**Action:** Use SVG stroke-dasharray animations for high-fidelity progress indicators instead of CSS scaling, which looks cleaner and more professional.
