import type { Metadata } from 'next';
import { loadSiteConfig } from '@/lib/content';
import { Instrument_Serif, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SmoothAnchorScroll } from '@/components/SmoothAnchorScroll';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const config = loadSiteConfig();

export const metadata: Metadata = {
  title: 'Jude Hill — Websites, made simple.',
  description:
    'Designer & developer building fast, beautiful websites. Based in Eugene, Oregon.',
  openGraph: {
    title: 'Jude Hill — Websites, made simple.',
    description:
      'Designer & developer building fast, beautiful websites. Based in Eugene, Oregon.',
    type: 'website',
    locale: 'en_US',
    siteName: config.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jude Hill — Websites, made simple.',
    description: 'Designer & developer building fast, beautiful websites.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(instrumentSerif.variable, inter.variable)}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <SmoothAnchorScroll />
        {children}
      </body>
    </html>
  );
}
