# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Multiple Hardcoded AI Service Keys
**Vulnerability:** Found hardcoded API keys for Google Jules, Gemini, and MiniMax services directly in their respective configuration files in `src/lib/`.
**Learning:** Copying configuration patterns from one file to another can propagate security vulnerabilities. The pattern of a `CONFIG` object with an `apiKey` field encouraged hardcoding.
**Prevention:** Enforce a strict "no secrets in code" policy. Use linter plugins (like `eslint-plugin-no-secrets`) to catch high-entropy strings. Refactor configuration objects to force usage of `import.meta.env` or throw an error if the environment variable is missing, rather than providing a default string that might be replaced by a real key during development.
