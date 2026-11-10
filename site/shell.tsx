import type { ReactNode } from 'react';
import { Header } from '@/site/components/Header';
import { Footer } from '@/site/components/Footer';
import { ScrollRevealFallback } from '@/site/components/ScrollRevealFallback';
import { SmoothAnchorScroll } from '@/components/SmoothAnchorScroll';
import { SITE_URL as siteUrl } from '@/site/metadata';
import type { SiteConfig } from '@/lib/types';

export interface SiteShellProps {
  config: SiteConfig;
  children: ReactNode;
}

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
      email: 'mailto:jude@micah77.org',
      // Free text is valid here; Google reads it for the "price" chip.
      priceRange: 'From $500',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Eugene',
        addressRegion: 'OR',
        addressCountry: 'US',
      },
      areaServed: [
        { '@type': 'City', name: 'Eugene', address: { '@type': 'PostalAddress', addressRegion: 'OR', addressCountry: 'US' } },
        { '@type': 'City', name: 'Springfield', address: { '@type': 'PostalAddress', addressRegion: 'OR', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Lane County, Oregon' },
      ],
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SmoothAnchorScroll />
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
