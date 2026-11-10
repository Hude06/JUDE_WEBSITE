import type { PageContent, SiteConfig } from './types';
import siteJson from '../content/site.json';

/* Every page JSON is bundled at build time, so the same lookup works while
   prerendering in Node and while hydrating in the browser. */
const pageFiles = import.meta.glob<PageContent>('../content/pages/*.json', {
  eager: true,
  import: 'default',
});

const pages = new Map<string, PageContent>();
for (const [file, page] of Object.entries(pageFiles)) {
  const slug = file.slice(file.lastIndexOf('/') + 1, -'.json'.length);
  if (page.slug !== slug) {
    throw new Error(`content/pages/${slug}.json has slug "${page.slug}"; they must match`);
  }
  pages.set(slug, page);
}

export function loadSiteConfig(): SiteConfig {
  return siteJson;
}

/** The page for a slug, or null when there isn't one (renders the 404). */
export function loadPage(slug: string): PageContent | null {
  return pages.get(slug) ?? null;
}

export function listPages(): string[] {
  return [...pages.keys()];
}
