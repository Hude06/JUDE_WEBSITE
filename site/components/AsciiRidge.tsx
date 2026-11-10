import { useEffect, useRef } from 'react';
import { monoCharWidth, prefersReducedMotion } from '@/client/blocks/shared/ascii';

const ROWS = 10;
const PAD = 8; // spare columns either side so the parallax never shows an edge
const LABEL = '* spencer butte';
const PAN_SECONDS = 24; // one sweep of the ridges; they ease back the other way
const SUN_SPEED = 0.6; // columns per second

const CLOUDS = [
  { x: 0.1, y: 0, speed: 0.6, art: [' .--. ', '(____)'] },
  { x: 0.45, y: 1, speed: 0.35, art: ['   .-.', '.-(   ).', '(___.__)_)'] },
  { x: 0.8, y: 0, speed: 0.5, art: [' .-.', '(___)'] },
];

function esc(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
}

/** Heights of overlapping slope-1 peaks, one value per column. */
function heights(n: number, peaks: [number, number][]) {
  return Array.from({ length: n + 1 }, (_, x) => Math.max(0, ...peaks.map(([c, h]) => h - Math.abs(x - c))));
}

/** The row a column's ridge character sits on, and the character. */
function edge(h: number[], x: number): [number, string] {
  const a = h[x], b = h[x + 1];
  if (b > a) return [ROWS - 1 - a, '/'];
  if (b < a) return [ROWS - a, '\\'];
  return [ROWS - 1 - a, a === 0 ? '_' : h[x - 1] < a ? '/' : '\\'];
}

