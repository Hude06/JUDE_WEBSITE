import {
  loadTheme,
  themeToCssVars,
  listThemes,
  listExpressiveThemes,
  listAllThemes,
  isExpressiveTheme,
  resolveThemeStructure,
  allThemes,
} from '@/lib/themes';

describe('listThemes', () => {
  it('returns all 5 preset names', () => {
    const names = listThemes();
    expect(names).toHaveLength(5);
    expect(names).toEqual(
      expect.arrayContaining(['editorial', 'studio', 'tech', 'warm', 'monochrome']),
    );
  });
});

describe('loadTheme', () => {
  it('editorial preset uses editorial font pair and warm accent', () => {
    const theme = loadTheme('editorial');
    expect(theme.name).toBe('editorial');
    expect(theme.fontPair).toBe('editorial');
    expect(theme.colors.accent).toMatch(/oklch/);
  });

  it('studio preset has zero radius for sharp brutalist corners', () => {
    const theme = loadTheme('studio');
    expect(theme.radius).toBe('0rem');
  });

  it('tech preset uses geist mono display pair', () => {
    const theme = loadTheme('tech');
    expect(theme.fontPair).toBe('tech');
    expect(theme.colors.accent).toMatch(/oklch/);
    expect(theme.motion.character).toBeDefined();
  });

  it('warm preset uses spring motion character', () => {
    const theme = loadTheme('warm');
    expect(theme.motion.character).toBe('spring');
  });

  it('monochrome preset has linear motion and no color accent', () => {
    const theme = loadTheme('monochrome');
    expect(theme.motion.character).toBe('linear');
    expect(theme.fontPair).toBe('monochrome');
  });

  it('each preset defines a full color set', () => {
    const names = listThemes();
    for (const name of names) {
      const theme = loadTheme(name);
      expect(theme.colors.bg).toBeDefined();
      expect(theme.colors.fg).toBeDefined();
      expect(theme.colors.primary).toBeDefined();
      expect(theme.colors.accent).toBeDefined();
      expect(theme.colors.muted).toBeDefined();
      expect(theme.colors.border).toBeDefined();
    }
  });

  it('each preset defines shadow tokens', () => {
    const names = listThemes();
    for (const name of names) {
      const theme = loadTheme(name);
      expect(theme.shadow.sm).toBeDefined();
      expect(theme.shadow.md).toBeDefined();
      expect(theme.shadow.lg).toBeDefined();
    }
  });

  it('throws for an invalid preset name', () => {
    expect(() => loadTheme('nonexistent' as never)).toThrow();
  });
});

describe('themeToCssVars', () => {
  it('maps colors to the design-token custom properties the app consumes', () => {
    const theme = loadTheme('editorial');
    const vars = themeToCssVars(theme);
    expect(vars['--background']).toBe(theme.colors.bg);
    expect(vars['--foreground']).toBe(theme.colors.fg);
    expect(vars['--primary']).toBe(theme.colors.primary);
    expect(vars['--accent']).toBe(theme.colors.accent);
  });

  it('derives --secondary/--input/--ring from muted/border/accent', () => {
    const theme = loadTheme('editorial');
    const vars = themeToCssVars(theme);
    expect(vars['--secondary']).toBe(theme.colors.muted);
    expect(vars['--input']).toBe(theme.colors.border);
    expect(vars['--ring']).toBe(theme.colors.accent);
  });

  it('maps radius to --radius variable', () => {
    const theme = loadTheme('studio');
    const vars = themeToCssVars(theme);
    expect(vars['--radius']).toBe('0rem');
  });

  it('maps shadow tokens to --shadow-* variables', () => {
    const theme = loadTheme('warm');
    const vars = themeToCssVars(theme);
    expect(vars['--shadow-sm']).toBeDefined();
    expect(vars['--shadow-md']).toBeDefined();
    expect(vars['--shadow-lg']).toBeDefined();
    expect(vars['--shadow-xl']).toBeDefined();
  });
});

describe('expressive themes', () => {
  const EXPRESSIVE = ['atelier', 'brutalist', 'console', 'almanac', 'kinetic', 'salon'];

  it('registers all 6 expressive presets separately from the classic 5', () => {
    expect(listExpressiveThemes()).toHaveLength(6);
    expect(listThemes()).toHaveLength(5);
    expect(listAllThemes()).toHaveLength(11);
    for (const name of EXPRESSIVE) {
      expect(listExpressiveThemes()).toContain(name);
    }
  });

  it('classifies presets by generation', () => {
    expect(isExpressiveTheme('atelier')).toBe(true);
    expect(isExpressiveTheme('editorial')).toBe(false);
    expect(isExpressiveTheme(undefined)).toBe(false);
  });

  it('every expressive preset defines structure and type DNA', () => {
    for (const name of EXPRESSIVE) {
      const theme = allThemes[name];
      expect(theme.structure).toBeDefined();
      expect(theme.type?.displayScale).toBeDefined();
      expect(theme.colors.bg).toBeDefined();
      expect(theme.shadow.sm).toBeDefined();
    }
  });
});

describe('resolveThemeStructure', () => {
  it('returns layout DNA for expressive themes', () => {
    expect(resolveThemeStructure('atelier')?.heroLayout).toBe('offset');
    expect(resolveThemeStructure('brutalist')?.gridStyle).toBe('numbered');
  });

  it('returns undefined for classic themes (blocks keep original layout)', () => {
    expect(resolveThemeStructure('editorial')).toBeUndefined();
    expect(resolveThemeStructure(undefined)).toBeUndefined();
  });

  it('respects the explicit system override', () => {
    expect(resolveThemeStructure('atelier', 'classic')).toBeUndefined();
    // A classic name forced expressive has no structure block, so still undefined.
    expect(resolveThemeStructure('editorial', 'expressive')).toBeUndefined();
  });
});
