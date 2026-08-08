/**
 * Step 3 (production pass) — render final Instagram assets.
 *
 * Cropping a tight element shot down to 9:16 leaves a narrow sliver that both
 * upscales and composes badly. Instead this pass derives a *page region* from
 * each element's bounding box, expanded to the exact target aspect ratio and
 * clamped to the page, then screenshots that region and downsamples it to
 * 1080px wide. Every output is a genuine downsample: no stretching, no
 * letterboxing, no upscaling.
 *
 * A region is only ever grown vertically. Narrowing a desktop layout to reach
 * 9:16 would slice through the text, so when a page cannot supply the needed
 * height at full width the shot is re-sourced from the phone layout, which
 * reflows tall and narrow naturally.
 *
 * Output: instagram/<slug>/<section>-<ratio>.png
 *
 * Usage: node scripts/instagram/shoot.mjs [baseUrl]
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { launch } from './browser.mjs';
import { PLANS, settle, UA, MOBILE_UA } from './shots.mjs';

const RATIOS = [
  { key: '4x5', width: 1080, height: 1350 },
  { key: '1x1', width: 1080, height: 1080 },
  { key: '9x16', width: 1080, height: 1920 },
];

const VIEWPORTS = {
  desktop: {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent: UA,
    reducedMotion: 'reduce',
  },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: MOBILE_UA,
    reducedMotion: 'reduce',
  },
};

/**
 * Build a capture region with the exact target aspect ratio around `box`,
 * growing vertically into the surrounding page when the element is too short.
 * Returns `narrowed: true` when the page ran out of height and the region had
 * to lose width to hit the ratio — the caller treats that as a failed fit.
 */
export function regionFor(box, page, ratio, bias = 'section', pad = 32) {
  const aspect = ratio.width / ratio.height;
  let w = Math.min(box.width, page.width);
  let h = w / aspect;
  let narrowed = false;

  if (h > page.height) {
    h = page.height;
    w = h * aspect;
    narrowed = true;
  }

  // Anchor the top of the frame just above the section rather than centring
  // it. Centring a tall frame on a short section slices through the section's
  // own heading; anchoring keeps the heading intact and lets the overflow
  // spill into the whitespace below, where a cut reads as intentional.
  const y = bias === 'top' ? box.y : box.y - pad;
  let x = box.x + (box.width - w) / 2;

  x = Math.max(0, Math.min(x, page.width - w));
  const clampedY = Math.max(0, Math.min(y, page.height - h));

  return {
    x: Math.round(x),
    y: Math.round(clampedY),
    width: Math.round(w),
    height: Math.round(h),
    narrowed,
    // False when the section sits too near the end of the page for the frame
    // to start where it should, so the frame drags in whatever precedes it.
    anchored: Math.abs(clampedY - y) <= 2,
  };
}

async function openPage(browser, mode, url) {
  const context = await browser.newContext(VIEWPORTS[mode]);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await settle(page);
  const size = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  return { context, page, size, scale: VIEWPORTS[mode].deviceScaleFactor };
}

async function boxFor(page, shot, size) {
  if (shot.fullPage) return { x: 0, y: 0, width: size.width, height: size.height };
  const el = await page.$(shot.selector);
  if (!el) return null;
  await el.scrollIntoViewIfNeeded().catch(() => {});
  return el.evaluate((node) => {
    const r = node.getBoundingClientRect();
    let top = r.top;

    // A section's heading usually lives in a sibling block just above it.
    // Pulling it into the frame gives the crop a title instead of starting
    // mid-content, and stops a fixed pad from slicing that heading in half.
    let prev = node.previousElementSibling;
    while (prev) {
      const pr = prev.getBoundingClientRect();
      if (pr.bottom > r.top) break; // not actually above
      if (r.top - pr.bottom > 200) break; // too far to belong to this section
      // Only absorb a standalone heading block. Without the height guard this
      // walks into the whole preceding section — every section contains a
      // heading somewhere — and the frame captures the wrong content entirely.
      const isHeadingBlock =
        pr.height <= 200 && (/^H[1-4]$/.test(prev.tagName) || prev.querySelector('h1, h2, h3, h4'));
      if (isHeadingBlock) {
        top = pr.top;
        break;
      }
      prev = prev.previousElementSibling;
    }

    return {
      x: r.left + window.scrollX,
      y: top + window.scrollY,
      width: r.width,
      height: r.bottom - top,
    };
  });
}

