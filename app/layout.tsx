import type { Metadata } from 'next';
import { loadSiteConfig } from '@/lib/content';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col antialiased" style={cssVars}>
        <Header siteName={config.siteName} nav={config.nav} />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">{children}</main>
        <Footer siteName={config.siteName} />
      </body>
    </html>
  );
}
