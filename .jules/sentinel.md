# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-16 - Multiple Hardcoded AI Service Keys
**Vulnerability:** Found live API keys for MiniMax ('sk-api-...') and Google Jules ('AIza...') hardcoded in their respective library files (`src/lib/minimax-ai.ts`, `src/lib/jules-ai.ts`).
**Learning:** The pattern of hardcoding keys in config objects was replicated across multiple new AI service integrations. Fixes need to be applied systematically across all similar modules, not just the one where the issue was first spotted.
**Prevention:** When adding new integrations following an existing pattern, ensure the pattern itself is secure. Perform a grep search for key patterns (e.g., `sk-`, `AIza`) across the entire `src/lib` directory periodically.
