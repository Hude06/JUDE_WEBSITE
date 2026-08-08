/**
 * Step 4 — mechanical checks over the generated assets.
 *
 * Confirms exact pixel dimensions per ratio and finds byte-identical outputs
 * (two shots can collapse onto the same frame once both fall back to the phone
 * layout, which would ship the same picture twice).
 *
 * Usage: node scripts/instagram/verify.mjs
 */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const EXPECTED = { '4x5': [1080, 1350], '1x1': [1080, 1080], '9x16': [1080, 1920] };

const { produced } = JSON.parse(await readFile('instagram/_render.json', 'utf8'));
const bad = [];
const hashes = new Map();

for (const item of produced) {
  const buf = await readFile(item.file);
  const meta = await sharp(buf).metadata();
  const [w, h] = EXPECTED[item.ratio];
  if (meta.width !== w || meta.height !== h) {
    bad.push(`${item.file}: expected ${w}x${h}, got ${meta.width}x${meta.height}`);
  }
  const hash = createHash('sha1').update(buf).digest('hex');
  if (hashes.has(hash)) hashes.get(hash).push(item.file);
  else hashes.set(hash, [item.file]);
}

console.log(`checked ${produced.length} images`);
console.log(bad.length ? `WRONG SIZE:\n  ${bad.join('\n  ')}` : 'all dimensions exact');

const dupes = [...hashes.values()].filter((files) => files.length > 1);
if (dupes.length) {
  console.log('\nidentical outputs:');
  for (const files of dupes) console.log(`  ${files.join('\n  = ')}`);
} else {
  console.log('no duplicate images');
}
