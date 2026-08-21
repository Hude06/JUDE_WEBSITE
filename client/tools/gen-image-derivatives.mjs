/*
  Generates responsive AVIF/WebP derivatives for everything in public/uploads
  and writes the manifest that <ResponsiveImage> reads.

    node client/tools/gen-image-derivatives.mjs

  Re-run after adding images through /admin. Derivatives are written next to
  the original as `<name>-<width>.<ext>`; originals are left untouched and stay
  the <img src> fallback.

  Static derivatives (rather than next/image) on purpose: the standalone build
  has bitten us before on runtime asset handling, and nginx already caches
  /uploads for 30 days.
*/
import { readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '../..');
const UPLOADS = path.join(ROOT, 'public/uploads');
const MANIFEST = path.join(ROOT, 'client/blocks/shared/image-derivatives.json');

/* One ladder for every image; the per-block `sizes` attribute decides which
   rung a browser actually pulls. Rungs wider than the original are skipped. */
const LADDER = [320, 480, 640, 800, 1000, 1280, 1600, 2000];
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
/* Skip files that are already a derivative we made. */
const DERIVATIVE = /-\d{3,4}\.(avif|webp)$/;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const files = (await walk(UPLOADS)).filter(
  (f) => SOURCE_EXT.has(path.extname(f).toLowerCase()) && !DERIVATIVE.test(f)
);

const manifest = {};
let written = 0;
let bytesBefore = 0;
let bytesAfter = 0;

for (const file of files) {
  const rel = '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/');
  const image = sharp(file, { failOn: 'none' });
  const meta = await image.metadata();
  if (!meta.width || !meta.height) {
    console.warn('skip (no dimensions):', rel);
    continue;
  }

  const widths = LADDER.filter((w) => w < meta.width);
  /* Always include the native width so the top rung is the real image. */
  widths.push(meta.width);

  const dir = path.dirname(file);
  const base = path.basename(file, path.extname(file));
  bytesBefore += (await stat(file)).size;

  for (const w of widths) {
    for (const [ext, encode] of [
      ['avif', (p) => p.avif({ quality: 55, effort: 6 })],
      ['webp', (p) => p.webp({ quality: 78, effort: 5 })],
    ]) {
      const outPath = path.join(dir, `${base}-${w}.${ext}`);
      if (existsSync(outPath)) {
        bytesAfter += (await stat(outPath)).size;
        continue;
      }
      await encode(sharp(file, { failOn: 'none' }).resize({ width: w, withoutEnlargement: true }))
        .toFile(outPath);
      bytesAfter += (await stat(outPath)).size;
      written++;
    }
  }

  manifest[rel] = {
    width: meta.width,
    height: meta.height,
    widths,
    base: rel.slice(0, rel.lastIndexOf('.')),
  };
  console.log(`${rel}  ${meta.width}×${meta.height}  →  ${widths.length} widths`);
}

await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

console.log(
  `\n${files.length} sources · ${written} new derivatives · manifest → ${path.relative(ROOT, MANIFEST)}`
);
console.log(
  `originals ${(bytesBefore / 1024).toFixed(0)}KB · all derivatives ${(bytesAfter / 1024).toFixed(0)}KB`
);
