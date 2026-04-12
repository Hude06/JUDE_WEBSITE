# Session Summary — Website Framework

## What This Project Is

An open-source, AI-first website framework built on Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui. It's a lightweight WordPress alternative for developers who build client websites with Claude. The repo is live at **Hude06/website-framework**.

## The Problem It Solves

WordPress is slow, bloated, not AI-friendly, and hard to scale across multiple client sites. This framework lets a developer scaffold a new client site, customize it with Claude, deploy it to a Docker container on a Linode server, and hand the client an admin panel where they can edit content without touching code.

## Architecture Decisions Made

All architecture details are in `ARCHITECTURE.md`. Key decisions:

- **No database** — everything is JSON files in `/content/`
- **BlockRenderer contract** — admin panel edits JSON data, template components render it. Decoupled. Works with any CSS framework.
- **Next.js server mode** (`output: 'standalone'`) — not static export. Required because admin panel needs API routes for CRUD operations.
- **Admin panel at `/admin`** — same Next.js app, route group `(site)` has Header/Footer, `/admin` has bare layout. No separate admin subdomain.
- **Nginx basic auth** on `/admin` and `/api/admin` — zero auth code in the framework. Password set via htpasswd on the server.
- **Image uploads** — filesystem in `/content/uploads/`, committed to git. Fine for < 10 images per site.
- **Single-stage Dockerfile** — keeps full source, node_modules, git in container (~500MB). Required because container needs to `git pull`, `npm run build`, and `git push` for content updates and deploys.
- **Deploy key** — generated on the server, private key never leaves. Scoped to one repo, write access only. Used for auto-commit from admin panel.
- **Git as source of truth** — client edits via admin → writes JSON → rebuilds → auto-commits → pushes to GitHub. Developer pulls latest before working.
- **Nav is editable** — navigation links managed through admin panel's nav editor, stored in `site.json`. Not auto-generated from pages.

## What's Built

### Framework Skeleton
- Next.js 16 App Router with TypeScript
- Tailwind CSS v4 + shadcn/ui (Button, Card, Badge, Separator, Dialog, Input, Textarea, Label, Select)
- Route group structure: `app/(site)/` for public pages, `app/admin/` for admin panel

### Content System
- `lib/content.ts` — `loadPage()`, `loadSiteConfig()`, `listPages()`
- `lib/types.ts` — all block types, `PageContent`, `SiteConfig`, `ApiResponse`
- 7 block types: heading, paragraph, image, badge-group, card-grid, button, separator
- `components/BlockRenderer.tsx` — registry-based dispatcher mapping block types to components

### Block Components
- `components/blocks/HeadingBlock.tsx` — h1-h6 with level prop
- `components/blocks/ParagraphBlock.tsx` — text content
- `components/blocks/ImageBlock.tsx` — image in shadcn Card
- `components/blocks/BadgeGroupBlock.tsx` — list of shadcn Badges
- `components/blocks/CardGridBlock.tsx` — grid of shadcn Cards
- `components/blocks/ButtonBlock.tsx` — CTA link with variant
- `components/blocks/SeparatorBlock.tsx` — horizontal divider

### Admin Panel (`/admin`)
- `app/admin/page.tsx` — orchestrator with state management, two views (page editor, nav editor)
- `components/admin/PageSidebar.tsx` — page list, Navigation button, add/delete page dialogs
- `components/admin/BlockEditor.tsx` — per-type editors with reorder (up/down) and delete per block
- `components/admin/BlockGallery.tsx` — dialog to add new blocks from a gallery of all 7 types
- `components/admin/NavEditor.tsx` — edit nav links, reorder, add pages to nav
- `components/admin/PreviewPanel.tsx` — iframe showing the actual rendered page
- 6 editor components in `components/admin/editors/` — one per editable block type

### API Routes
- `GET/POST /api/admin/pages` — list and create pages
- `GET/PUT/DELETE /api/admin/pages/[slug]` — single page CRUD
- `GET/PUT /api/admin/site` — read/update site config (nav, fonts, colors)
- `POST /api/admin/upload` — image upload to `/content/uploads/`
- `POST /api/admin/rebuild` — triggers `npm run build` + git commit/push

### Server-Side Helpers
- `lib/admin.ts` — `writePage()`, `deletePage()`, `writeSiteConfig()`, `validatePageContent()`, `validateSlug()`, `slugify()`, `rebuildSite()`, `gitCommitAndPush()`, `saveUploadedFile()`
- Concurrent rebuild protection (module-level lock, 409 if building)
- Slug validation (`^[a-z0-9-]+$`) prevents path traversal
- Atomic writes (write to .tmp, then rename)

### Client-Side API
- `lib/admin-api.ts` — fetch wrappers for all API routes

