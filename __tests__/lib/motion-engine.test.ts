import {
  DEFAULT_MOTION_ENGINE,
  isMotionEngine,
  resolveMotionEngine,
  resolveMotionEngineFromDocument,
  resolveReveal,
} from '@/lib/motion-engine';

describe('motion engine helpers', () => {
  it('accepts valid motion engines', () => {
    expect(isMotionEngine('motion')).toBe(true);
    expect(isMotionEngine('gsap')).toBe(true);
    expect(isMotionEngine('invalid')).toBe(false);
  });

  it('defaults to motion when engine is missing', () => {
    expect(resolveMotionEngine(undefined)).toBe(DEFAULT_MOTION_ENGINE);
    expect(resolveMotionEngine({})).toBe(DEFAULT_MOTION_ENGINE);
    expect(resolveMotionEngine({ motion: {} })).toBe(DEFAULT_MOTION_ENGINE);
  });

  it('resolves gsap when configured', () => {
    expect(resolveMotionEngine({ motion: { engine: 'gsap' } })).toBe('gsap');
    expect(resolveMotionEngine({ motion: { engine: 'motion' } })).toBe('motion');
  });

  it('reads motion engine from document dataset', () => {
    document.documentElement.dataset.motionEngine = 'gsap';
    expect(resolveMotionEngineFromDocument(document)).toBe('gsap');

    document.documentElement.dataset.motionEngine = 'motion';
    expect(resolveMotionEngineFromDocument(document)).toBe('motion');
  });

  it('falls back when dataset value is unknown', () => {
    document.documentElement.dataset.motionEngine = 'something-else';
    expect(resolveMotionEngineFromDocument(document)).toBe(DEFAULT_MOTION_ENGINE);
  });
});

describe('resolveReveal', () => {
  it('stays disabled for classic themes (byte-identical rendering)', () => {
    expect(resolveReveal({ theme: { preset: 'editorial' } }).enabled).toBe(false);
    expect(resolveReveal(undefined).enabled).toBe(false);
    expect(resolveReveal({}).enabled).toBe(false);
  });

  it('enables for expressive themes and reads their motion duration', () => {
    const r = resolveReveal({ theme: { preset: 'atelier' } });
    expect(r.enabled).toBe(true);
    expect(r.duration).toBeGreaterThan(0);
  });

  it('enables for classic themes when intensity is rich', () => {
    expect(resolveReveal({ theme: { preset: 'editorial' }, motion: { intensity: 'rich' } }).enabled).toBe(true);
  });

  it('force-disables when intensity is none, even for expressive themes', () => {
    expect(resolveReveal({ theme: { preset: 'atelier' }, motion: { intensity: 'none' } }).enabled).toBe(false);
  });

  it('honors the explicit expressive system flag on a classic name', () => {
    expect(resolveReveal({ theme: { preset: 'editorial', system: 'expressive' } }).enabled).toBe(true);
  });
});
