import type { NavLink } from '@/lib/types';

interface HeaderProps {
  siteName: string;
  nav: NavLink[];
}

export function Header({ siteName, nav }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
      <a href="/" className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
        {siteName}
      </a>
      <nav className="flex gap-6">
        {nav.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-slate-500 hover:text-blue-600 text-sm transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
