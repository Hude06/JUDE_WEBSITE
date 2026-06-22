'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// First-party, cookieless pageview beacon — sibling to PlausibleScript. On each
// navigation it POSTs same-origin to /api/track with the path, the ?ref value,
// and the referrer host. No cookies, no external requests, nothing that can
// break the page. Gated server-side from the root layout (MC_TRACK_DISABLED).
export function TrackPageview() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = window.location.pathname;
    if (p.startsWith('/admin') || p.startsWith('/api') || p.startsWith('/ui-preview')) return;

    const body = JSON.stringify({
      path: p,
      ref: new URLSearchParams(window.location.search).get('ref'),
      referrer: document.referrer || null,
    });

    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      } else {
        void fetch('/api/track', {
          method: 'POST',
          body,
          keepalive: true,
          headers: { 'content-type': 'application/json' },
        });
      }
    } catch {
      // tracking must never affect the visitor
    }
  }, [pathname]);

  return null;
}
