# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-16 - Hardcoded Google Jules API Key
**Vulnerability:** Found a hardcoded API key in `src/lib/google-jules.ts`.
**Learning:** Similar to the OpenRouter issue, keys are being hardcoded in "Config" objects within source files. This pattern needs to be monitored.
**Prevention:** Strictly enforce `import.meta.env` usage for all AI service configurations. Review all files matching `src/lib/*-ai.ts` or `src/lib/*-service.ts` for similar patterns.
