# Website Framework

An open-source, AI-first website framework built on Next.js, React, Tailwind CSS, and shadcn/ui. Designed as a lightweight WordPress alternative for developers who build client websites with Claude.

## What This Is

A reusable framework for building static-ish client websites. You scaffold a new site from this framework, customize it with Claude, deploy it to a Docker container on your server, and hand your client an admin panel where they can edit content without touching code.

## How It Works

1. **Developer scaffolds a new site** from this framework
2. **Developer customizes** the site with Claude (components, styling, content)
3. **Developer deploys** to a Docker container on a Linode server behind Nginx
4. **Client edits content** through an admin panel at `/admin` (text, images, pages, navigation)
5. **Changes auto-sync** to GitHub via git commit + push

## Key Features

- **Block-based content** — pages are JSON files with typed blocks (heading, paragraph, image, badges, card grid, button, separator)
- **Admin panel** at `/admin` — page editor, block gallery, nav editor, image upload, live preview
- **BlockRenderer contract** — admin panel edits data, template renders it. Works with any CSS framework.
- **shadcn/ui components** — Button, Card, Badge, Separator, Dialog, Input, etc.
- **No database** — everything is JSON files in `/content/`
- **No auth code** — Nginx basic auth protects `/admin` on the server
- **Git-backed** — all content changes are committed and pushed to GitHub

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build
npm run build

# Run tests
npm test
```

Visit `http://localhost:3000` for the site, `http://localhost:3000/admin` for the admin panel.

## Project Structure

```
app/
  (site)/              Site pages (with Header + Footer)
    page.tsx           Home page — loads content/pages/home.json
    [slug]/page.tsx    Dynamic pages — loads content/pages/{slug}.json
  admin/               Admin panel (no site chrome)
    page.tsx           Page editor, block gallery, nav editor
  api/admin/           API routes for content CRUD
    pages/             List, create, read, update, delete pages
    site/              Read and update site config (nav, colors, fonts)
    upload/            Image upload
    rebuild/           Trigger npm run build + git commit/push

components/
  blocks/              Block components (HeadingBlock, ParagraphBlock, etc.)
  admin/               Admin panel components (BlockEditor, NavEditor, etc.)
  ui/                  shadcn/ui components
  BlockRenderer.tsx    Maps block types to components — the core contract
  Header.tsx           Site header with nav links from site.json
  Footer.tsx           Site footer

content/
  pages/*.json         Page content files
  uploads/             Client-uploaded images
  site.json            Site config (name, nav links, fonts, colors)

lib/
  content.ts           loadPage(), loadSiteConfig(), listPages()
  admin.ts             Server-side helpers (write, delete, validate, git, rebuild)
  admin-api.ts         Client-side API wrappers
  types.ts             TypeScript types for blocks, pages, config
```

## Block Types

| Type | Description | Editable Fields |
|------|-------------|-----------------|
| `heading` | Section title | text, level (h1-h6) |
| `paragraph` | Text content | text |
| `image` | Image with alt text | src, alt, upload |
| `badge-group` | Group of tags/labels | badge labels |
| `card-grid` | Grid of cards | title, description, link per card |
| `button` | CTA link | text, href, variant |
| `separator` | Horizontal divider | — |

## Adding a New Block Type

1. Add the type interface to `lib/types.ts`
2. Add it to the `Block` union type
3. Create a component in `components/blocks/`
4. Register it in `components/BlockRenderer.tsx`
5. Create an editor in `components/admin/editors/`
6. Register it in `components/admin/BlockEditor.tsx`
7. Add it to `components/admin/BlockGallery.tsx`

## Content File Format

```json
{
  "title": "About",
  "slug": "about",
  "blocks": [
    { "id": "about-1", "type": "heading", "text": "About Me" },
    { "id": "about-2", "type": "paragraph", "text": "I design things..." },
    { "id": "about-3", "type": "image", "src": "/uploads/photo.jpg", "alt": "Photo" }
  ]
}
```

## Deployment

Sites deploy as Docker containers on a Linode server behind Nginx with SSL via Certbot.

- `/admin` and `/api/admin` are protected by Nginx basic auth
- Docker container runs Next.js in standalone mode
- Git deploy key (push-only, single repo) for auto-sync

See [ARCHITECTURE.md](ARCHITECTURE.md) for full deployment flow diagrams.

## Tech Stack

- **Next.js 16** — App Router, standalone output
- **React 19** — server and client components
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — component library (base-ui primitives)
- **TypeScript** — strict mode
- **Jest + Testing Library** — unit and component tests
- **Docker** — containerized deployment
- **Nginx** — reverse proxy, SSL, basic auth

## License

Open source. MIT.
