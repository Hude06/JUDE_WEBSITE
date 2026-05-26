import Link from 'next/link';
import type { NavLink } from '@/lib/types';

interface HeaderProps {
  siteName: string;
  nav: NavLink[];
}

export function Header({ siteName, nav }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="jude-container site-header__inner">
        <Link
          href="/"
          className="site-brand"
          aria-label={`${siteName} — home`}
        >
          <span
            aria-hidden
            className="site-brand__mark"
          >
            <span
              aria-hidden
              className="site-brand__letter"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                lineHeight: 1,
                transform: 'translate(1px, -2px)',
              }}
            >
              J
            </span>
          </span>
          <span className="site-brand__label">
            <span className="site-brand__name">{siteName}</span>
            <span className="site-brand__separator">—</span>
            <span className="site-brand__role">
              Designer &amp; Developer
            </span>
          </span>
        </Link>

        <nav className="site-nav">
          {nav.map((link) =>
            link.href.startsWith('/') ? (
              <Link
                key={link.href}
                href={link.href}
                className="site-nav__link link-underline"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="site-nav__link link-underline"
              >
                {link.label}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
