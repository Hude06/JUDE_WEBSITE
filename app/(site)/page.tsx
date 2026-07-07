import { notFound } from 'next/navigation';
import type { PageContent } from '@/lib/types';
import { loadPage, loadSiteConfig } from '@/lib/content';
import { resolveReveal } from '@/lib/motion-engine';
import { resolveThemeStructure } from '@/lib/themes';
import { BlockRenderer, frameworkBlocks } from '@/components/BlockRenderer';
import { clientBlocks } from '@client/registry';

const blockRegistry = { ...frameworkBlocks, ...clientBlocks };

export default async function HomePage() {
  let page: PageContent;
  try {
    page = loadPage('home');
  } catch {
    notFound();
  }
  const config = loadSiteConfig();
  return (
    <BlockRenderer
      blocks={page.blocks}
      registry={blockRegistry}
      reveal={resolveReveal(config)}
      dna={resolveThemeStructure(config.theme?.preset, config.theme?.system)}
    />
  );
}
