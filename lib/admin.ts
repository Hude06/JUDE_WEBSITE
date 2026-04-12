import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import type { PageContent, SiteConfig } from './types';

const execAsync = promisify(exec);

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');
const UPLOADS_DIR = path.join(CONTENT_DIR, 'uploads');

const SLUG_REGEX = /^[a-z0-9-]+$/;

const SITE_CONFIG_PATH = path.join(CONTENT_DIR, 'site.json');

let rebuilding = false;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function validateSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug) && slug.length > 0 && slug.length <= 100;
}

export function validatePageContent(data: unknown): PageContent {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid page content: expected an object');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.title !== 'string' || !obj.title.trim()) {
    throw new Error('Invalid page content: title is required');
  }

  if (typeof obj.slug !== 'string' || !validateSlug(obj.slug)) {
    throw new Error('Invalid page content: slug must be lowercase alphanumeric with hyphens');
  }

  if (!Array.isArray(obj.blocks)) {
    throw new Error('Invalid page content: blocks must be an array');
  }

  for (const block of obj.blocks) {
    if (!block || typeof block !== 'object') {
      throw new Error('Invalid block: expected an object');
    }
    if (typeof block.id !== 'string' || typeof block.type !== 'string') {
      throw new Error('Invalid block: id and type are required');
    }
  }

  return data as PageContent;
}

export function generateBlockId(slug: string, index: number): string {
  return `${slug}-${index + 1}`;
}

export function writePage(page: PageContent): void {
  const validated = validatePageContent(page);
  const filePath = path.join(PAGES_DIR, `${validated.slug}.json`);
  const tmpPath = `${filePath}.tmp`;

  fs.writeFileSync(tmpPath, JSON.stringify(validated, null, 2), 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

export function deletePage(slug: string): void {
  if (!validateSlug(slug)) {
    throw new Error('Invalid slug');
  }

  const filePath = path.join(PAGES_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Page not found: ${slug}`);
  }

  fs.unlinkSync(filePath);
}

export function writeSiteConfig(config: SiteConfig): void {
  if (!config.siteName || !Array.isArray(config.nav)) {
    throw new Error('Invalid site config');
  }

  const tmpPath = `${SITE_CONFIG_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(config, null, 2), 'utf-8');
  fs.renameSync(tmpPath, SITE_CONFIG_PATH);
}

export async function saveUploadedFile(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const ext = path.extname(originalName).toLowerCase();
  const safeName = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(UPLOADS_DIR, safeName);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${safeName}`;
}

export async function rebuildSite(): Promise<boolean> {
  if (rebuilding) {
    throw new Error('Build already in progress');
  }

  rebuilding = true;

  try {
    await execAsync('npm run build', {
      cwd: process.cwd(),
      timeout: 120000,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        SKIP_TYPE_CHECK: '1',
      },
    });
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown build error';
    throw new Error(`Build failed: ${message}`);
  } finally {
    rebuilding = false;
  }
}

export async function gitCommitAndPush(message: string): Promise<boolean> {
  try {
    const cwd = process.cwd();
    await execAsync('git add content/', { cwd });
    await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd });
    await execAsync('git push', { cwd });
    return true;
  } catch {
    return false;
  }
}

export function isRebuilding(): boolean {
  return rebuilding;
}
