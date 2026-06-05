'use client';

import { useEffect } from 'react';

/**
 * Cross-browser fallback for `.scroll-reveal` entrances.
 *
 * Chromium animates `.scroll-reveal` with scroll-driven CSS
 * (`animation-timeline: view()`), which is scrubbed to scroll position and so is
 * inherently velocity-correct — this component is a no-op there. On browsers that
 * lack scroll-driven animations (Safari, Firefox), it drives the reveal with a
 * single IntersectionObserver, adding `.is-revealed` as elements enter.
 *
 * Snap-if-already-visible: anything already on (or above) the viewport when this
 * mounts — including items the user scrolled past quickly before hydration — is
 * revealed instantly via `.reveal-instant`, so it never fades in late. Reduced
 * motion is handled in CSS (content forced visible), so we bail early there.
 */
export function ScrollRevealFallback() {
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
  }, []);

  return null;
}
