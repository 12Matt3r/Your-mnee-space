# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-22 - Multiple Hardcoded API Keys in Lib Folder
**Vulnerability:** Found multiple hardcoded API keys in `src/lib/` files (`jules-ai.ts`, `google-jules.ts`, `minimax-ai.ts`). These keys were directly embedded in configuration objects.
**Learning:** Developers might copy-paste keys directly into "config" objects for speed, intending to remove them later but forgetting. The "config object" pattern (e.g., `JULES_CONFIG`) encourages grouping settings, and developers might treat API keys as just another setting rather than a secret.
**Prevention:** Enforce a strict rule that `apiKey` fields in config objects must reference `import.meta.env` or similar. Add linter rules to detect high-entropy strings assigned to variables named `apiKey` or `secret`.
