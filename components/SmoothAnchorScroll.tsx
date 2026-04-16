'use client';

import { useEffect } from 'react';

const DURATION_MS = 1100;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function SmoothAnchorScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    if (prefersReduced.matches) return;

    let rafId: number | null = null;

    function scrollTo(targetY: number) {
      if (rafId !== null) cancelAnimationFrame(rafId);
      const startY = window.scrollY;
      const distance = targetY - startY;
      if (Math.abs(distance) < 1) return;
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / DURATION_MS, 1);
        const eased = easeInOutCubic(t);
        window.scrollTo(0, startY + distance * eased);
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          rafId = null;
        }
      }

      rafId = requestAnimationFrame(step);
    }

    function getScrollMarginTop(el: Element): number {
      const style = window.getComputedStyle(el);
      const parsed = parseFloat(style.scrollMarginTop || '0');
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Parse out the hash. Support "#anchor", "/#anchor", "/path#anchor".
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const path = href.slice(0, hashIndex);
      const hash = href.slice(hashIndex + 1);
      if (!hash) return;

      // Only smooth-scroll when the target is on the current page.
      // path === '' → "#anchor" (same page)
      // path === window.location.pathname → "/current/path#anchor"
      if (path !== '' && path !== window.location.pathname) return;

      const id = decodeURIComponent(hash);
      const destination = document.getElementById(id);
      if (!destination) return;

      event.preventDefault();

      const rect = destination.getBoundingClientRect();
      const offset = getScrollMarginTop(destination);
      const targetY = rect.top + window.scrollY - offset;

      scrollTo(targetY);

      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`);
      }
    }

    function onWheel() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    document.addEventListener('click', onClick);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onWheel, { passive: true });

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
