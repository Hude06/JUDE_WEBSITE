// Builds the site into dist/ as plain files: one HTML file per page, plus the
// JS/CSS bundles, 404.html, sitemap.xml and robots.txt.
//   1. vite build             -> dist/ (browser bundles + index.html template)
//   2. vite build --ssr       -> .ssr/ (the same React code, runnable in Node)
//   3. render every page in content/pages to real HTML using that template
// Run with: npm run build
import { readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, '.ssr');
const SITE_URL = 'https://judemakes.com';

await build({ root, logLevel: 'warn' });
await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true },
});

const { render, listPages } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const template = readFileSync(path.join(dist, 'index.html'), 'utf8');

function writePage(file, slug) {
  const { head, html } = render(slug);
  const out = template
    .replace('<!--app-head-->', head)
    .replace('data-page=""', `data-page="${slug ?? ''}"`)
    .replace('<!--app-html-->', html);
  writeFileSync(path.join(dist, file), out);
  console.log(`  ${file}`);
}

// /about is served from about.html (nginx: try_files $uri $uri.html), so URLs
// keep the same no-trailing-slash form as the old site.
const slugs = listPages().sort();
for (const slug of slugs) writePage(slug === 'home' ? 'index.html' : `${slug}.html`, slug);
writePage('404.html', null);

// sitemap.xml: lastmod is when the page's JSON was last edited, not the build
// time (identical build-time dates on every URL are a signal Google ignores).
const lastmod = (file) => statSync(file).mtime.toISOString();
const urls = slugs.map((slug) => ({
  loc: slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${slug}`,
  lastmod: lastmod(path.join(root, 'content/pages', `${slug}.json`)),
  changefreq: slug === 'home' ? 'weekly' : 'monthly',
  priority: slug === 'home' ? '1' : '0.8',
}));

writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `<url>\n<loc>${u.loc}</loc>\n${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>\n` : ''}<changefreq>${u.changefreq}</changefreq>\n<priority>${u.priority}</priority>\n</url>`,
  )
  .join('\n')}
</urlset>
`,
);
writeFileSync(path.join(dist, 'robots.txt'), `User-Agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log('  sitemap.xml, robots.txt');

rmSync(ssrDir, { recursive: true, force: true });
console.log(`built ${slugs.length + 1} pages into dist/`);
