import { FONT_PAIRS, listFontPairs, getFontPair } from '@/lib/font-pairs';

describe('FONT_PAIRS', () => {
  it('defines all 5 pair names', () => {
    expect(Object.keys(FONT_PAIRS)).toHaveLength(5);
    expect(FONT_PAIRS).toHaveProperty('editorial');
    expect(FONT_PAIRS).toHaveProperty('studio');
    expect(FONT_PAIRS).toHaveProperty('tech');
    expect(FONT_PAIRS).toHaveProperty('warm');
    expect(FONT_PAIRS).toHaveProperty('monochrome');
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
    expect(pairs).toHaveLength(5);
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
