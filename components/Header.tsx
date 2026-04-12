import type { NavLink } from '@/lib/types';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface HeaderProps {
  siteName: string;
  nav: NavLink[];
}

export function Header({ siteName, nav }: HeaderProps) {
  return (
    <>
      <header className="flex items-center justify-between px-8 py-4">
        <a href="/" className="text-xl font-bold tracking-tight">
          {siteName}
        </a>
        <nav className="flex items-center gap-1">
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>
      <Separator />
    </>
  );
}
