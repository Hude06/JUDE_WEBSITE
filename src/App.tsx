// Global CSS first: block CSS modules come after it and must win on equal
// specificity, the same cascade order the site had under Next.js.
import '@/site/fonts.css';
import '@/site/globals.css';
import '@/site/styles.css';
import { BlockRenderer } from '@/components/BlockRenderer';
import { clientBlocks } from '@client/registry';
import { loadSiteConfig } from '@/lib/content';
import type { PageContent } from '@/lib/types';
import { SiteShell } from '@/site/shell';
import { SiteNotFound } from '@/site/not-found';

/** One whole page. `page` is null for the 404 page. */
export function App({ page }: { page: PageContent | null }) {
  return (
    <SiteShell config={loadSiteConfig()}>
      {page ? <BlockRenderer blocks={page.blocks} registry={clientBlocks} /> : <SiteNotFound />}
    </SiteShell>
  );
}
