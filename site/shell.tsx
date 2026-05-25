import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
  return (
    <div className={styles.shell}>
      <Header siteName={config.siteName} nav={config.nav} />
      <main className={styles.main}>{children}</main>
      <Footer siteName={config.siteName} />
    </div>
  );
}
