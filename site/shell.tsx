import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Atmosphere } from '@/components/theme/Atmosphere';
import { isExpressiveTheme } from '@/lib/themes';
import type { SiteConfig } from '@/lib/types';
import styles from '@/app/(site)/layout.module.css';

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
  // Only expressive themes get the texture overlay. Classic themes render no
  // extra element, keeping their DOM identical to before.
  const expressive = isExpressiveTheme(config.theme?.preset) || config.theme?.system === 'expressive';
  return (
    <div className={styles.shell}>
      {expressive && <Atmosphere />}
      <Header siteName={config.siteName} nav={config.nav} />
      <main className={styles.main}>{children}</main>
      <Footer siteName={config.siteName} />
    </div>
  );
}
