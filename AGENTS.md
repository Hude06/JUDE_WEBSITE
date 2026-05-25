<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Zone Awareness — IMPORTANT

Before you edit any file, know which zone you are in:

- `.client-site` file at repo root → **CLIENT SITE**. Only edit `site/**`, `client/**`, `content/pages/*.json`, `content/site.json`, `public/uploads/**`. Framework files are read-only.
- No `.client-site` file → **FRAMEWORK REPO**. Edit framework files freely; `client/*.ts` stubs are frozen (do not edit after Phase 1 commit).

If your tool call is rejected by the zone guard, you tried to edit across zones. DO NOT bypass with `FRAMEWORK_EDIT=1` unless the user explicitly authorizes it.

Client-safe customization also includes `site/**` (shell/metadata/404/styles). Use `site/**` for chrome and global presentation overrides, `client/**` for block and editor extensions, and `content/**` for data.

Custom blocks in a client site live in `client/blocks/<Name>/`. See `client/README.md`.
