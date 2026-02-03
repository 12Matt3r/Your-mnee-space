# Palette's Journal - UX & Accessibility

## 2024-05-23 - Micro-UX in Forms

**Learning:** When using "clean" interfaces (like transparent textareas), standard `outline-none` kills accessibility. Adding `focus-visible` ring with negative margin (`-m-2`) and padding (`p-2`) allows for a focus indicator that doesn't disrupt the visual flow of the element when not focused.

**Action:** Always wrap "invisible" inputs or apply specific `focus-visible` styles that mimic the container's shape to maintain accessibility without compromising the clean design.

**Learning:** Reusable loading states in Buttons prevent layout shifts.
**Action:** Extend the shared `Button` component to handle `isLoading` internally, replacing the content with a spinner of the appropriate size, rather than handling it in every parent component.
