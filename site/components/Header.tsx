import type { NavLink } from '@/lib/types';

interface HeaderProps {
  siteName: string;
  nav: NavLink[];
}

export function Header({ siteName, nav }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="jude-container site-header__inner">
        <div className="site-brand">
          <a
            href="/"
            className="site-brand__label"
            aria-label={`${siteName} — home`}
          >
            <span className="site-brand__name">Jude Hill</span>
            <span className="site-brand__separator">—</span>
            <span className="site-brand__role">
              Designer &amp; Developer
            </span>
          </a>
        </div>

        <nav className="site-nav">
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="site-nav__link"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