/*
  An ASCII Eugene skyline along the bottom of the closing CTA. It runs on its
  own: the two ridges pan slowly against each other, the sun crosses the sky,
  clouds drift and the odd bird flies over.

  The mountains are text drawn once. Every movement is a CSS steps() animation
  on a transform, so the compositor runs it; JS only runs once per bird.
*/
export function AsciiRidge() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    const sky = el.querySelector<HTMLDivElement>('[data-sky]')!;
    const farEl = el.querySelector<HTMLPreElement>('[data-far]')!;
    const nearEl = el.querySelector<HTMLPreElement>('[data-near]')!;
    const sun = el.querySelector<HTMLPreElement>('[data-sun]')!;
    let cols = 0, cw = 0, lh = 0;
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    const build = () => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      const c = Math.floor(el.clientWidth / monoCharWidth(fs));
      if (c < 10 || c === cols) return;
      cols = c;
      cw = monoCharWidth(fs);
      lh = fs * 1.1;
      seed = 7;
      const n = cols + PAD * 2;
      const butte = Math.round(cols * 0.7) + PAD;
      const nearPeaks: [number, number][] = [[butte, 6]];
      const farPeaks: [number, number][] = [];
      for (let x = 2; x < n; x += 4 + Math.floor(rand() * 7)) {
        if (Math.abs(x - butte) > 5) nearPeaks.push([x, 1 + Math.floor(rand() * 3)]);
      }
      for (let x = 0; x < n; x += 6 + Math.floor(rand() * 9)) farPeaks.push([x, 2 + Math.floor(rand() * 3)]);
      const near = heights(n, nearPeaks);
      const far = heights(n, farPeaks);
      const farGrid = Array.from({ length: ROWS }, () => Array<string>(n).fill(' '));
      const nearGrid = Array.from({ length: ROWS }, () => Array<string>(n).fill(' '));
      for (let x = 0; x < n; x++) {
        const [fr, fc] = edge(far, x);
        const [nr, nc] = edge(near, x);
        if (fr < nr) farGrid[fr][x] = fc; // the near ridge hides the far one
        nearGrid[nr][x] = nc;
        for (let r = nr + 2; r < ROWS; r++) if (rand() < 0.05) nearGrid[r][x] = rand() < 0.5 ? '.' : "'";
      }
      const labelRow = ROWS - 1 - near[butte];
      farEl.textContent = farGrid.map((r) => r.join('')).join('\n');
      nearEl.innerHTML = nearGrid
        .map((r, y) => {
          const line = r.join('');
          if (y !== labelRow) return esc(line);
          return `${esc(line.slice(0, butte))}<span class="ascii-ridge__mark">*</span><span class="ascii-ridge__label">${esc(LABEL.slice(1))}</span>${esc(line.slice(butte + LABEL.length))}`;
        })
        .join('\n');
      el.style.height = `${ROWS * lh}px`;

      // clouds: one element each, slid across in whole-column steps
      sky.querySelectorAll('[data-cloud]').forEach((e) => e.remove());
      for (const cloud of CLOUDS) {
        const w = Math.max(...cloud.art.map((l) => l.length));
        const span = cols + w;
        const duration = span / cloud.speed;
        const pre = document.createElement('pre');
        pre.dataset.cloud = '';
        pre.className = 'ascii-ridge__cloud';
        pre.textContent = cloud.art.join('\n');
        pre.style.top = `${cloud.y * lh}px`;
        pre.style.setProperty('--from', `${-w * cw}px`);
        pre.style.setProperty('--to', `${cols * cw}px`);
        pre.style.animationDuration = `${duration}s`;
        pre.style.animationTimingFunction = `steps(${span})`;
        pre.style.animationDelay = `${-cloud.x * duration}s`;
        sky.prepend(pre);
      }

      // ridges pan back and forth, the near one further, so they slide past each other
      const pan = (layer: HTMLPreElement, depth: number) => {
        const half = depth / 2;
        layer.style.transform = `translateX(${-PAD * cw}px)`; // resting place under reduced motion
        layer.style.setProperty('--from', `${-(PAD - half) * cw}px`);
        layer.style.setProperty('--to', `${-(PAD + half) * cw}px`);
        layer.style.animationDuration = `${PAN_SECONDS}s`;
        layer.style.animationTimingFunction = `steps(${depth})`;
        layer.style.animationDelay = `${-PAN_SECONDS / 2}s`;
      };
      pan(farEl, 3);
      pan(nearEl, 8);

      // the sun crosses left to right, starting mid-sky
      const sunSpan = cols - 8;
      sun.style.transform = `translateX(${Math.round(sunSpan / 2) * cw}px)`;
      sun.style.setProperty('--from', `${cw}px`);
      sun.style.setProperty('--to', `${(sunSpan + 1) * cw}px`);
      sun.style.animationDuration = `${sunSpan / SUN_SPEED}s`;
      sun.style.animationTimingFunction = `steps(${sunSpan})`;
      sun.style.animationDelay = `${-sunSpan / SUN_SPEED / 2}s`;
    };

    const bird = (col: number, row: number, speed: number) => {
      if (reduce) return;
      const b = document.createElement('span');
      b.className = 'ascii-ridge__bird';
      b.innerHTML = '<i>v</i><i>-</i>';
      const span = Math.max(1, cols + 2 - col);
      b.style.top = `${row * lh}px`;
      b.style.setProperty('--from', `${col * cw}px`);
      b.style.setProperty('--to', `${(cols + 2) * cw}px`);
      b.style.animationDuration = `${span / speed}s`;
      b.style.animationTimingFunction = `steps(${span})`;
      b.addEventListener('animationend', (e) => {
        if (e.target === b) b.remove();
      });
      sky.appendChild(b);
    };

    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    const birdTimer = setInterval(() => {
      if (visible && !document.hidden) bird(0, 1 + Math.floor(rand() * 3), 5 + rand() * 3);
    }, 7000);

    const resize = new ResizeObserver(build);
    resize.observe(el);
    build();

    return () => {
      clearInterval(birdTimer);
      io.disconnect();
      resize.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="ascii-ridge" aria-hidden>
      <div data-sky className="ascii-ridge__sky">
        <pre data-sun className="ascii-ridge__sun">{' \\ | /\n-- O --\n / | \\'}</pre>
      </div>
      <pre data-far className="ascii-ridge__far" />
      <pre data-near className="ascii-ridge__near" />
    </div>
  );
}
