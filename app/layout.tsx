import type { Metadata } from 'next';
import { loadSiteConfig } from '@/lib/content';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const config = loadSiteConfig();

export const metadata: Metadata = {
  title: config.siteName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cssVars = {
    '--font-heading': config.fonts.heading,
    '--font-body': config.fonts.body,
    '--color-primary': config.colors.primary,
    '--color-secondary': config.colors.secondary,
    '--color-background': config.colors.background,
    '--color-text': config.colors.text,
  } as React.CSSProperties;

  return (
    <html lang="en" className={cn('font-sans', geist.variable)}>
      <body className="min-h-screen flex flex-col antialiased" style={cssVars}>
        {children}
      </body>
    </html>
  );
}
