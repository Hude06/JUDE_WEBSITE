export type ClassValue = string | false | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Pick a readable foreground (near-black or near-white) for a solid hex color.
 * Used to derive `--accent-foreground` when a site sets a custom `theme.accent`.
 * Falls back to white for anything we can't parse.
 */
export function readableForeground(hex: string): string {
  const parsed = parseHex(hex);
  if (!parsed) return '#ffffff';
  const [r, g, b] = parsed;
  // Relative luminance (sRGB, gamma-approximated) — cheap and good enough here.
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#111111' : '#ffffff';
}

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const int = parseInt(h, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}
