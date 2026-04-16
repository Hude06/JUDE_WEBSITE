import type { NavLink } from '@/lib/types';

interface HeaderProps {
  siteName: string;
  nav: NavLink[];
}

export function Header({ siteName, nav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[color:var(--color-bg)]/80 backdrop-blur-md border-b border-[color:var(--color-hairline)]">
      <div className="mx-auto flex max-w-[var(--container-wide)] items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <a
          href="/"
          className="group inline-flex items-center gap-3 text-[color:var(--color-fg)]"
          aria-label={`${siteName} — home`}
        >
          <span
            aria-hidden
            className="relative grid h-9 w-9 place-items-center rounded-full border border-[color:var(--color-hairline-strong)] bg-white transition-all duration-300 group-hover:border-[color:var(--color-fg)] group-hover:bg-[color:var(--color-fg)] group-hover:text-[color:var(--color-bg)]"
          >
            <span
              aria-hidden
              className="italic"
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
          <span className="text-[0.72rem] uppercase tracking-[0.26em] tabular-nums">
            <span className="text-[color:var(--color-fg)] font-medium">Jude Hill</span>
            <span className="mx-2 text-[color:var(--color-subtle)]">—</span>
            <span className="hidden sm:inline text-[color:var(--color-subtle)]">
              Designer &amp; Developer
            </span>
          </span>
        </a>

        <nav className="flex items-baseline gap-6 sm:gap-9 md:gap-12">
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline text-[0.95rem] font-medium tracking-tight text-[color:var(--color-fg)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
