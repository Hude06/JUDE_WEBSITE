import type { ReactNode } from 'react';
import { Header } from '@/site/components/Header';
import { Footer } from '@/site/components/Footer';
import { ScrollRevealFallback } from '@/site/components/ScrollRevealFallback';
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
      <ScrollRevealFallback />
      {/* If JS is disabled the reveals can't run, so force all content visible. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '.scroll-reveal,[data-reveal]{opacity:1!important;transform:none!important;animation:none!important}',
          }}
        />
      </noscript>
    </>
  );
}
