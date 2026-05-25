import type { ReactNode } from 'react';
import { Header } from '@/site/components/Header';
import { Footer } from '@/site/components/Footer';
import type { SiteConfig } from '@/lib/types';

export interface SiteShellProps {
  config: SiteConfig;
  children: ReactNode;
}

/**
 * Client-owned site chrome shell.
 *
 * Edit this in a client site to customize header/footer/layout while keeping
 * framework route files updateable via sync-framework.
 */
export function SiteShell({ config, children }: SiteShellProps) {
  return (
    <>
      <Header siteName={config.siteName} nav={config.nav} />
      <main className="flex-1">{children}</main>
      <Footer siteName={config.siteName} />
    </>
  );
}
