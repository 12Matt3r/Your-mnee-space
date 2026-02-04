# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Hardcoded Stripe Publishable Key
**Vulnerability:** Found a hardcoded Stripe publishable key in `src/lib/stripe.ts`.
**Learning:** Even though publishable keys are not secrets in the traditional sense (they are exposed to the client), hardcoding them fosters bad habits and makes environment management difficult.
**Prevention:** Treat all configuration that varies by environment (test vs prod) as secrets/env vars. Added `VITE_STRIPE_PUBLISHABLE_KEY` to `.env.example` and updated the code to use it.
