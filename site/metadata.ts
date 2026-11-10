import type { Metadata } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const metadataBase = new URL(siteUrl);

const title = 'Web Design in Eugene, Oregon | Jude Hill';
const description =
  'Freelance web designer in Eugene, Oregon. Custom, hand-built small-business websites that load in under a second. Hosting and updates included.';

const shareImage = {
  url: '/uploads/seo-share-image.png',
  width: 1200,
  height: 630,
  alt: 'Jude Hill, web designer and developer in Eugene, Oregon',
};

/**
 * Client-owned metadata override.
 *
 * This file is scaffolded into each client site and may be edited there.
 * Keep this stub stable in the framework to avoid sync conflicts.
 */
export const siteMetadata: Metadata = {
  metadataBase,
  title: {
    default: title,
    template: '%s',
  },
  description,
  applicationName: 'Jude Makes Things',
  authors: [{ name: 'Jude Hill', url: siteUrl }],
  creator: 'Jude Hill',
  keywords: [
    'web design Eugene Oregon',
    'Eugene web design',
    'web designer Eugene Oregon',
    'Eugene web designers',
    'web developer Eugene Oregon',
    'freelance web designer Eugene',
    'website design Eugene',
    'small business website design Eugene',
    'website redesign Eugene Oregon',
    'Springfield Oregon web design',
    'Lane County web design',
    'custom website development',
    'Jude Hill',
  ],
  category: 'design',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48 32x32 16x16' },
      { url: '/uploads/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/uploads/apple-touch-icon.png',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Jude Makes Things',
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [shareImage.url],
  },
};
