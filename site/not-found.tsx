import Link from 'next/link';
const primaryButton =
  'group inline-flex items-center gap-2.5 rounded-full bg-[color:var(--color-fg)] text-[color:var(--color-bg)] pl-6 pr-5 py-3.5 text-[0.95rem] font-medium tracking-tight transition-all duration-300 ease-[var(--ease-out-soft)] hover:pl-7 hover:pr-4 hover:shadow-[0_6px_24px_-8px_oklch(0_0_0/0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--color-fg)] will-change-[padding,box-shadow]';
const secondaryLink =
  'group inline-flex items-center gap-2 text-[0.95rem] font-medium tracking-tight text-[color:var(--color-fg)]';

/**
 * Client-owned 404 component.
 *
 * Edit this in a client site when you need custom 404 copy or design.
 */
export function SiteNotFound() {
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
        The page you&apos;re looking for doesn&apos;t exist. Maybe a broken link, maybe a
        typo. Either way, let&apos;s get you back on track.
      </p>
      <div className="mt-12 flex flex-wrap gap-8 items-center">
        <Link href="/" className={primaryButton}>
          Back to home
        </Link>
        <a href="mailto:jude@micah77.org" className={secondaryLink}>
          Email me →
        </a>
      </div>
    </section>
  );
}
