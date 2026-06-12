'use client';
import { HeroAnimated } from './HeroAnimated';
import { BentoFeatures } from './BentoFeatures';
import { DownloadCta } from './DownloadCta';
import { AtelierAbout } from './AtelierAbout';
import styles from './AtelierPage.module.css';

interface AtelierPageBlock {
  id: string;
  type: 'atelier-page';
}

const HERO = {
  id: 'atelier-hero',
  type: 'hero-animated' as const,
  eyebrow: 'macOS · Free download',
  headline: 'A quiet kanban board.',
  body: 'Three lists. Multiple projects.\nEverything stays on your device.',
  primaryCta: { label: 'Download for Mac', href: '/download' },
  secondaryCta: { label: 'Learn more', href: '#atelier-about' },
};

const BENTO = {
  id: 'atelier-bento',
  type: 'bento-features' as const,
  eyebrow: 'What it does',
  heading: 'Built for focus.',
  subheading: 'No accounts. No subscriptions. No noise.',
  features: [
    {
      id: 'local',
      icon: 'local',
      title: 'Local-first, always.',
      body: 'Your data never leaves your Mac. Stored as plain JSON in ~/Library — readable in any text editor, backupable anywhere. No server knows what you\'re working on.',
    },
    {
      id: 'projects',
      icon: 'projects',
      title: 'Multiple projects',
      body: 'Switch between boards from the sidebar. Each project has its own icon and accent colour so they\'re distinguishable at a glance.',
    },
    {
      id: 'drag',
      icon: 'drag',
      title: 'Drag to move',
      body: 'Cards move between columns naturally. Reorder within a list or drop across — it behaves the way you expect.',
    },
    {
      id: 'theme',
      icon: 'theme',
      title: 'Light & dark',
      body: 'Follows your macOS setting automatically, or lock it manually. Switches instantly with no flash, no reload.',
    },
    {
      id: 'keys',
      icon: 'keys',
      title: 'Keyboard shortcuts',
      body: 'Everything has a shortcut. None of them are surprising.',
      kbd: ['⌘ N', '⌘ [', '⌘ ]', '⌘ ,', '⌘ ↵', 'Esc'],
    },
    {
      id: 'offline',
      icon: 'offline',
      title: 'Fully offline',
      body: 'Fonts ship inside the app via Fontsource. Open Atelier in a cabin with no Wi-Fi — it looks exactly the same.',
    },
  ],
};

const DL_CTA = {
  id: 'atelier-dl',
  type: 'download-cta' as const,
  eyebrow: 'Get started',
  headline: 'Ready to focus?',
  subheadline: 'Atelier is free. No sign-up, no credit card, no cloud.',
  cta: { label: 'Download for Mac — free', href: '/download' },
  platform: '<strong>macOS 13</strong> Ventura or later · Apple Silicon &amp; Intel',
};

const ABOUT = { id: 'atelier-about', type: 'about-page' as const };

export function AtelierPage({ block: _block }: { block: AtelierPageBlock }) {
  return (
    <div className={styles.theme}>
      <HeroAnimated block={HERO} />
      <BentoFeatures block={BENTO} />
      <AtelierAbout block={ABOUT} />
      <DownloadCta block={DL_CTA} />
    </div>
  );
}
