/**
 * Step 1 — Discover the sites.
 *
 * Reads the "Selected work" section straight out of the rendered DOM so the
 * list stays current as work is added. Nothing about the client list is
 * hardcoded here: names, years, taglines, domains and status all come from the
 * page. judemakes.com itself is appended as its own entry.
 *
 * Usage: node scripts/instagram/discover.mjs [baseUrl]
 */
import { launch } from './browser.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.argv[2] || process.env.IG_BASE_URL || 'http://127.0.0.1:3000';
const OUT = path.resolve('instagram/_targets.json');

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function discover(baseUrl) {
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60_000 });

  // #work is a stable anchor id; the card/meta classes are CSS-module hashed,
  // so match on class substrings rather than exact generated names.
  const items = await page.$$eval('#work [class*="__card"]', (cards) =>
    cards
      .map((card) => {
        const pick = (frag) => {
          const el = card.querySelector(`[class*="__${frag}"]`);
          return el ? el.textContent.trim() : '';
        };
        return {
          name: pick('name'),
          year: pick('year'),
          tagline: pick('tagline'),
          domain: pick('domain'),
          link: card.getAttribute('href') || '',
          image: card.querySelector('img')?.getAttribute('src') || '',
        };
      })
      // The grid renders a trailing "your project here" placeholder card with
      // no name — drop anything unnamed.
      .filter((item) => item.name),
  );

  const heading = await page
    .$eval('#work [class*="__heading"]', (el) => el.textContent.trim())
    .catch(() => 'Selected work');

  await browser.close();

  const clients = items.map((item) => {
    // The year cell doubles as a status chip for archived work ("2024 · archived").
    const [year, ...rest] = item.year.split('·').map((part) => part.trim());
    const flagged = rest.join(' ').toLowerCase();
    return {
      ...item,
      year,
      slug: slugify(item.name),
      status: flagged || (item.link ? 'live' : 'archived'),
      url: item.link || (item.domain ? `https://${item.domain}` : ''),
      self: false,
    };
  });

  // The portfolio site itself — the fourth entry.
  clients.push({
    name: 'Jude Makes Things',
    slug: 'judemakes',
    domain: 'judemakes.com',
    url: baseUrl,
    publicUrl: 'https://judemakes.com',
    tagline: "Jude Hill's portfolio — web design and development in Eugene, Oregon.",
    year: '2025',
    status: 'live',
    self: true,
  });

  return { heading, baseUrl, discoveredAt: new Date().toISOString(), clients };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await discover(BASE);
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(result, null, 2));
  console.log(`"${result.heading}" — ${result.clients.length} entries\n`);
  for (const c of result.clients) {
    console.log(
      `  ${c.slug.padEnd(20)} ${(c.year || '----').padEnd(6)} ${c.status.padEnd(9)} ${c.domain || '(none)'}`,
    );
    console.log(`  ${''.padEnd(20)} ${c.tagline}`);
  }
  console.log(`\nWrote ${OUT}`);
}
