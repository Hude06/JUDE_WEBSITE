import fs from 'fs';
import path from 'path';
import type { PageContent, SiteConfig } from './types';
import { PageContentSchema, SiteConfigSchema } from './schemas';
import { withContractVersion } from './contract';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');
const CLIENT_DIR = path.join(process.cwd(), 'client');

const SLUG_REGEX = /^[a-z0-9-]+$/;

function isSafeSlug(slug: string): boolean {
  return typeof slug === 'string' && SLUG_REGEX.test(slug) && slug.length > 0 && slug.length <= 100;
}

function assertInsidePages(target: string): void {
  const resolvedBase = path.resolve(PAGES_DIR) + path.sep;
  const resolvedTarget = path.resolve(target);
  if (!(resolvedTarget + path.sep).startsWith(resolvedBase) && resolvedTarget !== path.resolve(PAGES_DIR)) {
    throw new Error('Path traversal detected');
  }
}

function formatIssue(issue: { path: PropertyKey[]; message: string }): string {
  const pathStr = issue.path.map((p) => String(p)).join('.');
  return pathStr ? `${pathStr}: ${issue.message}` : issue.message;
}

export function loadPage(slug: string): PageContent {
  if (!isSafeSlug(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  const filePath = path.join(PAGES_DIR, `${slug}.json`);
  assertInsidePages(filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Page not found: ${slug}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsedRaw: unknown = JSON.parse(raw);
  const parsed = PageContentSchema.safeParse(withContractVersion(parsedRaw));

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new Error(`Invalid page content: ${first ? formatIssue(first) : slug}`);
  }

  return parsed.data as PageContent;
}

export function loadSiteConfig(): SiteConfig {
  const filePath = path.join(CONTENT_DIR, 'site.json');

  if (!fs.existsSync(filePath)) {
    throw new Error('site.json not found');
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsedRaw: unknown = JSON.parse(raw);
  const parsed = SiteConfigSchema.safeParse(withContractVersion(parsedRaw));

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new Error(`Invalid site config: ${first ? formatIssue(first) : 'unknown error'}`);
  }

  return parsed.data as SiteConfig;
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

interface PlaceholderCategory {
  url: string;
  description: string;
}

interface PlaceholdersFile {
  note?: string;
  categories: Record<string, PlaceholderCategory[]>;
}

export function loadPlaceholders(): PlaceholdersFile {
  const frameworkPath = path.join(CONTENT_DIR, 'placeholders.json');
  const clientPath = path.join(CLIENT_DIR, 'placeholders.json');

  const framework: PlaceholdersFile = fs.existsSync(frameworkPath)
    ? JSON.parse(fs.readFileSync(frameworkPath, 'utf-8'))
    : { categories: {} };

  if (!fs.existsSync(clientPath)) {
    return framework;
  }

  const client: PlaceholdersFile = JSON.parse(fs.readFileSync(clientPath, 'utf-8'));

  return {
    note: client.note ?? framework.note,
    categories: {
      ...framework.categories,
      ...client.categories,
    },
  };
}
