import {
  DEFAULT_MOTION_ENGINE,
  isMotionEngine,
  resolveMotionEngine,
  resolveMotionEngineFromDocument,
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
