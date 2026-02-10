# Sentinel Security Journal

## 2025-05-15 - Hardcoded API Key in Source Code
**Vulnerability:** Found a live OpenRouter API key ('sk-or-v1-...') hardcoded in `src/lib/openrouter-ai.ts`.
**Learning:** It seems the key was pasted directly into the config object, likely for quick testing, and then committed. The file structure suggests a config object pattern where values are hardcoded.
**Prevention:** Always use `import.meta.env` (or `process.env`) for secrets. Use pre-commit hooks (like `git-secrets` or `trufflehog`) to scan for high-entropy strings or known key patterns before commit.

## 2025-05-20 - Unsafe Image URL Rendering in PostContent
**Vulnerability:** The `PostContent` component rendered markdown images `![alt](url)` without validating the protocol of the URL. This allowed `javascript:` and `data:` protocols to be injected into the `src` attribute of the `img` tag, posing an XSS risk (though mitigated by modern React/Browsers, it's still a vulnerability).
**Learning:** Regex-based parsing of user input often overlooks protocol validation. Relying solely on framework sanitization is insufficient for defense-in-depth.
**Prevention:** Implement explicit protocol allowlisting (e.g., `http:`, `https:`) for all user-supplied URLs before rendering them in media tags.
