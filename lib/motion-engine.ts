import type { MotionEngine, SiteConfig } from './types';
import { isExpressiveTheme, resolveTheme } from './themes';

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

export interface RevealSettings {
  /** Whether blocks should reveal on scroll. */
  enabled: boolean;
  /** Reveal duration (seconds), from the active theme's motion character. */
  duration: number;
  /** Travel distance (px) for the reveal transform. */
  distance: number;
}

/**
 * Decide whether page blocks animate in, and with what timing.
 *
 * Scroll reveal is an opt-in behavior: it turns on for expressive themes (or an
 * explicit `motion.intensity: "rich"`) and stays off for classic themes so
 * existing sites render statically exactly as before. `motion.intensity: "none"`
 * force-disables it. Timing follows the active theme's motion character.
 */
export function resolveReveal(
  config: Pick<SiteConfig, 'motion' | 'theme'> | null | undefined,
): RevealSettings {
  const intensity = config?.motion?.intensity;
  const preset = config?.theme?.preset;
  const expressive = isExpressiveTheme(preset) || config?.theme?.system === 'expressive';
  const enabled = intensity !== 'none' && (expressive || intensity === 'rich');
  const theme = resolveTheme(preset);
  return {
    enabled,
    duration: theme?.motion?.duration ?? 0.6,
    distance: intensity === 'rich' ? 32 : 24,
  };
}
