# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-21 - Multiple Hardcoded API Keys in AI Services
**Vulnerability:** Found three live API keys hardcoded in `src/lib/minimax-ai.ts` ('sk-api-...'), `src/lib/jules-ai.ts` ('AIza...'), and `src/lib/google-jules.ts` ('AQ...').
**Learning:** The project pattern of having a `CONFIG` object in each service file encourages developers to paste keys directly for convenience. This seems to be a recurring issue in this codebase.
**Prevention:** Enforce strict code review on `src/lib/*.ts` files. Consider a linter rule that forbids string literals that match high-entropy patterns (like regex for API keys) in these specific files.
