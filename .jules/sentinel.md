# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-23 - Hardcoded API Keys in Multiple Service Files
**Vulnerability:** Found live API keys for MiniMax and Google Jules hardcoded in `src/lib/minimax-ai.ts` and `src/lib/google-jules.ts`.
**Learning:** The pattern of defining a `CONFIG` object in these files encourages hardcoding values if developers are not careful. Copy-pasting from one service file to another might propagate this if the source file had a hardcoded key during development.
**Prevention:** Enforce environment variable usage in code reviews. Automated scanning for high-entropy strings should be part of the CI pipeline. Added `ImportMetaEnv` definitions to `src/vite-env.d.ts` to improve type safety and visibility of required env vars.
