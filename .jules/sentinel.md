# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-23 - Hardcoded API Keys in Multiple AI Services
**Vulnerability:** Found live Google Gemini and MiniMax API keys hardcoded in `src/lib/jules-ai.ts` and `src/lib/minimax-ai.ts` respectively.
**Learning:** The "config object" pattern in this project seems to encourage hardcoding values directly in the file. Multiple files followed the same insecure pattern (`apiKey: '...'`).
**Prevention:** Establish a strict pattern for config objects where secrets are *only* assigned from environment variables. Add automated secret scanning to the CI/CD pipeline to catch these before they are merged.
