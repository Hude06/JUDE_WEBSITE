import editorial from '../content/themes/editorial.json';
import studio from '../content/themes/studio.json';
import tech from '../content/themes/tech.json';
import warm from '../content/themes/warm.json';
import monochrome from '../content/themes/monochrome.json';
import atelier from '../content/themes/atelier.json';
import brutalist from '../content/themes/brutalist.json';
import console_ from '../content/themes/console.json';
import almanac from '../content/themes/almanac.json';
import kinetic from '../content/themes/kinetic.json';
import salon from '../content/themes/salon.json';
import type { HeroLayout, GridStyle, SectionLayout, QuoteStyle } from './types';

export type ThemePresetName = string;

export type FontPairName =
  | 'editorial'
  | 'studio'
  | 'tech'
  | 'warm'
  | 'monochrome'
  | 'atelier'
  | 'brutalist'
  | 'console'
  | 'almanac'
  | 'kinetic'
  | 'salon';

export interface ThemeColors {
  bg: string;
  fg: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}

export interface ThemeShadow {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeMotion {
  duration: number;
  ease: string;
  stagger: number;
  character: 'snappy' | 'smooth' | 'spring' | 'linear' | 'elastic';
}

/** Layout DNA — how an expressive theme structures blocks by default.
   Every field is optional; unset falls back to the classic (current) layout,
   so a theme without a `structure` block renders exactly like today. Individual
   blocks can always override the theme default via their own optional fields. */
export interface ThemeStructure {
  heroLayout?: HeroLayout;
  gridStyle?: GridStyle;
  sectionLayout?: SectionLayout;
  quoteStyle?: QuoteStyle;
  /** Default container width for hero/section content. */
  containerWidth?: 'narrow' | 'default' | 'wide' | 'full';
  /** Divider language between/inside blocks. */
  rule?: 'hairline' | 'bold' | 'none';
}

/** Typographic character for an expressive theme. */
export interface ThemeType {
  /** Ceiling for display headings. `mega` unlocks --text-8xl/9xl. */
  displayScale?: 'standard' | 'large' | 'mega';
  /** Letter-spacing applied to display headings (e.g. "-0.04em", "0"). */
  displayTracking?: string;
  /** Casing for eyebrow/label text. */
  eyebrowCase?: 'upper' | 'normal';
}

export interface ThemePreset {
  name: ThemePresetName;
  label: string;
  description: string;
  colors: ThemeColors;
  colorsDark?: Partial<ThemeColors>;
  radius: string;
  shadow: ThemeShadow;
  fontPair: FontPairName;
  motion: ThemeMotion;
  atmosphere?: string;
  /** Present on expressive presets — drives layout DNA + type character. */
  structure?: ThemeStructure;
  type?: ThemeType;
}

/** The 5 original framework presets. FROZEN: their rendering must never change,
   so existing deployed sites stay byte-for-byte identical across updates. These
   are color+radius swaps driven by the hardcoded [data-theme] blocks in
   app/globals.css; the fields below (shadow/motion/atmosphere) are metadata for
   tooling only on these presets. */
export const frameworkThemes: Record<string, ThemePreset> = {
  editorial: editorial as ThemePreset,
  studio: studio as ThemePreset,
  tech: tech as ThemePreset,
  warm: warm as ThemePreset,
  monochrome: monochrome as ThemePreset,
};

/** Expressive presets — the opt-in generation. Selecting one of these by name
   activates the art-direction engine (live token injection, atmosphere, motion,
   structural block defaults) in app/layout.tsx. Purely additive: a site only
   gets the new behavior by choosing one of these names. */
export const expressiveThemes: Record<string, ThemePreset> = {
  atelier: atelier as ThemePreset,
  brutalist: brutalist as ThemePreset,
  console: console_ as ThemePreset,
  almanac: almanac as ThemePreset,
  kinetic: kinetic as ThemePreset,
  salon: salon as ThemePreset,
};

/** Every preset the framework ships, classic + expressive. */
export const allThemes: Record<string, ThemePreset> = {
  ...frameworkThemes,
  ...expressiveThemes,
};

export function listThemes(registry: Record<string, ThemePreset> = frameworkThemes): ThemePresetName[] {
  return Object.keys(registry);
}

/** All selectable preset names (classic + expressive), for admin/preview pickers. */
export function listAllThemes(registry: Record<string, ThemePreset> = allThemes): ThemePresetName[] {
  return Object.keys(registry);
}

export function listExpressiveThemes(
  registry: Record<string, ThemePreset> = expressiveThemes,
): ThemePresetName[] {
  return Object.keys(registry);
}

export function loadTheme(
  name: ThemePresetName,
  registry: Record<string, ThemePreset> = frameworkThemes,
): ThemePreset {
  const theme = registry[name];
  if (!theme) {
    throw new Error(`Unknown theme preset: ${name}`);
  }
  return theme;
}

/** Look up any preset (classic or expressive) without throwing. */
export function resolveTheme(
  name: string | undefined | null,
  registry: Record<string, ThemePreset> = allThemes,
): ThemePreset | null {
  if (!name) return null;
  return registry[name] ?? null;
}

/** True when the named preset belongs to the expressive (art-directed) generation. */
export function isExpressiveTheme(
  name: string | undefined | null,
  registry: Record<string, ThemePreset> = expressiveThemes,
): boolean {
  return !!name && name in registry;
}

/**
 * Layout DNA for the active theme, or undefined when the classic path applies.
 * Blocks use this to choose a default variant so the same content renders
 * structurally differently across expressive themes. Classic themes return
 * undefined, so blocks fall back to their original layout.
 */
export function resolveThemeStructure(
  name: string | undefined | null,
  system?: 'classic' | 'expressive',
): ThemeStructure | undefined {
  if (system === 'classic') return undefined;
  const expressive = isExpressiveTheme(name) || system === 'expressive';
  if (!expressive) return undefined;
  return resolveTheme(name)?.structure;
}

/**
 * Map a preset's colors to the actual design-token custom properties the app
 * consumes (the same names app/globals.css sets per [data-theme]). Injected by
 * app/layout.tsx for expressive presets, which have no globals.css block.
 *
 * `--secondary`, `--input`, `--ring` aren't first-class in ThemeColors, so we
 * derive them the same way the classic presets do (muted / border / accent).
 */
export function themeToCssVars(preset: ThemePreset): Record<string, string> {
  const { colors, shadow, radius } = preset;
  return {
    '--background': colors.bg,
    '--foreground': colors.fg,
    '--card': colors.card,
    '--card-foreground': colors.cardForeground,
    '--primary': colors.primary,
    '--primary-foreground': colors.primaryForeground,
    '--secondary': colors.muted,
    '--secondary-foreground': colors.fg,
    '--muted': colors.muted,
    '--muted-foreground': colors.mutedForeground,
    '--accent': colors.accent,
    '--accent-foreground': colors.accentForeground,
    '--border': colors.border,
    '--input': colors.border,
    '--ring': colors.accent,
    '--radius': radius,
    '--shadow-sm': shadow.sm,
    '--shadow-md': shadow.md,
    '--shadow-lg': shadow.lg,
    '--shadow-xl': shadow.xl,
  };
}

/** Dark-mode overrides for a preset, emitted with the same token names as
   themeToCssVars. Only the keys the preset overrides are returned. */
export function themeToDarkCssVars(preset: ThemePreset): Record<string, string> {
  if (!preset.colorsDark) return {};
  const vars: Record<string, string> = {};
  const dark = preset.colorsDark;
  if (dark.bg) vars['--background'] = dark.bg;
  if (dark.fg) {
    vars['--foreground'] = dark.fg;
    vars['--secondary-foreground'] = dark.fg;
  }
  if (dark.card) vars['--card'] = dark.card;
  if (dark.cardForeground) vars['--card-foreground'] = dark.cardForeground;
  if (dark.primary) vars['--primary'] = dark.primary;
  if (dark.primaryForeground) vars['--primary-foreground'] = dark.primaryForeground;
  if (dark.accent) {
    vars['--accent'] = dark.accent;
    vars['--ring'] = dark.accent;
  }
  if (dark.accentForeground) vars['--accent-foreground'] = dark.accentForeground;
  if (dark.muted) {
    vars['--muted'] = dark.muted;
    vars['--secondary'] = dark.muted;
  }
  if (dark.mutedForeground) vars['--muted-foreground'] = dark.mutedForeground;
  if (dark.border) {
    vars['--border'] = dark.border;
    vars['--input'] = dark.border;
  }
  return vars;
}
