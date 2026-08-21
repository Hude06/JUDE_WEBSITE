'use client';

/**
 * The hero's proof-of-claim. "Eugene's fastest sites" is an assertion; this
 * measures the page you are currently reading and draws the result in the
 * fact ledger's "Loaded in" stat.
 */

import { useEffect, useState, useSyncExternalStore } from 'react';
import styles from './LoadMeter.module.css';

/* A sub-100ms load is the good case, but a 90ms animation is a flicker, not a
   demonstration. The sweep is floored so the eye can follow it; the number it
   settles on is always the real measurement, never the floor. */
const SWEEP_FLOOR_MS = 560;

/* Past this the reading is stale or the tab was backgrounded mid-load —
   better to render nothing than to publish a number we do not trust. */
const PLAUSIBLE_CEILING_MS = 10_000;

/** Real load time for this page, in milliseconds. 0 when unmeasurable. */
function measureLoadMs(): number {
  if (typeof performance === 'undefined') return 0;

  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;

  // domContentLoadedEventEnd is the honest "the page is here" moment: markup
  // parsed and blocking assets done, before lazy images pad the number.
  const dcl = nav ? nav.domContentLoadedEventEnd - nav.startTime : 0;
  const ms = dcl > 0 ? dcl : performance.now();

  return Number.isFinite(ms) && ms > 0 ? ms : 0;
}

/* Measured once and reused. Re-reading would let the `performance.now()`
   fallback drift upward the longer the tab stays open, so the "load time" would
   creep while you read the page. */
let cachedLoadMs: number | null = null;

function readLoadMs(): number {
  if (cachedLoadMs === null) cachedLoadMs = measureLoadMs();
  return cachedLoadMs;
}

/* The measurement is a client-only value that never changes, so there is
   nothing to subscribe to. */
const subscribeToNothing = () => () => {};

/** null until mounted — the server has no timing, so it renders nothing. */
function useLoadMs(): number | null {
  return useSyncExternalStore(subscribeToNothing, readLoadMs, () => null);
}

function usable(ms: number | null): ms is number {
  return ms !== null && ms > 0 && ms < PLAUSIBLE_CEILING_MS;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/* —— ledger row ——————————————————————————————— */

/**
 * Always renders, on the server too, holding "0.00s" until the measurement
 * lands. Returning null before hydration would pop a fourth item into a
 * centred ledger a beat after paint and shove the other three sideways —
 * a layout shift caused by the very widget bragging about load speed.
 */
export function HeroLoadReadout({
  className,
  labelClassName,
  valueClassName,
}: {
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}) {
  const ms = useLoadMs();
  const [shown, setShown] = useState(0);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!usable(ms)) return;

    // Reduced motion collapses the sweep to zero duration rather than taking a
    // separate branch: the first frame lands on the final value with no
    // animation, and the settle logic below stays in one place.
    const duration = prefersReducedMotion() ? 0 : Math.max(ms, SWEEP_FLOOR_MS);
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = duration > 0 ? Math.min((now - start) / duration, 1) : 1;
      // Expo-out, the same shape as the CSS easing on the sweep, so the digits
      // and the line arrive together instead of racing.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setShown(ms * eased);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setSettled(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ms]);

  const ready = usable(ms);

  return (
    <div
      className={`${className ?? ''} ${styles.readout}`.trim()}
      data-ready={ready ? '' : undefined}
      aria-hidden={ready ? undefined : true}
    >
      <dt className={labelClassName}>
        <span className={styles.pip} data-settled={settled ? '' : undefined} />
        Loaded in
      </dt>
      <dd className={valueClassName}>{(shown / 1000).toFixed(2)}s</dd>
    </div>
  );
}
