import { loadSiteConfig } from '@/lib/content';
import { SiteShell } from '@/site/shell';

const config = loadSiteConfig();

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell config={config}>{children}</SiteShell>;
}
