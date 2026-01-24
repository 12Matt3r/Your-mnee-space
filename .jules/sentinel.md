# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-21 - Hardcoded MiniMax and Google Jules API Keys
**Vulnerability:** Found hardcoded API keys in `src/lib/minimax-ai.ts` and `src/lib/google-jules.ts`.
**Learning:** This reinforces the pattern observed previously. The codebase seems to have multiple AI service integrations where developers might copy-paste keys for testing and forget to externalize them. The `ALL_AI_SERVICES` config in `google-jules.ts` even had `keyProvided: true` hardcoded, suggesting a mental model where keys are static configuration.
**Prevention:** Regular scanning for high-entropy strings in `src/lib/` is recommended. Code reviews must strictly check for secrets in new service integrations.
