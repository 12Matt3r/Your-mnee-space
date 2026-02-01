# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-22 - Hardcoded Google API Key in Source Code
**Vulnerability:** A valid Google Cloud API key was hardcoded in `src/lib/jules-ai.ts` and committed to the codebase, despite a comment warning against it.
**Learning:** Comments alone are insufficient to prevent security lapses. The developer likely copied the key for local testing and forgot to revert.
**Prevention:** Enforce environment variable usage in CI/CD pipelines. Implement secret scanning in the repo.
