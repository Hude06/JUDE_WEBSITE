import type { ReactNode } from 'react';
import Script from 'next/script';
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
        'Website redesign',
        'Local SEO',
        'Responsive web design',
      ],
      worksFor: { '@id': `${siteUrl}/#service` },
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
      '@type': ['ProfessionalService', 'LocalBusiness'],
      '@id': `${siteUrl}/#service`,
      name: 'Jude Makes Things — Web Design & Development',
      alternateName: 'Jude Makes Things Web Design',
      description:
        'Freelance web design and development in Eugene, Oregon. Custom, hand-built small-business websites with domain, hosting, and maintenance included.',
      url: siteUrl,
      email: 'mailto:jude@micah77.org',
      founder: { '@id': `${siteUrl}/#person` },
      image: `${siteUrl}/uploads/seo-share-image.png`,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Eugene',
        addressRegion: 'OR',
        addressCountry: 'US',
      },
      areaServed: [
        { '@type': 'City', name: 'Eugene', address: { '@type': 'PostalAddress', addressRegion: 'OR', addressCountry: 'US' } },
        { '@type': 'City', name: 'Springfield', address: { '@type': 'PostalAddress', addressRegion: 'OR', addressCountry: 'US' } },
        { '@type': 'City', name: 'Cottage Grove', address: { '@type': 'PostalAddress', addressRegion: 'OR', addressCountry: 'US' } },
        { '@type': 'City', name: 'Creswell', address: { '@type': 'PostalAddress', addressRegion: 'OR', addressCountry: 'US' } },
        { '@type': 'AdministrativeArea', name: 'Lane County, Oregon' },
      ],
      serviceType: [
        'Web design',
        'Web development',
        'Website design',
        'Website redesign',
        'Website maintenance',
        'Small business websites',
        'Landing page design',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Web design services in Eugene, Oregon',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom small-business website design',
              description:
                'A custom multi-page website designed and hand-coded for a small business in Eugene, Oregon.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Website redesign',
              description:
                'Rebuilding an existing slow or dated website on modern foundations while keeping its content and search rankings.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Domain, hosting, and maintenance',
              description:
                'Domain registration, managed hosting, SSL, backups, monitoring, and ongoing content updates after launch.',
            },
          },
        ],
      },
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
      {/* Google Analytics (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-5S85L38R1M"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5S85L38R1M');
        `}
      </Script>
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
