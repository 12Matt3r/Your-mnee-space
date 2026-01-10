## 2024-05-23 - Hardcoded Secrets & Scope Creep
**Vulnerability:** Found hardcoded Supabase URL and Anon Key directly in `src/lib/supabase.ts`.
**Learning:** Even "public" keys like Supabase Anon Key should be in environment variables for proper configuration management and to avoid accidental commits of sensitive keys (like Service Role).
**Prevention:** Use `import.meta.env` (Vite) or `process.env` (Node) and validate presence at runtime.
**Scope Lesson:** I initially tried to fix syntax errors in `src/hooks/useStreamingSession.tsx` to get the build passing. This was a mistake. It introduced risk and breaking changes (renaming exports in `useDiscord.tsx`). Security fixes must be surgical. If the build is already broken, fix ONLY the security issue and verify that specific change, rather than trying to fix the whole repo.
