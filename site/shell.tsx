import type { ReactNode } from 'react';
import { Header } from '@/site/components/Header';
import { Footer } from '@/site/components/Footer';
import type { SiteConfig } from '@/lib/types';

export interface SiteShellProps {
  config: SiteConfig;
  children: ReactNode;
}

export function SiteShell({ config, children }: SiteShellProps) {
  return (
    <>
      <Header siteName={config.siteName} nav={config.nav} />
      <main>{children}</main>
      <Footer siteName={config.siteName} />
    </>
  );
}
