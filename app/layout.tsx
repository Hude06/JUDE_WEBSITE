import type { Metadata } from 'next';
import {
  Geist,
  Instrument_Serif,
  Inter,
  Bricolage_Grotesque,
  JetBrains_Mono,
  Fraunces,
  Lora,
  Space_Grotesk,
  Newsreader,
  Playfair_Display,
} from 'next/font/google';
import { loadSiteConfig } from '@/lib/content';
import { resolveMotionEngine } from '@/lib/motion-engine';
import { isExpressiveTheme, resolveTheme, themeToCssVars, themeToDarkCssVars } from '@/lib/themes';
import { cn, readableForeground } from '@/lib/utils';
import { SmoothAnchorScroll } from '@/components/SmoothAnchorScroll';
import { PlausibleScript } from '@/components/PlausibleScript';
import { SuperviewScript } from '@/components/SuperviewScript';
import { TrackPageview } from '@/components/TrackPageview';
import { AnimationEngineProvider } from '@/components/motion/AnimationEngineProvider';
import { siteMetadata } from '@/site/metadata';
import './globals.css';
import '@/site/styles.css';

// Only Inter is preloaded. The other nine faces exist so any theme preset can
// be switched on from content/site.json, but none of them are used by this
// site's current config — preloading all ten put 359 KB of fonts in the
// critical render path and delayed LCP for nothing. preload:false keeps them
// available (they still load if a preset selects them) without the <link
// rel=preload> tag.
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', preload: false });
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  preload: false,
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  preload: false,
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  preload: false,
});
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', preload: false });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', preload: false });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader', preload: false });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', preload: false });

const FONT_PAIR_VARS: Record<string, { display: string; body: string }> = {
  editorial: { display: 'var(--font-instrument-serif)', body: 'var(--font-inter)' },
  studio: { display: 'var(--font-bricolage)', body: 'var(--font-jetbrains-mono)' },
  tech: { display: 'var(--font-jetbrains-mono)', body: 'var(--font-geist)' },
  warm: { display: 'var(--font-fraunces)', body: 'var(--font-lora)' },
  monochrome: { display: 'var(--font-geist)', body: 'var(--font-geist)' },
  // Expressive generation
  atelier: { display: 'var(--font-fraunces)', body: 'var(--font-inter)' },
  brutalist: { display: 'var(--font-space-grotesk)', body: 'var(--font-jetbrains-mono)' },
  console: { display: 'var(--font-jetbrains-mono)', body: 'var(--font-jetbrains-mono)' },
  almanac: { display: 'var(--font-newsreader)', body: 'var(--font-lora)' },
  kinetic: { display: 'var(--font-space-grotesk)', body: 'var(--font-inter)' },
  salon: { display: 'var(--font-playfair)', body: 'var(--font-inter)' },
};

const config = loadSiteConfig();

const baseMetadata: Metadata = {
  title: config.siteName,
};

export const metadata: Metadata = {
  ...baseMetadata,
  ...siteMetadata,
  title: siteMetadata.title ?? baseMetadata.title,
  openGraph: {
    siteName: config.siteName,
    ...(siteMetadata.openGraph ?? {}),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themePreset = config.theme?.preset;
  const appearance = config.theme?.appearance ?? 'light';
  const motionEngine = resolveMotionEngine(config);

  // Expressive presets opt a site into the art-direction engine. Classic
  // presets keep the original code path so existing sites are unchanged.
  const expressive = isExpressiveTheme(themePreset) || config.theme?.system === 'expressive';
  const theme = resolveTheme(themePreset);

  // Config font pair wins; otherwise an expressive theme supplies its own pair.
  const pair = config.fonts?.pair ?? (expressive && theme ? theme.fontPair : null);
  const pairVars = pair ? FONT_PAIR_VARS[pair] : undefined;

  const cssVars: React.CSSProperties = {
    '--font-display': pairVars?.display ?? config.fonts?.heading ?? 'var(--font-geist)',
    '--font-body': pairVars?.body ?? config.fonts?.body ?? 'var(--font-geist)',
  } as React.CSSProperties;

  // Design tokens injected on <html> for expressive themes (which have no
  // [data-theme] block in globals.css) plus any per-site accent override.
  const htmlVars: Record<string, string> = {};
  if (expressive && theme) {
    Object.assign(htmlVars, themeToCssVars(theme));
    if (appearance === 'dark') Object.assign(htmlVars, themeToDarkCssVars(theme));
  }
  const accent = config.theme?.accent;
  if (accent) {
    htmlVars['--accent'] = accent;
    htmlVars['--accent-foreground'] = readableForeground(accent);
    htmlVars['--ring'] = accent;
  }
  const htmlStyle = Object.keys(htmlVars).length ? (htmlVars as React.CSSProperties) : undefined;

  const htmlClass = cn(
    appearance === 'dark' && 'dark',
    geist.variable,
    instrumentSerif.variable,
    inter.variable,
    bricolage.variable,
    jetbrainsMono.variable,
    fraunces.variable,
    lora.variable,
    spaceGrotesk.variable,
    newsreader.variable,
    playfair.variable,
  );

  return (
    <html
      lang="en"
      data-theme={themePreset}
      data-appearance={appearance}
      data-motion-engine={motionEngine}
      data-atmosphere={expressive && theme?.atmosphere ? theme.atmosphere : undefined}
      data-motion-character={expressive && theme ? theme.motion.character : undefined}
      data-layout-dna={expressive && theme ? theme.name : undefined}
      data-type-scale={expressive && theme?.type?.displayScale ? theme.type.displayScale : undefined}
      className={htmlClass}
      style={htmlStyle}
    >
      <body style={cssVars}>
        <AnimationEngineProvider engine={motionEngine}>
          <SmoothAnchorScroll />
          {children}
          <PlausibleScript />
          <SuperviewScript />
          {process.env.MC_TRACK_DISABLED !== '1' && <TrackPageview />}
        </AnimationEngineProvider>
      </body>
    </html>
  );
}
