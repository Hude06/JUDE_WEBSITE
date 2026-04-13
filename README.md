# Jude Makes Things

Website for Jude — a designer who makes clean, modern websites.

## Local Development

```bash
npm run dev
```

Visit http://localhost:3000 for the site, http://localhost:3000/admin for the admin panel.

## Deployment

Run `/deploy-init` in Claude for first-time server setup, then `/deploy` for updates.

## Content

Edit content through the admin panel or directly in these files:

- Pages: `content/pages/*.json`
- Site config: `content/site.json`
- Uploads: `public/uploads/` (served directly by Next.js)

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for full system diagrams.
