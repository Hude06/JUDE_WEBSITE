'use client';

import { useEffect, useState } from 'react';

/**
 * Live-updating masthead — displays current time in Pacific timezone.
 * Hydration-safe: renders a placeholder server-side, updates client-side.
 */
export function LiveMasthead() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short',
      }).format(now);
      setTime(formatted);
    }
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="tabular-nums text-[color:var(--color-muted)]"
      aria-label="Current Pacific time"
    >
      {time ?? 'Eugene, Oregon'}
    </span>
  );
}
