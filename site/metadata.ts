import type { Metadata } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const metadataBase = new URL(siteUrl);
const shareImage = {
  url: '/uploads/seo-share-image.png',
  width: 1200,
  height: 630,
  alt: 'Jude Hill — websites, made simple',
};

/**
 * Client-owned metadata override.
 *
 * This file is scaffolded into each client site and may be edited there.
 * Keep this stub stable in the framework to avoid sync conflicts.
 */
export const siteMetadata: Metadata = {
  metadataBase,
  title: 'Jude Hill — Websites, made simple.',
  description: 'Designer & developer building fast, beautiful websites. Based in Eugene, Oregon.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jude Hill — Websites, made simple.',
    description: 'Designer & developer building fast, beautiful websites. Based in Eugene, Oregon.',
    type: 'website',
    locale: 'en_US',
    url: '/',
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jude Hill — Websites, made simple.',
    description: 'Designer & developer building fast, beautiful websites.',
    images: [shareImage.url],
  },
};
