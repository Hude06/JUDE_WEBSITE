import type { ReactNode } from 'react';
import { Header } from '@/site/components/Header';
import { Footer } from '@/site/components/Footer';
import { ScrollRevealFallback } from '@/site/components/ScrollRevealFallback';
import { Atmosphere } from '@/components/theme/Atmosphere';
import { isExpressiveTheme } from '@/lib/themes';
import type { SiteConfig } from '@/lib/types';

export interface SiteShellProps {
  config: SiteConfig;
  children: ReactNode;
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

/* Structured data: who Jude is and what this site is. Emitted once in the
   shell so every page carries it. */
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Jude Hill',
      url: siteUrl,
      email: 'mailto:jude@micah77.org',
      jobTitle: 'Web Designer & Developer',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Eugene',
        addressRegion: 'OR',
        addressCountry: 'US',
      },
      sameAs: [
        'https://instagram.com/judemakes',
        'https://youtube.com/@Judemakesfpv',
        'https://github.com/Hude06',
        'https://etsy.com/shop/JudeMakesThings',
      ],
      knowsAbout: [
        'Web design',
        'Web development',
        'Next.js',
        'Small business websites',
        'Custom website development',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Jude Makes Things',
      description:
        'Hand-built websites for small businesses, creatives, and product launches — designed and developed by Jude Hill in Eugene, Oregon.',
      publisher: { '@id': `${siteUrl}/#person` },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#service`,
      name: 'Jude Makes Things — Web Design & Development',
      url: siteUrl,
      founder: { '@id': `${siteUrl}/#person` },
      areaServed: 'Eugene, Oregon',
      serviceType: [
        'Web design',
        'Web development',
        'Website maintenance',
        'Small business websites',
      ],
    },
  ],
};

export function SiteShell({ config, children }: SiteShellProps) {
  // Only expressive themes get the texture overlay. Classic themes render no
  // extra element, keeping their DOM identical to before.
  const expressive = isExpressiveTheme(config.theme?.preset) || config.theme?.system === 'expressive';
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {expressive && <Atmosphere />}
      <Header siteName={config.siteName} nav={config.nav} />
      <main>{children}</main>
      <Footer siteName={config.siteName} />
      <ScrollRevealFallback />
      {/* If JS is disabled the reveals can't run, so force all content visible. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '.scroll-reveal{opacity:1!important;transform:none!important;animation:none!important}',
          }}
        />
      </noscript>
    </>
  );
}
