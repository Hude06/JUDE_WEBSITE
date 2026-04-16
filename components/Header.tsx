import type { NavLink } from '@/lib/types';

interface HeaderProps {
  siteName: string;
  nav: NavLink[];
}

export function Header({ siteName, nav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/92 backdrop-blur-sm border-b border-[color:var(--color-hairline)]">
      <div className="mx-auto flex max-w-[var(--container-wide)] items-baseline justify-between px-6 py-5 md:px-10 md:py-6">
        <a
          href="/"
          className="font-display italic text-2xl md:text-[1.75rem] leading-none tracking-tight text-[color:var(--color-fg)]"
        >
          {siteName}
        </a>
        <nav className="flex items-baseline gap-5 sm:gap-8 md:gap-12">
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline text-sm text-[color:var(--color-fg)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
