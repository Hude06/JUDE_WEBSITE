import Link from 'next/link';
import type { NavLink } from '@/lib/types';

/** Hand-drawn sprout mark — leaves spring up slightly on brand hover. */
function SproutMark() {
  return (
    <svg
      width="26"
      height="30"
      viewBox="0 0 26 30"
      fill="none"
      aria-hidden
    >
      <path
        d="M13 29V12"
        stroke="var(--bark)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M13 18c-3-1-6-4-6.5-8"
        stroke="var(--bark)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle className="sprout-leaf" cx="13" cy="8" r="7" fill="var(--moss)" />
      <circle
        className="sprout-leaf sprout-leaf--late"
        cx="6"
        cy="10"
        r="3.6"
        fill="var(--moss-deep)"
      />
      <circle
        className="sprout-leaf sprout-leaf--late"
        cx="20"
        cy="11"
        r="3.2"
        fill="var(--moss-bright)"
      />
    </svg>
  );
}

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
          <span aria-hidden className="site-brand__mark">
            <SproutMark />
          </span>
          <span className="site-brand__label">
            <span className="site-brand__name">Jude Hill</span>
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
                className="site-nav__link"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="site-nav__link"
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
