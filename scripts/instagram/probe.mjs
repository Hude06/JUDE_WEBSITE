/**
 * Reachability probe.
 *
 * Loads each discovered site in a real Chromium with a real desktop user-agent
 * (some hosts refuse obvious bot traffic). Prints the outcome per site so the
 * capture run knows what it can actually shoot.
 */
import { readFile } from 'node:fs/promises';
import { launch } from './browser.mjs';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const targets = JSON.parse(await readFile('instagram/_targets.json', 'utf8'));
const browser = await launch();
const context = await browser.newContext({
  userAgent: UA,
  viewport: { width: 1440, height: 900 },
  locale: 'en-US',
  extraHTTPHeaders: {
    'Accept-Language': 'en-US,en;q=0.9',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  },
});

for (const client of targets.clients) {
  const url = client.self ? client.publicUrl : client.url;
  if (!url) {
    console.log(`${client.slug.padEnd(20)} SKIP     no url in work grid`);
    continue;
  }
  const page = await context.newPage();
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    const title = await page.title().catch(() => '');
    console.log(`${client.slug.padEnd(20)} ${String(res?.status()).padEnd(8)} ${title.slice(0, 60)}`);
  } catch (err) {
    console.log(`${client.slug.padEnd(20)} FAIL     ${err.message.split('\n')[0].slice(0, 90)}`);
  } finally {
    await page.close();
  }
}

await browser.close();
