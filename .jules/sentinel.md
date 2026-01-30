# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-15 - Unsafe Image URL Rendering
**Vulnerability:** `PostContent.tsx` rendered markdown images using `src={match[2]}` without validation, allowing `javascript:` URLs.
**Learning:** Custom markdown parsers often miss security edge cases that established libraries handle. React's `src` attribute protection is not a complete defense.
**Prevention:** Always validate user-supplied URLs against an allowlist of protocols (`http`, `https`). Use established markdown libraries (like `react-markdown`) with sanitization plugins (`rehype-sanitize`) instead of custom regex parsing when possible.
