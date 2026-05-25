import { loadSiteConfig } from '@/lib/content';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const config = loadSiteConfig();

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header siteName={config.siteName} nav={config.nav} />
      <main className="flex-1">{children}</main>
      <Footer siteName={config.siteName} />
    </>
  );
}
