# Palette's Journal 🎨

## 2024-05-24 - Media Player Accessibility Patterns
**Learning:** Audio and media players often have icon-only buttons that are completely invisible to screen readers. Adding dynamic `aria-label`s (e.g., "Play" vs "Pause", "Like" vs "Unlike") significantly improves usability for blind users without affecting the visual design.
**Action:** When encountering media controls, always check for dynamic state labeling and ensure toggle buttons communicate their current state via label or `aria-pressed`. Use `aria-hidden="true"` on the icon itself to prevent redundancy.
