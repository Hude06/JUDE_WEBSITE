/**
 * Review aid — tile every generated crop of one ratio into a contact sheet so
 * bad crops are easy to spot at a glance.
 *
 * Usage: node scripts/instagram/contact-sheet.mjs <ratio> [cellWidth]
 */
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ratio = process.argv[2] || '4x5';
const cellW = Number(process.argv[3] || 460);

const { produced } = JSON.parse(await readFile('instagram/_render.json', 'utf8'));
const items = produced.filter((p) => p.ratio === ratio);
if (!items.length) {
  console.error(`no images for ratio ${ratio}`);
  process.exit(1);
}

const first = await sharp(items[0].file).metadata();
const cellH = Math.round((cellW * first.height) / first.width);
const cols = Math.min(4, items.length);
const rows = Math.ceil(items.length / cols);
const pad = 10;
const label = 26;

const sheetW = cols * cellW + (cols + 1) * pad;
const sheetH = rows * (cellH + label) + (rows + 1) * pad;

const composites = [];
for (const [i, item] of items.entries()) {
  const c = i % cols;
  const r = Math.floor(i / cols);
  const left = pad + c * (cellW + pad);
  const top = pad + r * (cellH + label + pad);
  composites.push({
    input: await sharp(item.file).resize(cellW, cellH).png().toBuffer(),
    left,
    top,
  });
  const text = `${item.name} (${item.mode})`;
  composites.push({
    input: Buffer.from(
      `<svg width="${cellW}" height="${label}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="18" font-family="monospace" font-size="15" fill="#fff">${text.replace(/&/g, '&amp;')}</text></svg>`,
    ),
    left,
    top: top + cellH,
  });
}

await mkdir('instagram/_review', { recursive: true });
const out = path.join('instagram/_review', `sheet-${ratio}.png`);
await sharp({
  create: { width: sheetW, height: sheetH, channels: 3, background: '#2a2a2a' },
})
  .composite(composites)
  .png()
  .toFile(out);

console.log(`${out} — ${items.length} images`);
