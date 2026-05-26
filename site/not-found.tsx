import Link from 'next/link';

/**
 * Client-owned 404 component.
 *
 * Edit this in a client site when you need custom 404 copy or design.
 */
export function SiteNotFound() {
  return (
    <section className="jude-container site-not-found">
      <p className="site-not-found__eyebrow">
        Error — 404
      </p>
      <h1
        className="site-not-found__title"
        style={{ fontSize: 'clamp(6rem, 18vw, 16rem)' }}
      >
        Not here.
      </h1>
      <p className="site-not-found__description">
        The page you&apos;re looking for doesn&apos;t exist. Maybe a broken link, maybe a
        typo. Either way, let&apos;s get you back on track.
      </p>
      <div className="site-not-found__actions">
        <Link href="/" className="jude-btn jude-btn--primary">
          Back to home
        </Link>
        <a href="mailto:jude@micah77.org" className="jude-link-inline">
          Email me →
        </a>
      </div>
    </section>
  );
}
