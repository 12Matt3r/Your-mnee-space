# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Multiple Hardcoded API Keys (Google Jules & MiniMax)
**Vulnerability:** Discovered hardcoded API keys in `src/lib/google-jules.ts`, `src/lib/jules-ai.ts`, and `src/lib/minimax-ai.ts`. This included keys for Google Gemini ('AIzaSy...') and MiniMax ('sk-api-...').
**Learning:** The pattern of defining a `CONFIG` object with an `apiKey` field directly in the source file encourages developers to paste keys for local testing and accidentally commit them. Multiple files followed this same insecure pattern.
**Prevention:** Config objects should initialize `apiKey` from `import.meta.env` by default. CI/CD pipelines should include secret scanning. Developers should be trained to never paste real keys into source files, even temporarily.
