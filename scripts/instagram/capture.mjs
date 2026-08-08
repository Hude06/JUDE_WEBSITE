/**
 * Step 2 — Screenshot the sites.
 *
 * Desktop 1440x900 @2x and mobile 390x844 @3x. Each run waits for networkidle,
 * scrolls the full page to trigger lazy images, returns to the top, lets fonts
 * settle, dismisses cookie/consent UI, then captures full-page and element
 * shots.
 *
 * Usage: node scripts/instagram/capture.mjs [baseUrl]
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { launch } from './browser.mjs';

const RAW = path.resolve('instagram/_raw');
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * Sections worth shooting, chosen after reading each page. Selectors use class
 * substrings because CSS-module class names carry a build hash; `#work` and
 * `.steps-block` are stable and used directly.
 *
 * `bias: 'top'` marks hero-like shots that should crop from the top of the
 * frame rather than the centre.
 */
const PLANS = {
  judemakes: [
    {
      page: '/',
      shots: [
        { name: 'hero', selector: '[class*="JudeHeroBlock"][class*="root"]', bias: 'top' },
        { name: 'work-grid', selector: '#work' },
        { name: 'how-it-works', selector: '.steps-block' },
        { name: 'off-hours', selector: '[class*="PhotoStripBlock"][class*="root"]' },
        { name: 'home-full', fullPage: true, bias: 'top' },
      ],
      mobile: [
        { name: 'hero-mobile', selector: '[class*="JudeHeroBlock"][class*="root"]', bias: 'top' },
        { name: 'work-grid-mobile', selector: '#work' },
        { name: 'home-full-mobile', fullPage: true, bias: 'top' },
      ],
    },
    {
      page: '/projects',
      shots: [
        { name: 'projects-list', selector: '[class*="CardGridBlock"][class*="listRoot"]' },
        { name: 'projects-full', fullPage: true, bias: 'top' },
      ],
      mobile: [{ name: 'projects-mobile', fullPage: true, bias: 'top' }],
    },
    {
      page: '/about',
      shots: [
        { name: 'about-steps', selector: '.steps-block' },
        { name: 'about-photos', selector: '[class*="PhotoStripBlock"][class*="root"]' },
      ],
      mobile: [],
    },
    {
      page: '/contact',
      shots: [{ name: 'contact', selector: '[class*="ContactFormBlock"][class*="root"]' }],
      mobile: [{ name: 'contact-mobile', selector: '[class*="ContactFormBlock"][class*="root"]' }],
    },
  ],
};

const FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  /* Reveal-on-scroll wrappers start transparent; force their settled state so
     nothing is captured mid-fade. */
  .scroll-reveal, [class*="reveal"], [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
    clip-path: none !important;
  }
`;

const CONSENT_PATTERNS = [
  /^(accept|allow|agree|got it|ok|okay|i agree|accept all|allow all)/i,
  /^(close|dismiss|no thanks|continue)/i,
];

async function dismissOverlays(page) {
  // Try common consent/modal affordances by accessible name, then any element
  // that looks like a fixed-position banner.
  const buttons = await page.$$('button, a[role="button"], [role="dialog"] button');
  for (const btn of buttons) {
    const label = ((await btn.textContent().catch(() => '')) || '').trim();
    if (!label || label.length > 30) continue;
    if (CONSENT_PATTERNS.some((re) => re.test(label))) {
      await btn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(300);
    }
  }
  await page.keyboard.press('Escape').catch(() => {});
}

async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await dismissOverlays(page);
  await page.addStyleTag({ content: FREEZE_CSS }).catch(() => {});

  // Slow scroll to the bottom to trigger lazy loading, then back to the top.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    const height = () => document.body.scrollHeight;
    for (let y = 0; y < height(); y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, height());
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  // Decode every image that has a source, so nothing lands as a grey box.
  await page
    .evaluate(async () => {
      const imgs = Array.from(document.images).filter((i) => i.currentSrc || i.src);
      await Promise.all(
        imgs.map((i) =>
          i.complete && i.naturalWidth > 0
            ? Promise.resolve()
            : i.decode().catch(() => {}),
        ),
      );
    })
    .catch(() => {});

  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(1000); // let fonts settle
}

async function captureTarget(context, slug, plan, mode, baseUrl) {
  const results = [];
  const shots = mode === 'mobile' ? plan.mobile : plan.shots;
  if (!shots?.length) return results;

  const page = await context.newPage();
  const url = new URL(plan.page, baseUrl).href;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await settle(page);

  for (const shot of shots) {
    const file = path.join(RAW, slug, `${shot.name}.png`);
    await mkdir(path.dirname(file), { recursive: true });
    try {
      if (shot.fullPage) {
        await page.screenshot({ path: file, fullPage: true });
      } else {
        const el = await page.$(shot.selector);
        if (!el) {
          console.log(`    ✗ ${shot.name}: selector not found (${shot.selector})`);
          continue;
        }
        await el.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(350);
        await page.evaluate(() => window.scrollBy(0, 0));
        await el.screenshot({ path: file });
      }
      results.push({ slug, name: shot.name, file, mode, bias: shot.bias || 'center', page: plan.page });
      console.log(`    ✓ ${shot.name} (${mode})`);
    } catch (err) {
      console.log(`    ✗ ${shot.name}: ${err.message.split('\n')[0].slice(0, 80)}`);
    }
  }
  await page.close();
  return results;
}

const baseArg = process.argv[2];
const targets = JSON.parse(await readFile('instagram/_targets.json', 'utf8'));
const browser = await launch();
const manifest = [];
const failures = [];

for (const client of targets.clients) {
  const plans = PLANS[client.slug];
  const base = client.self ? baseArg || client.url : client.url;

  if (!plans) {
    // No local plan: this is an external client site. Confirm reachability
    // before deciding it can't be shot.
    const probe = await browser.newContext({ userAgent: UA });
    const page = await probe.newPage();
    let reason = '';
    try {
      const res = await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      reason = `reachable (HTTP ${res?.status()}) but no capture plan defined`;
    } catch (err) {
      reason = err.message.split('\n')[0].slice(0, 120);
    }
    await probe.close();
    console.log(`\n${client.slug}: SKIPPED — ${reason}`);
    failures.push({ slug: client.slug, url: base, reason });
    continue;
  }

  console.log(`\n${client.slug} (${base})`);
  for (const plan of plans) {
    console.log(`  ${plan.page}`);
    const desktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      userAgent: UA,
      reducedMotion: 'reduce',
    });
    manifest.push(...(await captureTarget(desktop, client.slug, plan, 'desktop', base)));
    await desktop.close();

    if (plan.mobile?.length) {
      const mobile = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        reducedMotion: 'reduce',
      });
      manifest.push(...(await captureTarget(mobile, client.slug, plan, 'mobile', base)));
      await mobile.close();
    }
  }
}

await browser.close();
await writeFile('instagram/_captures.json', JSON.stringify({ manifest, failures }, null, 2));
console.log(`\n${manifest.length} captures, ${failures.length} sites skipped`);
