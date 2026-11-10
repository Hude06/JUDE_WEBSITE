# judemakes.com

Jude Hill's site, built with Vite into plain static files (no server code).

```
npm install          # once
npm run dev          # local preview at http://localhost:5173 (renders in the browser)
npm run build        # dist/: one HTML file per page + JS/CSS, sitemap.xml, robots.txt, 404.html
npm run typecheck
```

Deploy (from ~/xp/prod-server):

```
./deploy.sh site judemakes.com ~/xp/jude-website/new-site/dist
```

## Where things are

- `content/pages/*.json` — page text, one file per page; the file name is the URL (`about.json` → `/about`, `home.json` → `/`)
- `content/site.json` — site name and nav links
- `client/blocks/` — the page blocks the JSON refers to by `type`; `client/registry.ts` maps types to blocks
- `site/` — header, footer, 404, global CSS (`styles.css`), SEO tags (`metadata.ts`), fonts (`fonts.css`)
- `public/` — copied into `dist/` as-is (images in `public/uploads/`, Inter in `public/fonts/`)
- `src/` — Vite entry points; `scripts/build.mjs` prerenders every page to HTML
- `vendor/moodie-react-0.5.1.tgz` — the header face, checked against the lockfile hash the old site used

The contact form posts straight to FormSubmit (`formsubmit.co`); nothing runs on our server.

Still third-party code shipped to visitors: react, react-dom, @moodie/react, motion.
