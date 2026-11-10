import { notFound } from 'next/navigation';
import type { PageContent } from '@/lib/types';
import { loadPage, loadSiteConfig } from '@/lib/content';
import { resolveReveal } from '@/lib/motion-engine';
import { resolveThemeStructure } from '@/lib/themes';
import { BlockRenderer, frameworkBlocks } from '@/components/BlockRenderer';
import { buildFaqSchema } from '@/lib/faq-schema';
import { clientBlocks } from '@client/registry';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const blockRegistry = { ...frameworkBlocks, ...clientBlocks };

export default async function HomePage() {
  let page: PageContent;
  try {
    page = loadPage('home');
  } catch {
    notFound();
  }
  const config = loadSiteConfig();
  const faqSchema = buildFaqSchema(page.blocks, siteUrl);
  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BlockRenderer
        blocks={page.blocks}
        registry={blockRegistry}
        reveal={resolveReveal(config)}
        dna={resolveThemeStructure(config.theme?.preset, config.theme?.system)}
      />
    </>
  );
}
