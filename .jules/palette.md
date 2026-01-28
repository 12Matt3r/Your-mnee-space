## 2025-02-18 - Progressive Disclosure in Forms
**Learning:** Users don't need to see character counts until they are relevant (near the limit). Hiding the count until <= 20 chars remaining reduces cognitive load and visual clutter.
**Action:** Apply "smart visibility" to other constrained inputs (bio, title fields) in the future.

## 2025-02-18 - SVG Progress Rings
**Learning:** Using `stroke-dasharray` for circular progress is smoother and more professional than scaling divs or linear bars for small indicators.
**Action:** Create a reusable `CircularProgress` component if this pattern is needed in more than one place.
