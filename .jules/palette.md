## 2026-01-24 - Replacing Alerts with Toasts
**Learning:** Native browser alerts (`alert()`) are blocking and disrupt the user flow, especially for common actions like authentication guards. Using non-blocking toast notifications (like `react-hot-toast`) provides a smoother experience and maintains the application's visual context.
**Action:** Always prefer toast notifications over `alert()` for user feedback. When indicating a "locked" state, include a relevant icon (like a lock) in the toast to reinforce the message visually.
