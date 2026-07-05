import { PageContentSchema, SiteConfigSchema } from '@/lib/schemas';

function page(blocks: unknown[]) {
  return { title: 'T', slug: 'test', blocks };
}

describe('PageContentSchema — new structural fields', () => {
  it('accepts hero layout + eyebrow', () => {
    const r = PageContentSchema.safeParse(
      page([{ id: 'h', type: 'hero', title: 'Hi', layout: 'offset', eyebrow: 'Studio' }]),
    );
    expect(r.success).toBe(true);
  });

  it('accepts grid style + eyebrow, section layout, quote style', () => {
    const r = PageContentSchema.safeParse(
      page([
        { id: 'g', type: 'grid', items: [{ title: 'A' }], style: 'numbered', eyebrow: 'What' },
        { id: 's', type: 'section', heading: 'S', layout: 'aside', eyebrow: 'About' },
        { id: 'q', type: 'quote', quote: 'Q', style: 'display' },
      ]),
    );
    expect(r.success).toBe(true);
  });

  it('accepts new heading sizes mega/giant', () => {
    expect(PageContentSchema.safeParse(page([{ id: 'h', type: 'heading', text: 'Big', size: 'mega' }])).success).toBe(true);
    expect(PageContentSchema.safeParse(page([{ id: 'h', type: 'heading', text: 'Big', size: 'giant' }])).success).toBe(true);
  });

  it('still accepts legacy blocks without any new fields (backwards compatible)', () => {
    const r = PageContentSchema.safeParse(
      page([
        { id: 'h', type: 'hero', title: 'Hi' },
        { id: 'g', type: 'grid', items: [{ title: 'A' }] },
        { id: 'q', type: 'quote', quote: 'Q' },
      ]),
    );
    expect(r.success).toBe(true);
  });

  it('rejects a block missing a required id', () => {
    expect(PageContentSchema.safeParse(page([{ type: 'hero', title: 'Hi' }])).success).toBe(false);
  });
});

describe('SiteConfigSchema — expressive theme + accent', () => {
  const base = {
    siteName: 'Site',
    nav: [],
    fonts: { heading: 'serif', body: 'sans' },
    colors: { primary: '#111111', secondary: '#222222', background: '#ffffff', text: '#000000' },
  };

  it('accepts an expressive preset, custom pair, accent, and system flag', () => {
    const r = SiteConfigSchema.safeParse({
      ...base,
      fonts: { ...base.fonts, pair: 'atelier' },
      theme: { preset: 'atelier', appearance: 'light', accent: '#e0561f', system: 'expressive' },
    });
    expect(r.success).toBe(true);
  });

  it('still accepts a legacy classic-preset config', () => {
    const r = SiteConfigSchema.safeParse({
      ...base,
      fonts: { ...base.fonts, pair: 'editorial' },
      theme: { preset: 'editorial', appearance: 'light' },
    });
    expect(r.success).toBe(true);
  });

  it('rejects a malformed accent color', () => {
    const r = SiteConfigSchema.safeParse({ ...base, theme: { accent: 'not-a-hex' } });
    expect(r.success).toBe(false);
  });
});
