# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-23 - Multiple Hardcoded API Keys in AI Services
**Vulnerability:** Discovered hardcoded API keys in `src/lib/google-jules.ts`, `src/lib/jules-ai.ts`, and `src/lib/minimax-ai.ts`.
**Learning:** The pattern of hardcoding keys in config objects persisted across multiple files, likely due to copy-pasting code or lack of awareness about environment variables in frontend builds. Developers might assume client-side keys are safe or just forgot to externalize them.
**Prevention:** Enforce a strict policy of using environment variables for ALL external service configurations. Add linting rules to detect potential secret patterns. Update documentation (`.env.example`) to include all required keys.
