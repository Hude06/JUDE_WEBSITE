import { loadPage, loadSiteConfig, listPages } from '@/lib/content';

describe('loadPage', () => {
  it('returns page content for a valid slug', () => {
    const page = loadPage('home');
    expect(page.title).toBeDefined();
    expect(page.slug).toBe('home');
    expect(Array.isArray(page.blocks)).toBe(true);
    expect(page.blocks.length).toBeGreaterThan(0);
  });

  it('returns correct block structure', () => {
    const page = loadPage('home');
    for (const block of page.blocks) {
      expect(block.id).toBeDefined();
      expect(block.type).toBeDefined();
    }
  });

  it('throws for a missing slug', () => {
    expect(() => loadPage('nonexistent-page')).toThrow();
  });

  it('loads each page without error', () => {
    const slugs = listPages();
    for (const slug of slugs) {
      expect(() => loadPage(slug)).not.toThrow();
    }
  });
});

describe('loadSiteConfig', () => {
  it('returns valid site config', () => {
    const config = loadSiteConfig();
    expect(config.siteName).toBeDefined();
    expect(Array.isArray(config.nav)).toBe(true);
    expect(config.nav.length).toBeGreaterThan(0);
    expect(config.fonts.heading).toBeDefined();
    expect(config.fonts.body).toBeDefined();
    expect(config.colors.primary).toBeDefined();
    expect(config.colors.background).toBeDefined();
    expect(config.colors.text).toBeDefined();
  });

  it('has nav links with label and href', () => {
    const config = loadSiteConfig();
    for (const link of config.nav) {
      expect(link.label).toBeDefined();
      expect(link.href).toBeDefined();
    }
  });
});

describe('listPages', () => {
  it('returns an array of slugs', () => {
    const slugs = listPages();
    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs.length).toBeGreaterThan(0);
  });

  it('includes home, about, and contact', () => {
    const slugs = listPages();
    expect(slugs).toContain('home');
    expect(slugs).toContain('about');
    expect(slugs).toContain('contact');
  });

  it('returns slugs without .json extension', () => {
    const slugs = listPages();
    for (const slug of slugs) {
      expect(slug).not.toContain('.json');
    }
  });
});
