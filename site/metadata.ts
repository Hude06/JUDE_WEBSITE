import type { Metadata } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const metadataBase = new URL(siteUrl);

const title = 'Jude Hill — Web Designer & Developer in Eugene, Oregon';
const description =
  'Hand-built websites for small businesses, creatives, and product launches. Jude Hill is a freelance web designer and developer in Eugene, Oregon shipping fast, custom sites — no templates, no page builders.';

const shareImage = {
  url: '/uploads/seo-share-image.png',
  width: 1200,
  height: 630,
  alt: 'Jude Hill — web designer & developer, Eugene, Oregon',
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
    template: '%s · Jude Makes Things',
  },
  description,
  applicationName: 'Jude Makes Things',
  authors: [{ name: 'Jude Hill', url: siteUrl }],
  creator: 'Jude Hill',
  keywords: [
    'web designer Eugene Oregon',
    'web developer Eugene Oregon',
    'freelance web designer',
    'small business website design',
    'custom website development',
    'hand-built websites',
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
