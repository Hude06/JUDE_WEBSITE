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

## Safe to Change (Admin Panel Keeps Working)

These changes are safe and will not break the admin panel:

- **Component styling** — Tailwind classes, shadcn theme, CSS. The admin panel never touches rendering.
- **Component structure** — how HeadingBlock renders its text, how CardGridBlock lays out cards, etc. As long as the component still reads `block.text`, `block.src`, etc., it's fine.
- **Layout and site chrome** — Header, Footer, root layout, fonts, colors. All driven by `content/site.json`.
- **Add new pages** — through the admin panel or manually via `content/pages/*.json`.
- **Add new fields to existing blocks** as optional — e.g., add an optional `align?: 'left' | 'center'` to HeadingBlock. Old content files still work. Admin editor can be updated to expose the new field.
- **Add new CSS frameworks or component libraries** — swap Tailwind for Bootstrap if you want. The admin panel doesn't know.
- **Customize the starter content** — overwrite home.json, about.json, contact.json with client-specific content.
- **Modify API route implementations** — as long as the response shape (`ApiResponse<T>`) stays the same.
- **Add new API routes** — for custom functionality like contact forms, analytics, etc.

## Breaks Admin Panel (Handle With Care)

These changes WILL break the admin panel unless you update multiple files in sync:

- **Renaming a block type** — e.g., `heading` → `title`. You MUST update:
  1. `lib/types.ts` — the type name
  2. `components/BlockRenderer.tsx` — the registry key
  3. `components/admin/BlockEditor.tsx` — the switch case and typeLabels
  4. `components/admin/BlockGallery.tsx` — the template
  5. All existing `content/pages/*.json` files that use the old name — migrate them

- **Changing field names on a block** — e.g., HeadingBlock `text` → `content`. You MUST update:
  1. `lib/types.ts` — the interface
  2. `components/blocks/HeadingBlock.tsx` — the component reads this field
  3. `components/admin/editors/HeadingEditor.tsx` — the editor writes this field
  4. All existing content JSON using the old field name

- **Changing the ApiResponse envelope** — `lib/admin-api.ts` assumes `{success, data?, error?}`. Changing this breaks every admin fetch.

- **Removing a block editor without removing the block type** — the block will render on the site but the admin panel has no way to edit it.

- **Changing slug regex `^[a-z0-9-]+$`** — the server and admin UI both validate slugs. Change one without the other and you get cryptic errors.

- **Changing `/content/` directory structure** — `lib/content.ts` hardcodes `content/pages/` and `content/site.json`. Moving these breaks the loader.

## Framework Clone Model

When `/website-init` runs, it copies the ENTIRE framework into the new client site repo. Each client site is an independent fork:

- Bug fixes to the framework do NOT auto-propagate to existing client sites
- New block types added to the framework do NOT appear in existing client sites
- Changes in a client site do NOT affect other clients
- This is intentional — sites are isolated and stable

To pull framework updates into an existing client site, manually cherry-pick the relevant commits or copy the files.

## Key Conventions

- No database — everything is JSON files
- No hardcoded content in components — always read from `/content/`
- BlockRenderer is the contract between content and presentation
- Admin panel edits data, never touches rendering/styling
- `output: 'standalone'` in next.config — not static export
- Slugs must match `^[a-z0-9-]+$`
- Immutable updates — never mutate content objects
