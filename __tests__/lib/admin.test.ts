import {
  slugify,
  validateSlug,
  validatePageContent,
  generateBlockId,
} from '@/lib/admin';

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('My Page Title')).toBe('my-page-title');
  });

  it('strips special characters', () => {
    expect(slugify("Hello World!")).toBe('hello-world');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a  --  b')).toBe('a-b');
  });

  it('trims whitespace', () => {
    expect(slugify('  hello  ')).toBe('hello');
  });
});

describe('validateSlug', () => {
  it('accepts valid slugs', () => {
    expect(validateSlug('home')).toBe(true);
    expect(validateSlug('about-us')).toBe(true);
    expect(validateSlug('page-123')).toBe(true);
  });

  it('rejects invalid slugs', () => {
    expect(validateSlug('')).toBe(false);
    expect(validateSlug('Hello')).toBe(false);
    expect(validateSlug('../etc')).toBe(false);
    expect(validateSlug('page with spaces')).toBe(false);
    expect(validateSlug('page/slug')).toBe(false);
  });
});

describe('validatePageContent', () => {
  it('accepts valid page content', () => {
    const page = {
      title: 'Test',
      slug: 'test',
      blocks: [{ id: 'b1', type: 'heading', text: 'Hello' }],
    };
    expect(() => validatePageContent(page)).not.toThrow();
    expect(validatePageContent(page).title).toBe('Test');
  });

  it('rejects missing title', () => {
    expect(() =>
      validatePageContent({ slug: 'test', blocks: [] })
    ).toThrow(/title/i);
  });

  it('rejects invalid slug', () => {
    expect(() =>
      validatePageContent({ title: 'Test', slug: 'INVALID', blocks: [] })
    ).toThrow(/slug/i);
  });

  it('rejects non-array blocks', () => {
    expect(() =>
      validatePageContent({ title: 'Test', slug: 'test', blocks: 'nope' })
    ).toThrow(/blocks/i);
  });

  it('rejects blocks without id', () => {
    expect(() =>
      validatePageContent({
        title: 'Test',
        slug: 'test',
        blocks: [{ type: 'heading', text: 'no id' }],
      })
    ).toThrow(/id/i);
  });

  it('rejects null input', () => {
    expect(() => validatePageContent(null)).toThrow();
  });
});

describe('generateBlockId', () => {
  it('generates deterministic ids', () => {
    expect(generateBlockId('home', 0)).toBe('home-1');
    expect(generateBlockId('about', 4)).toBe('about-5');
  });
});
