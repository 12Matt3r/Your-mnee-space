# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Multiple Hardcoded API Keys in AI Services
**Vulnerability:** Found hardcoded API keys in `src/lib/jules-ai.ts` (Gemini), `src/lib/google-jules.ts` (Google Jules), and `src/lib/minimax-ai.ts` (MiniMax).
**Learning:** The previous fix for `openrouter-ai.ts` did not extend to other similar files. When one vulnerability is found, it's crucial to check for similar patterns across the codebase (e.g., other "AI service" files).
**Prevention:** When fixing a security issue, use `grep` or similar tools to search for other instances of the same pattern (e.g., `apiKey: '...'`). Establish a strict code review process that checks for secrets in all new configuration files.
