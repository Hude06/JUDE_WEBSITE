# Website Framework — Claude Guide

## What This Repo Is

This repo is an immutable-core website framework for building client sites.

- Runtime: Next.js 16 + React 19
- Content model: JSON files (`content/pages/*.json`, `content/site.json`)
- Rendering contract: `components/BlockRenderer.tsx` maps `block.type` to components
- Editing flow: `/admin` writes validated JSON through `/api/admin/*`
- Content contract: `contractVersion: 1` (see `docs/contract-v1.md`)

Use this framework to scaffold new client sites, then customize in client-safe zones.

## Primary Commands

- Scaffold a client site:
  - `npm create @judemakesthings/website-framework my-client-site`
- Run locally:
  - `npm install`
  - `npm run dev`
- Validate before shipping:
  - `npm run verify`

## Project Zones (Critical)

### Framework repo (this repo: no `.client-site` marker)

- Framework files are editable.
- Do **not** edit frozen client stubs in `client/*.ts` (`registry.ts`, `editor-registry.ts`, `gallery.ts`, `types.ts`, `theme.ts`).

### Client site (has `.client-site` marker)

Only edit:

- `client/**`
- `content/pages/*.json`
- `content/site.json`
- `public/uploads/**`

Everything else is framework-owned and should be treated as read-only.

## Non-Negotiables

- Keep content in JSON, not hardcoded in site route JSX.
- Keep `ApiResponse<T>` envelope shape (`{ success, data?, error? }`).
- Keep slug rules aligned with validation (`^[a-z0-9-]+$`).
- Do not add Tailwind/shadcn or another CSS framework.
  - UI system is `lib/ui/*` + CSS Modules + tokens in `app/globals.css`.
- Validate schema-compatible changes in `lib/types.ts`, `lib/schemas.ts`, and block render/editor registries together.

## Safe Workflow For AI Agents

1. Read `README.md` first for architecture and file map.
2. If changing content contract or admin saves, also read:
   - `docs/contract-v1.md`
   - `lib/content.ts`
   - `lib/admin.ts`
   - `lib/schemas.ts`
3. Make small changes.
4. Run `npm run verify`.
5. Commit and push.

## Canonical References

- Human overview: `README.md`
- System/deploy details: `ARCHITECTURE.md`
- Contract rules: `docs/contract-v1.md`
- Client customization rules: `client/README.md`
