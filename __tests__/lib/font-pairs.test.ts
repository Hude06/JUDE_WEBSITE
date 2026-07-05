import { FONT_PAIRS, listFontPairs, getFontPair } from '@/lib/font-pairs';

const CLASSIC_PAIRS = ['editorial', 'studio', 'tech', 'warm', 'monochrome'] as const;
const EXPRESSIVE_PAIRS = ['atelier', 'brutalist', 'console', 'almanac', 'kinetic', 'salon'] as const;

describe('FONT_PAIRS', () => {
  it('keeps all 5 classic pair names', () => {
    for (const name of CLASSIC_PAIRS) {
      expect(FONT_PAIRS).toHaveProperty(name);
    }
  });

  it('adds the expressive pair names', () => {
    for (const name of EXPRESSIVE_PAIRS) {
      expect(FONT_PAIRS).toHaveProperty(name);
    }
    expect(Object.keys(FONT_PAIRS)).toHaveLength(CLASSIC_PAIRS.length + EXPRESSIVE_PAIRS.length);
  });

  it('editorial pair uses Instrument Serif display', () => {
    expect(FONT_PAIRS.editorial.display).toBe('Instrument Serif');
    expect(FONT_PAIRS.editorial.body).toBe('Inter');
  });

  it('tech pair uses Geist Mono display', () => {
    expect(FONT_PAIRS.tech.display).toBe('Geist Mono');
  });

  it('warm pair uses Fraunces', () => {
    expect(FONT_PAIRS.warm.display).toBe('Fraunces');
  });

  it('monochrome pair uses same font for display and body', () => {
    expect(FONT_PAIRS.monochrome.display).toBe(FONT_PAIRS.monochrome.body);
  });
});

describe('listFontPairs', () => {
  it('returns an array of all pairs', () => {
    const pairs = listFontPairs();
    expect(pairs).toHaveLength(CLASSIC_PAIRS.length + EXPRESSIVE_PAIRS.length);
    for (const pair of pairs) {
      expect(pair.name).toBeDefined();
      expect(pair.display).toBeDefined();
      expect(pair.body).toBeDefined();
    }
  });
});

describe('getFontPair', () => {
  it('returns the requested pair', () => {
    expect(getFontPair('studio').display).toBe('Bricolage Grotesque');
  });

  it('throws for unknown name', () => {
    expect(() => getFontPair('nonexistent' as never)).toThrow();
  });
});
