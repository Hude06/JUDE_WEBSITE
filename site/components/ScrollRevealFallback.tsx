'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Cross-browser fallback for `.scroll-reveal` entrances.
 *
 * Chromium animates `.scroll-reveal` with scroll-driven CSS
 * (`animation-timeline: view()`), which is scrubbed to scroll position and so is
 * inherently velocity-correct — this component is a no-op there. On browsers that
 * lack scroll-driven animations (Safari ≤18, Firefox), it drives the reveal with
 * a single IntersectionObserver, adding `.is-revealed` as elements enter.
 *
 * Re-runs on every route change: this component lives in the persistent layout
 * shell, so a client-side navigation swaps in brand-new `.scroll-reveal` nodes
 * that the previous observer never saw. Without the pathname dependency those
 * sections would stay at opacity 0 forever (a "blank page" below the fold).
 *
 * Snap-if-already-visible: anything already on (or above) the viewport when this
 * runs — including items the user scrolled past quickly before hydration — is
 * revealed instantly via `.reveal-instant`, so it never fades in late. Reduced
 * motion is handled in CSS (content forced visible), so we bail early there.
 */
export function ScrollRevealFallback() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Chromium-class browsers handle .scroll-reveal via scroll-driven CSS.
    if (window.CSS?.supports?.('animation-timeline: view()')) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('.scroll-reveal'),
    );
    if (nodes.length === 0) return;

    const reveal = (el: HTMLElement, instant: boolean) => {
      if (instant) el.classList.add('reveal-instant');
      el.classList.add('is-revealed');
    };

    // Snap everything already visible or scrolled past; observe the rest.
    const pending: HTMLElement[] = [];
    for (const el of nodes) {
      if (el.classList.contains('is-revealed')) continue;
      const rect = el.getBoundingClientRect();
      const alreadyShown = rect.top < window.innerHeight && rect.bottom > 0;
      const scrolledPast = rect.bottom <= 0;
      if (alreadyShown || scrolledPast) {
        reveal(el, true);
      } else {
        pending.push(el);
      }
    }
    if (pending.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement, false);
          obs.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    pending.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
