# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Multiple Hardcoded AI Service Keys
**Vulnerability:** Found hardcoded API keys for MiniMax, Google Jules, and Google Cloud AI in `src/lib/minimax-ai.ts`, `src/lib/google-jules.ts`, and `src/lib/jules-ai.ts`.
**Learning:** The pattern of hardcoding keys in `src/lib/*-ai.ts` files was widespread, suggesting a systemic lack of awareness or a copy-paste practice from a local dev environment.
**Prevention:** Enforce strict linter rules against hardcoded secrets. Conduct a full codebase scan for `sk-` or `AIza` patterns. Ensure `env` example files are updated and developers know how to use `.env.local`.