const baseArg = process.argv[2];
const targets = JSON.parse(await readFile('instagram/_targets.json', 'utf8'));
const browser = await launch();
const produced = [];
const skipped = [];

for (const client of targets.clients) {
  const plans = PLANS[client.slug];
  const base = client.self ? baseArg || client.url : client.url;
  if (!plans) {
    skipped.push({ slug: client.slug, url: base, reason: 'unreachable — no capture possible' });
    continue;
  }

  console.log(`\n${client.slug}`);
  for (const plan of plans) {
    const url = new URL(plan.page, base).href;
    const views = {
      desktop: await openPage(browser, 'desktop', url),
      mobile: await openPage(browser, 'mobile', url),
    };

    for (const shot of plan.shots) {
      const boxes = {
        desktop: await boxFor(views.desktop.page, shot, views.desktop.size),
        mobile: await boxFor(views.mobile.page, shot, views.mobile.size),
      };
      if (!boxes.desktop && !boxes.mobile) {
        console.log(`  ✗ ${shot.name}: selector not found`);
        skipped.push({ slug: client.slug, name: shot.name, reason: 'selector not found' });
        continue;
      }

      const notes = [];
      for (const ratio of RATIOS) {
        // Prefer the shot's own viewport, then fall back to the other one if
        // the preferred page is too short to supply this ratio at full width.
        const order =
          shot.prefer === 'mobile' ? ['mobile', 'desktop'] : ['desktop', 'mobile'];
        // Rank candidates: a frame that keeps full width and starts where the
        // section starts beats one that only keeps full width, which in turn
        // beats a narrowed slice.
        const score = (r) => (r.narrowed ? 0 : r.anchored ? 2 : 1);
        let chosen = null;
        for (const mode of order) {
          if (!boxes[mode]) continue;
          const region = regionFor(
            boxes[mode],
            views[mode].size,
            ratio,
            shot.bias === 'top' ? 'top' : 'section',
            mode === 'mobile' ? 10 : 20,
          );
          if (!chosen || score(region) > score(chosen.region)) chosen = { mode, region };
          if (score(region) === 2) break;
        }
        if (!chosen) continue;

        const outDir = path.join('instagram', client.slug);
        await mkdir(outDir, { recursive: true });
        const out = path.join(outDir, `${shot.name}-${ratio.key}.png`);
        try {
          const { region, mode } = chosen;
          const buf = await views[mode].page.screenshot({
            clip: { x: region.x, y: region.y, width: region.width, height: region.height },
            fullPage: true,
          });
          const meta = await sharp(buf).metadata();
          await sharp(buf)
            .resize(ratio.width, ratio.height, { fit: 'fill', kernel: 'lanczos3' })
            .png({ compressionLevel: 9 })
            .toFile(out);
          produced.push({
            slug: client.slug,
            name: shot.name,
            ratio: ratio.key,
            mode,
            file: out,
            region,
            captured: `${meta.width}x${meta.height}`,
            upscaled: meta.width < ratio.width,
            narrowed: region.narrowed,
          });
          notes.push(`${ratio.key}:${mode}${region.narrowed ? '(narrowed)' : ''}`);
        } catch (err) {
          console.log(`  ✗ ${shot.name}-${ratio.key}: ${err.message.split('\n')[0].slice(0, 70)}`);
          skipped.push({
            slug: client.slug,
            name: `${shot.name}-${ratio.key}`,
            reason: err.message.slice(0, 90),
          });
        }
      }
      console.log(`  ✓ ${shot.name} — ${notes.join('  ')}`);
    }

    for (const view of Object.values(views)) await view.context.close();
  }
}

await browser.close();
await writeFile('instagram/_render.json', JSON.stringify({ produced, skipped }, null, 2));

const up = produced.filter((p) => p.upscaled);
const nar = produced.filter((p) => p.narrowed);
console.log(`\n${produced.length} images written.`);
console.log(up.length ? `${up.length} upscaled` : 'All outputs are clean downsamples.');
if (nar.length) {
  console.log(`${nar.length} still narrowed (page too short in both layouts):`);
  for (const n of nar) console.log(`  ${n.slug}/${n.name}-${n.ratio}`);
}