### Skills (in `.claude/skills/`)
- `/website-init` — scaffolds a new client site from the framework. Detects if framework already cloned or needs to clone. Creates private GitHub repo. Customizes content. Installs deps. Pushes.
- `/deploy-init` — first-time server deployment wizard. 14 steps: SSH, DNS, Docker, Nginx, SSL, admin auth, deploy key. Dry-run mode. Resume after failure. All server mods confirmed.

### Infrastructure
- `Dockerfile` — single-stage, Node 20 Alpine, git + openssh-client, full source for rebuilds
- `nginx.conf` — for local Docker testing (not used on prod — Nginx config generated by `/deploy-init`)
- `.dockerignore` — excludes node_modules, .next, .git, __tests__
- `next.config.ts` — `output: 'standalone'`, `SKIP_TYPE_CHECK` env var for admin rebuilds

### Starter Template
- 3-page portfolio: home, about, contact
- Content in `content/pages/*.json`
- Site config in `content/site.json` (name, nav, fonts, colors)
- Placeholder SVG images in `public/images/`

### Tests
- 40 tests passing (Jest + React Testing Library)
- Content loader tests, block component tests, BlockRenderer tests, admin helper tests
- `jest.config.ts` configured with path aliases, CSS mocks, jsdom environment

## What's NOT Built Yet

### `/deploy` skill
The repeatable deploy command. After `/deploy-init` sets up the server once, `/deploy` is used for all subsequent code pushes:
1. Commit + push locally
2. SSH into server
3. Git pull inside container
4. `npm run build` inside container
5. Restart if needed
6. Health check with rollback on failure

### Testing the full flow end-to-end
- `/website-init` → develop → `/deploy-init` → client edits → `/deploy`
- Should be tested against a real Linode server

### Admin panel polish
- The UI is functional but basic
- Could use better loading states, error messages, mobile responsiveness
- Block drag-and-drop (currently up/down arrows)

## Known Issues / Decisions

1. **Rebuild from admin panel** — uses `SKIP_TYPE_CHECK=1` and `NODE_ENV=production` env vars to avoid type validator conflicts when building from within the running dev server. This is working.

2. **deploy.json format** — contains zero secrets. Only hostnames, paths, ports, SSH alias. Passwords and keys never stored in any committed file.

3. **The `test` page** — was created during development testing via the admin panel. `/website-init` deletes it when scaffolding a new site.

4. **Next.js 16 quirks** — uses `@base-ui/react` for shadcn components (not Radix). No `asChild` prop — use `render` prop instead. `JSX.IntrinsicElements` namespace not available — avoid dynamic tag creation.

5. **about.json** — was modified by the user through the admin panel (reordered blocks). This is expected and proves the admin panel works.

## File Structure

```
WEBSITE_FRAMEWORK/
├── .claude/skills/
│   ├── website-init/SKILL.md
│   └── deploy-init/SKILL.md
├── app/
│   ├── (site)/                  # Public pages with Header/Footer
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Home
│   │   ├── [slug]/page.tsx      # Dynamic pages
│   │   └── not-found.tsx
│   ├── admin/                   # Admin panel (no site chrome)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/admin/               # API routes
│   │   ├── pages/route.ts
│   │   ├── pages/[slug]/route.ts
│   │   ├── site/route.ts
│   │   ├── upload/route.ts
│   │   └── rebuild/route.ts
│   ├── layout.tsx               # Root layout (html/body/fonts/vars)
│   └── globals.css              # Tailwind + shadcn theme
├── components/
│   ├── blocks/                  # Block rendering components
│   ├── admin/                   # Admin panel components
│   │   └── editors/             # Per-block-type editors
│   ├── ui/                      # shadcn/ui components
│   ├── BlockRenderer.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── content/
│   ├── pages/*.json             # Page content
│   ├── uploads/                 # Client-uploaded images
│   └── site.json                # Site config
├── lib/
│   ├── content.ts               # Content loader
│   ├── admin.ts                 # Server-side admin helpers
│   ├── admin-api.ts             # Client-side API wrappers
│   ├── types.ts                 # All TypeScript types
│   └── utils.ts                 # shadcn cn() utility
├── __tests__/                   # Jest tests
├── ARCHITECTURE.md              # Full architecture with Mermaid diagrams
├── CLAUDE.md                    # Agent context
├── AGENTS.md                    # Next.js agent rules
├── Dockerfile
├── deploy.json                  # Created per-site by /website-init
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Git History

The repo is at `Hude06/website-framework` (public). Key commits:
- `feat: initial commit` — Next.js scaffolding
- `feat: complete framework with admin panel, shadcn/ui, and block system` — the big commit with everything
- `feat: add /website-init skill`
- `fix: website-init skill detects if framework already present`
- `feat: add /deploy-init skill and update Dockerfile for production`

## Next Task

Build the `/deploy` skill — the repeatable deploy command for pushing code updates to production after `/deploy-init` has set up the server.
