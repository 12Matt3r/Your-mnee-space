# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Multiple Hardcoded API Keys
**Vulnerability:** Found hardcoded API keys in `src/lib/minimax-ai.ts`, `src/lib/google-jules.ts`, and `src/lib/jules-ai.ts`.
**Learning:** Developers likely hardcoded keys for quick testing of different AI providers and forgot to externalize them. The presence of multiple similar files (`google-jules.ts` vs `jules-ai.ts`) with different keys suggests experimentation without cleanup.
**Prevention:** Enforce pre-commit hooks that scan for high-entropy strings. Use a centralized configuration for all AI services that strictly pulls from environment variables.
