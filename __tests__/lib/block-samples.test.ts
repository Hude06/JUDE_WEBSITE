import { getSample, getAllSamples, ALL_BLOCK_TYPES } from '@/lib/block-samples';

describe('block-samples', () => {
  it('returns a sample for every registered block type', () => {
    for (const type of ALL_BLOCK_TYPES) {
      const block = getSample(type);
      expect(block.type).toBe(type);
      expect(block.id).toBeDefined();
    }
  });

  it('getAllSamples returns one block per type', () => {
    const samples = getAllSamples();
    expect(samples).toHaveLength(ALL_BLOCK_TYPES.length);
  });

  it('hero sample has required fields', () => {
    const hero = getSample('hero');
    if (hero.type !== 'hero') throw new Error('expected hero');
    expect(hero.headline).toBeDefined();
    expect(hero.primaryCta).toBeDefined();
  });

  it('pricing sample has 3 tiers with one featured', () => {
    const pricing = getSample('pricing');
    if (pricing.type !== 'pricing') throw new Error('expected pricing');
    expect(pricing.tiers).toHaveLength(3);
    expect(pricing.tiers.some((t) => t.featured)).toBe(true);
  });

  it('section sample contains a child block', () => {
    const section = getSample('section');
    if (section.type !== 'section') throw new Error('expected section');
    expect(section.blocks.length).toBeGreaterThan(0);
  });

  it('includes all 21 block types', () => {
    expect(ALL_BLOCK_TYPES.length).toBe(21);
  });
});
