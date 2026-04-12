@AGENTS.md

# Website Framework

This is a reusable website framework. Sites built from this framework share the same architecture.

## Architecture

- Pages are JSON files in `/content/pages/` rendered by `BlockRenderer`
- Site config (nav, fonts, colors) is in `/content/site.json`
- Admin panel at `/admin` lets clients edit content without code access
- See `ARCHITECTURE.md` for full system diagrams and deployment flows

## Content System

- `lib/content.ts` — `loadPage(slug)`, `loadSiteConfig()`, `listPages()`
- `lib/types.ts` — all block types, `PageContent`, `SiteConfig`, `ApiResponse`
- `components/BlockRenderer.tsx` — maps `block.type` to components via registry pattern
- Content is never in components. Components read from JSON. Admin writes JSON.

## Adding a Block Type

1. Add interface to `lib/types.ts`, add to `Block` union
2. Create component in `components/blocks/`
3. Register in `BlockRenderer.tsx`
4. Create editor in `components/admin/editors/`
5. Register in `components/admin/BlockEditor.tsx`
6. Add to `components/admin/BlockGallery.tsx`

## Admin Panel

- `/admin` — client-facing page editor
- `/api/admin/pages` — CRUD for pages
- `/api/admin/site` — read/update site config
- `/api/admin/upload` — image upload to `/public/uploads/`
- `/api/admin/rebuild` — triggers `npm run build` + git commit/push
- Auth is handled by Nginx basic auth, not application code

## Skills

- `/website-init` — scaffold a new client site from this framework. Run in an empty directory. See `.claude/skills/website-init/SKILL.md`
- `/deploy-init` — first-time deployment wizard. Sets up Docker, Nginx, SSL, admin auth, deploy key. See `.claude/skills/deploy-init/SKILL.md`
- `/deploy` — repeatable deploy for code updates. Pulls remote, pushes local, rebuilds in container, health checks with auto-rollback. See `.claude/skills/deploy/SKILL.md`

## Key Conventions

- No database — everything is JSON files
- No hardcoded content in components — always read from `/content/`
- BlockRenderer is the contract between content and presentation
- Admin panel edits data, never touches rendering/styling
- `output: 'standalone'` in next.config — not static export
- Slugs must match `^[a-z0-9-]+$`
- Immutable updates — never mutate content objects
