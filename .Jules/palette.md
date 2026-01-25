## 2025-02-19 - [Header Accessibility Improvements]
**Learning:** `focus-visible` styles are critical for keyboard navigation but often missed in custom implementations. Using `ring-offset` is essential for visibility on dark backgrounds (like `mnee-charcoal`).
**Action:** Always verify keyboard navigation by tabbing through elements, not just visual inspection. Use `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` pattern for consistency.
