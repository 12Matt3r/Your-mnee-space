# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2026-01-23 - Hardcoded MiniMax API Key
**Vulnerability:** Found a live MiniMax API key ('sk-api-...') hardcoded in `src/lib/minimax-ai.ts`.
**Learning:** Similar to the OpenRouter issue, this key was hardcoded in the configuration object. It indicates a recurring pattern of developers checking in secrets for convenience during development.
**Prevention:** Enforce environment variable usage for all API keys. Implement automated secret scanning in CI/CD pipeline.
