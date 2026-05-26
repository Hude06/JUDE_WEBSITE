import type { MotionEngine, SiteConfig } from './types';

export const DEFAULT_MOTION_ENGINE: MotionEngine = 'motion';

export function isMotionEngine(value: unknown): value is MotionEngine {
  return value === 'motion' || value === 'gsap';
}

export function resolveMotionEngine(
  config: Pick<SiteConfig, 'motion'> | null | undefined,
): MotionEngine {
  const candidate = config?.motion?.engine;
  return isMotionEngine(candidate) ? candidate : DEFAULT_MOTION_ENGINE;
}

export function resolveMotionEngineFromDocument(doc: Document | null | undefined): MotionEngine {
  if (!doc) return DEFAULT_MOTION_ENGINE;
  const raw = doc.documentElement.dataset.motionEngine;
  return isMotionEngine(raw) ? raw : DEFAULT_MOTION_ENGINE;
}
