# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Hardcoded API Keys in AI Services
**Vulnerability:** Found multiple hardcoded API keys in `src/lib/minimax-ai.ts`, `src/lib/google-jules.ts`, and `src/lib/jules-ai.ts`.
**Learning:** Keys were likely pasted for quick testing during integrations of new AI providers and never moved to env vars. Multiple files for similar services ('jules') caused confusion.
**Prevention:** Enforce environment variable usage for all secrets. Audit `src/lib` for new service integrations regularly.
