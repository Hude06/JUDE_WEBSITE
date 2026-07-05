import type { FontPairName } from './themes';

export interface FontPairDefinition {
  name: FontPairName;
  label: string;
  display: string;
  body: string;
  description: string;
}

export const FONT_PAIRS: Record<FontPairName, FontPairDefinition> = {
  editorial: {
    name: 'editorial',
    label: 'Editorial',
    display: 'Instrument Serif',
    body: 'Inter',
    description: 'Warm, magazine-grade serif paired with a neutral reading sans.',
  },
  studio: {
    name: 'studio',
    label: 'Studio',
    display: 'Bricolage Grotesque',
    body: 'JetBrains Mono',
    description: 'Variable grotesque display with a technical monospace body.',
  },
  tech: {
    name: 'tech',
    label: 'Tech',
    display: 'Geist Mono',
    body: 'Geist',
    description: 'Terminal-inspired monospace display paired with Geist body.',
  },
  warm: {
    name: 'warm',
    label: 'Warm',
    display: 'Fraunces',
    body: 'Lora',
    description: 'Variable serif with opsz axis paired with book-quality body serif.',
  },
  monochrome: {
    name: 'monochrome',
    label: 'Monochrome',
    display: 'Geist',
    body: 'Geist',
    description: 'Single sans across all weights — hierarchy via weight and size alone.',
  },
  atelier: {
    name: 'atelier',
    label: 'Atelier',
    display: 'Fraunces',
    body: 'Inter',
    description: 'Oversized opsz-axis serif display over a clean neutral sans for fashion editorial.',
  },
  brutalist: {
    name: 'brutalist',
    label: 'Brutalist',
    display: 'Space Grotesk',
    body: 'JetBrains Mono',
    description: 'Geometric grotesque display with a raw monospace body for poster-grade contrast.',
  },
  console: {
    name: 'console',
    label: 'Console',
    display: 'JetBrains Mono',
    body: 'JetBrains Mono',
    description: 'Full monospace, display and body alike — terminal-native.',
  },
  almanac: {
    name: 'almanac',
    label: 'Almanac',
    display: 'Newsreader',
    body: 'Lora',
    description: 'News serif display over a warm book serif for reference-book gravitas.',
  },
  kinetic: {
    name: 'kinetic',
    label: 'Kinetic',
    display: 'Space Grotesk',
    body: 'Inter',
    description: 'Bold geometric grotesque display with a versatile sans body.',
  },
  salon: {
    name: 'salon',
    label: 'Salon',
    display: 'Playfair Display',
    body: 'Inter',
    description: 'High-contrast couture serif display balanced by a quiet sans body.',
  },
};

export function listFontPairs(): FontPairDefinition[] {
  return Object.values(FONT_PAIRS);
}

export function getFontPair(name: FontPairName): FontPairDefinition {
  const pair = FONT_PAIRS[name];
  if (!pair) throw new Error(`Unknown font pair: ${name}`);
  return pair;
}
