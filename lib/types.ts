/* Content shapes for content/site.json and content/pages/*.json.
   Block-specific fields live in client/types.ts. */

export interface BaseBlock {
  id: string;
  type: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  siteName: string;
  nav: NavLink[];
}

export interface PageContent {
  slug: string;
  title: string;
  description?: string;
  blocks: BaseBlock[];
}
