import fs from 'fs';
import path from 'path';
import type { PageContent, SiteConfig } from './types';

const EXAMPLES_DIR = path.join(process.cwd(), 'examples');

function exampleDir(example: string): string {
  return path.join(EXAMPLES_DIR, example);
}

export function listExamples(): string[] {
  if (!fs.existsSync(EXAMPLES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function listExamplePages(example: string): string[] {
  const pagesDir = path.join(exampleDir(example), 'pages');
  if (!fs.existsSync(pagesDir)) {
    return [];
  }

  return fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''));
}

export function loadExamplePage(example: string, slug: string): PageContent {
  const filePath = path.join(exampleDir(example), 'pages', `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Example page not found: ${example}/${slug}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const page: PageContent = JSON.parse(raw);

  if (!page.title || !page.slug || !Array.isArray(page.blocks)) {
    throw new Error(`Invalid example page content: ${example}/${slug}`);
  }

  return page;
}

export function loadExampleSiteConfig(example: string): SiteConfig {
  const filePath = path.join(exampleDir(example), 'site.json');

  if (!fs.existsSync(filePath)) {
    throw new Error(`Example site.json not found: ${example}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const config: SiteConfig = JSON.parse(raw);

  if (!config.siteName || !Array.isArray(config.nav)) {
    throw new Error(`Invalid example site config: ${example}`);
  }

  return config;
}
