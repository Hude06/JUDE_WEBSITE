import { useEffect, useRef } from 'react';
import { ASCII_MONO, cssVar, monoCharWidth, prefersReducedMotion } from '@/client/blocks/shared/ascii';
import styles from './AsciiField.module.css';

const RAMP = ' .:-=+*#';
const FONT_PX = 12;
const SIDE = 0.3; // each side strip is 30% of the hero; the middle is never drawn
const LENS_RADIUS = 260;
const RIPPLE_SPEED = 520; // px per second
const RIPPLE_LIFE = 1.6; // seconds

type Ripple = { x: number; y: number; t0: number };

function hash(i: number, j: number, k: number) {
  let h = (i * 374761393 + j * 668265263 + k * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/*
  Quiet ASCII weather down both sides of the hero. Near the cursor the
  characters thicken and turn pink; a click sends a ring out across them.

  Idle costs no JavaScript: each side's pattern is drawn once into a canvas two
  periods wide and slid one column at a time by a CSS steps() animation, which
  the compositor runs. A second canvas per side redraws only while the pointer
  is moving or a ripple is live, and only the cells it touches.
*/
export function AsciiField() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.parentElement;
    if (!root || !hero) return;
    const reduce = prefersReducedMotion();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const sides = [...root.querySelectorAll<HTMLDivElement>('[data-side]')].map((box) => ({
      box,
      left: box.dataset.side === 'left',
      drift: box.querySelector<HTMLCanvasElement>('[data-layer="drift"]')!,
      fx: box.querySelector<HTMLCanvasElement>('[data-layer="fx"]')!,
      x0: 0,
      dirty: null as null | [number, number, number, number],
    }));
    let W = 0, H = 0, cw = 0, ch = 0, rows = 0, cols = 0;

    const context = (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_PX}px ${ASCII_MONO}`;
      ctx.textBaseline = 'top';
      return ctx;
    };

    // The drifting pattern is periodic over `cols`, so two periods slide seamlessly.
    const paint = () => {
      const ink = cssVar('--ink', '#141a2a');
      const TAU = Math.PI * 2;
      for (const s of sides) {
        s.drift.width = Math.round(cols * 2 * cw * dpr);
        s.drift.height = Math.round(H * dpr);
        s.drift.style.width = `${cols * 2 * cw}px`;
        s.drift.style.setProperty('--shift', `${-cols * cw}px`);
        s.drift.style.animationDuration = `${cols / 2.5}s`;
        s.drift.style.animationTimingFunction = `steps(${cols})`;
        const ctx = context(s.drift);
        ctx.fillStyle = ink;
        for (let i = 0; i < cols * 2; i++) {
          const u = (i % cols) / cols;
          for (let j = 0; j < rows; j++) {
            // soft blobs: products of sines, periodic in u
            const n =
              Math.sin(TAU * 2 * u) * Math.sin(j * 0.33 + 0.7) +
              0.7 * Math.sin(TAU * 3 * u + 1.3) * Math.sin(j * 0.19 + 2.1) +
              0.45 * Math.sin(TAU * 5 * u + j * 0.28);
            const v = Math.max(0, Math.min(1, (n + 1.6) / 3.2));
            const k = Math.floor(Math.min(0.999, v * v * v * 1.15) * RAMP.length);
            if (!k) continue;
            ctx.globalAlpha = 0.12 + 0.3 * v;
            ctx.fillText(RAMP[k], i * cw, j * ch);
          }
        }
        ctx.globalAlpha = 1;
      }
    };

    let lastSize = '';
    const size = () => {
      const r = hero.getBoundingClientRect();
      const key = `${Math.round(r.width)}x${Math.round(r.height)}`;
      if (key === lastSize) return;
      lastSize = key;
      W = r.width;
      H = r.height;
      cw = monoCharWidth(FONT_PX) + 1;
      ch = FONT_PX * 1.3;
      rows = Math.ceil(H / ch);
      cols = Math.ceil((W * SIDE) / cw);
      const total = Math.ceil(W / cw);
      for (const s of sides) {
        s.x0 = s.left ? 0 : (total - cols) * cw;
        s.box.style.width = `${cols * cw}px`;
        s.box.style.left = `${s.x0}px`;
        s.fx.width = Math.round(cols * cw * dpr);
        s.fx.height = Math.round(H * dpr);
        s.fx.style.width = `${cols * cw}px`;
        s.dirty = null;
      }
      paint();
    };
    size();
    const resize = new ResizeObserver(size);
    resize.observe(hero);

    // —— interaction layer ——
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;
    const pointer = { x: -1e4, y: -1e4, at: -10 };
    const ripples: Ripple[] = [];
    let running = false;
    let frame = 0;
    let lastDraw = 0;

    const pointerLive = () => now() - pointer.at < 0.5;
    const live = () => pointerLive() || ripples.some((r) => now() - r.t0 < RIPPLE_LIFE);

    const drawFx = () => {
      const clock = now();
      const spark = cssVar('--accent', '#c81f65');
      const rs = ripples.filter((r) => clock - r.t0 < RIPPLE_LIFE);
      const flick = Math.floor(clock * 10);
      const lens = pointerLive();
      for (const s of sides) {
        const ctx = context(s.fx);
        if (s.dirty) ctx.clearRect(s.dirty[0], s.dirty[1], s.dirty[2] - s.dirty[0], s.dirty[3] - s.dirty[1]);
        s.dirty = null;
        // only visit cells near the pointer or under a ripple's reach
        const areas: [number, number, number, number][] = [];
        const lx = pointer.x - s.x0;
        if (lens && lx > -LENS_RADIUS && lx < cols * cw + LENS_RADIUS) {
          areas.push([lx - LENS_RADIUS, pointer.y - LENS_RADIUS, lx + LENS_RADIUS, pointer.y + LENS_RADIUS]);
        }
        for (const r of rs) {
          const reach = (clock - r.t0) * RIPPLE_SPEED + 80;
          areas.push([r.x - s.x0 - reach, r.y - reach, r.x - s.x0 + reach, r.y + reach]);
        }
        if (!areas.length) continue;
        const i0 = Math.max(0, Math.floor(Math.min(...areas.map((a) => a[0])) / cw));
        const i1 = Math.min(cols, Math.ceil(Math.max(...areas.map((a) => a[2])) / cw));
        const j0 = Math.max(0, Math.floor(Math.min(...areas.map((a) => a[1])) / ch));
        const j1 = Math.min(rows, Math.ceil(Math.max(...areas.map((a) => a[3])) / ch));
        if (i0 >= i1 || j0 >= j1) continue;
        ctx.fillStyle = spark;
        for (let i = i0; i < i1; i++) {
          const x = i * cw;
          const gx = x + s.x0;
          for (let j = j0; j < j1; j++) {
            const y = j * ch;
            let hot = 0;
            if (lens) {
              const d2 = (gx - pointer.x) ** 2 + (y - pointer.y) ** 2;
              if (d2 < LENS_RADIUS ** 2) hot = Math.exp(-d2 / 14400);
            }
            for (const r of rs) {
              const age = clock - r.t0;
              const dd = Math.hypot(gx - r.x, y - r.y) - age * RIPPLE_SPEED;
              if (dd > -70 && dd < 70) hot = Math.max(hot, Math.exp(-((dd / 26) ** 2)) * (1 - age / RIPPLE_LIFE));
            }
            if (hot < 0.18) continue;
            const k = Math.max(1, Math.floor(Math.min(0.999, hot * (0.5 + 0.5 * hash(i, j, flick))) * RAMP.length));
            ctx.globalAlpha = Math.min(0.85, hot);
            ctx.fillText(RAMP[k], x, y);
          }
        }
        ctx.globalAlpha = 1;
        s.dirty = [i0 * cw, j0 * ch, i1 * cw, j1 * ch];
      }
    };

    const tick = (ts: number) => {
      if (!live()) {
        running = false;
        drawFx(); // clears the last lit cells
        return;
      }
      if (ts - lastDraw > 40) {
        lastDraw = ts;
        drawFx();
      }
      frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (reduce) return drawFx();
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const local = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      Object.assign(pointer, local(e), { at: now() });
      wake();
    };
    const onLeave = () => {
      pointer.x = pointer.y = -1e4;
    };
    const onDown = (e: PointerEvent) => {
      ripples.push({ ...local(e), t0: now() });
      if (ripples.length > 3) ripples.shift();
      wake();
    };
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave);
    hero.addEventListener('pointerdown', onDown);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden>
      {(['left', 'right'] as const).map((side) => (
        <div key={side} data-side={side} className={`${styles.side} ${side === 'left' ? styles.left : styles.right}`}>
          <canvas data-layer="drift" className={`${styles.layer} ${styles.drift}`} />
          <canvas data-layer="fx" className={styles.layer} />
        </div>
      ))}
    </div>
  );
}
