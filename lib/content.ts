import fs from 'fs';
import path from 'path';
import type { PageContent, SiteConfig } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');

export function loadPage(slug: string): PageContent {
  const filePath = path.join(PAGES_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Page not found: ${slug}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const page: PageContent = JSON.parse(raw);

  if (!page.title || !page.slug || !Array.isArray(page.blocks)) {
    throw new Error(`Invalid page content: ${slug}`);
  }

  return page;
}

export function loadSiteConfig(): SiteConfig {
  const filePath = path.join(CONTENT_DIR, 'site.json');

  if (!fs.existsSync(filePath)) {
    throw new Error('site.json not found');
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const config: SiteConfig = JSON.parse(raw);

  if (!config.siteName || !Array.isArray(config.nav)) {
    throw new Error('Invalid site config');
  }

  return config;
}

export function listPages(): string[] {
  if (!fs.existsSync(PAGES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(PAGES_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''));
}
