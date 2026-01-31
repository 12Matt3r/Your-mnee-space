# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Multiple Hardcoded AI Service Keys
**Vulnerability:** Found hardcoded API keys in `src/lib/minimax-ai.ts`, `src/lib/google-jules.ts`, and `src/lib/jules-ai.ts`.
**Learning:** Several AI service integrations were committed with hardcoded credentials, likely for development convenience. The pattern of configuration objects with hardcoded values was replicated across multiple files.
**Prevention:** Enforce environment variable usage for all secrets. Use tools like `git-secrets` or pre-commit hooks to scan for high-entropy strings.
