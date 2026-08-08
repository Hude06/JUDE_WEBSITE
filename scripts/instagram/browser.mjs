/**
 * Shared Chromium launcher.
 *
 * The container ships a pre-installed Chromium that may not match the build
 * number the installed Playwright expects, so point Playwright at the binary on
 * disk instead of downloading one. Set IG_CHROME to override.
 */
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';

export function chromePath() {
  if (process.env.IG_CHROME) return process.env.IG_CHROME;
  if (!existsSync(ROOT)) return undefined;
  const dirs = readdirSync(ROOT)
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
  for (const dir of dirs) {
    const bin = path.join(ROOT, dir, 'chrome-linux', 'chrome');
    if (existsSync(bin)) return bin;
  }
  return undefined; // fall back to Playwright's own resolution
}

export function launch(options = {}) {
  const executablePath = chromePath();
  return chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    args: ['--font-render-hinting=none', '--disable-lcd-text', '--hide-scrollbars'],
    ...options,
  });
}
