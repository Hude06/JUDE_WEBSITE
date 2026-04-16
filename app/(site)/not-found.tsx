import type { Metadata } from 'next';
import { primaryButton, secondaryLink } from '@/lib/buttons';

export const metadata: Metadata = {
  title: '404 — Jude Makes Things',
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[var(--container-wide)] flex-col justify-center px-6 py-32 md:px-10">
      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-muted)]">
        Error — 404
      </p>
      <h1
        className="mt-8 font-display leading-[0.9] tracking-[-0.03em] text-[color:var(--color-fg)]"
        style={{ fontSize: 'clamp(6rem, 18vw, 16rem)' }}
      >
        Not here.
      </h1>
      <p className="mt-10 max-w-xl text-xl text-[color:var(--color-muted)]">
        The page you’re looking for doesn’t exist. Maybe a broken link, maybe a
        typo. Either way, let’s get you back on track.
      </p>
      <div className="mt-12 flex flex-wrap gap-8 items-center">
        <a href="/" className={primaryButton}>
          Back to home
        </a>
        <a href="mailto:jude@judemakes.com" className={secondaryLink}>
          Email me →
        </a>
      </div>
    </section>
  );
}
