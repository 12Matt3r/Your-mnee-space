# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Hardcoded MiniMax API Key
**Vulnerability:** Found a live MiniMax API key ('sk-api-...') hardcoded in `src/lib/minimax-ai.ts`.
**Learning:** Similar to the OpenRouter issue, the key was directly assigned in the `MINIMAX_CONFIG` object. This suggests a pattern of developers hardcoding keys for convenience in this project.
**Prevention:** Enforce strict code reviews for `src/lib/*` files. Consider adding a linter rule to forbid strings matching `sk-[a-z0-9]{20,}`.
