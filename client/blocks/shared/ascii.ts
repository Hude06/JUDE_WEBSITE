/* Shared bits for the ASCII decorations (hero field, footer ridge). The site
   itself is all Inter; these use the system monospace so columns line up. */
export const ASCII_MONO = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';

let unitWidth = 0;

/** Advance width of one monospace character at `px` font size. */
export function monoCharWidth(px: number): number {
  if (!unitWidth) {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return px * 0.6;
    ctx.font = `100px ${ASCII_MONO}`;
    unitWidth = ctx.measureText('0').width / 100;
  }
  return unitWidth * px;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function cssVar(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
