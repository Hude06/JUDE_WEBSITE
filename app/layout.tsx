import type { Metadata } from 'next';
import { loadSiteConfig } from '@/lib/content';
import {
  Geist,
  Instrument_Serif,
  Inter,
  Bricolage_Grotesque,
  JetBrains_Mono,
  Fraunces,
  Lora,
} from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

const FONT_PAIR_VARS: Record<string, { heading: string; body: string }> = {
  editorial: { heading: 'var(--font-instrument-serif)', body: 'var(--font-inter)' },
  studio: { heading: 'var(--font-bricolage)', body: 'var(--font-jetbrains-mono)' },
  tech: { heading: 'var(--font-jetbrains-mono)', body: 'var(--font-sans)' },
  warm: { heading: 'var(--font-fraunces)', body: 'var(--font-lora)' },
  monochrome: { heading: 'var(--font-sans)', body: 'var(--font-sans)' },
};

const config = loadSiteConfig();

export const metadata: Metadata = {
  title: config.siteName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pair = config.fonts.pair ?? null;
  const pairVars = pair && FONT_PAIR_VARS[pair];

  const cssVars = {
    '--font-heading': pairVars?.heading ?? config.fonts.heading,
    '--font-body': pairVars?.body ?? config.fonts.body,
    '--color-primary': config.colors.primary,
    '--color-secondary': config.colors.secondary,
    '--color-background': config.colors.background,
    '--color-text': config.colors.text,
  } as React.CSSProperties;

  const themePreset = config.theme?.preset;
  const appearance = config.theme?.appearance ?? 'light';

  return (
    <html
      lang="en"
      data-theme={themePreset}
      data-appearance={appearance}
      className={cn(
        'font-sans',
        appearance === 'dark' && 'dark',
        geist.variable,
        instrumentSerif.variable,
        inter.variable,
        bricolage.variable,
        jetbrainsMono.variable,
        fraunces.variable,
        lora.variable,
      )}
    >
      <body className="min-h-screen flex flex-col antialiased" style={cssVars}>
        {children}
      </body>
    </html>
  );
}
