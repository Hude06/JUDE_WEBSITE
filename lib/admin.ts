import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import type { PageContent, SiteConfig } from './types';
import { PageContentSchema, SiteConfigSchema } from './schemas';
import { withContractVersion } from './contract';

const execFileAsync = promisify(execFile);

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

const SLUG_REGEX = /^[a-z0-9-]+$/;

const SITE_CONFIG_PATH = path.join(CONTENT_DIR, 'site.json');

const REBUILD_LOCK_PATH = path.join(process.cwd(), '.rebuild.lock');
const REBUILD_STATE_PATH = path.join(process.cwd(), '.rebuild.state.json');
const REBUILD_MIN_INTERVAL_MS = 60_000;
const REBUILD_STALE_LOCK_MS = 10 * 60_000;
const BUILD_TIMEOUT_MS = 120_000;
const GIT_TIMEOUT_MS = 60_000;

const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_UPLOAD_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

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

function formatIssue(issue: { path: PropertyKey[]; message: string }): string {
  const pathStr = issue.path.map((p) => String(p)).join('.');
  return pathStr ? `${pathStr}: ${issue.message}` : issue.message;
}

export function validatePageContent(data: unknown): PageContent {
  const result = PageContentSchema.safeParse(withContractVersion(data));
  if (!result.success) {
    const first = result.error.issues[0];
    throw new Error(`Invalid page content: ${first ? formatIssue(first) : 'unknown error'}`);
  }
  return result.data as PageContent;
}

export function generateBlockId(slug: string, index: number): string {
  return `${slug}-${index + 1}`;
}

function assertInside(base: string, target: string): void {
  const resolvedBase = path.resolve(base) + path.sep;
  const resolvedTarget = path.resolve(target);
  if (!(resolvedTarget + path.sep).startsWith(resolvedBase) && resolvedTarget !== path.resolve(base)) {
    throw new Error('Path traversal detected');
  }
}

export function writePage(page: PageContent): void {
  const validated = validatePageContent(page);
  const filePath = path.join(PAGES_DIR, `${validated.slug}.json`);
  assertInside(PAGES_DIR, filePath);
  const tmpPath = `${filePath}.tmp`;

  fs.writeFileSync(tmpPath, JSON.stringify(validated, null, 2), 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

export function deletePage(slug: string): void {
  if (!validateSlug(slug)) {
    throw new Error('Invalid slug');
  }

  const filePath = path.join(PAGES_DIR, `${slug}.json`);
  assertInside(PAGES_DIR, filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Page not found: ${slug}`);
  }

  fs.unlinkSync(filePath);
}

export function writeSiteConfig(config: unknown): SiteConfig {
  const result = SiteConfigSchema.safeParse(withContractVersion(config));
  if (!result.success) {
    const first = result.error.issues[0];
    throw new Error(`Invalid site config: ${first ? formatIssue(first) : 'unknown error'}`);
  }

  const tmpPath = `${SITE_CONFIG_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(result.data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, SITE_CONFIG_PATH);
  return result.data as SiteConfig;
}

function sniffImageExt(buf: Buffer): string | null {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return '.png';
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return '.jpg';
  if (buf.length >= 6 && buf.toString('ascii', 0, 6) === 'GIF87a') return '.gif';
  if (buf.length >= 6 && buf.toString('ascii', 0, 6) === 'GIF89a') return '.gif';
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return '.webp';
  }
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 4, 8) === 'ftyp' &&
    (buf.toString('ascii', 8, 12) === 'avif' || buf.toString('ascii', 8, 12) === 'avis')
  ) {
    return '.avif';
  }
  return null;
}

export async function saveUploadedFile(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  if (buffer.length === 0) {
    throw new Error('Empty file');
  }
  if (buffer.length > UPLOAD_MAX_BYTES) {
    throw new Error('File exceeds maximum size');
  }

  const sniffedExt = sniffImageExt(buffer);
  if (!sniffedExt) {
    throw new Error('Unsupported file type: not a recognised image');
  }

  const claimedExt = path.extname(originalName).toLowerCase();
  const chosenExt = ALLOWED_UPLOAD_EXTS.has(claimedExt) ? claimedExt : sniffedExt;

  if (sniffedExt === '.jpg' && (chosenExt !== '.jpg' && chosenExt !== '.jpeg')) {
    throw new Error('File extension does not match contents');
  }
  if (sniffedExt !== '.jpg' && chosenExt !== sniffedExt) {
    throw new Error('File extension does not match contents');
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const safeName = `${crypto.randomUUID()}${chosenExt}`;
  const filePath = path.join(UPLOADS_DIR, safeName);
  assertInside(UPLOADS_DIR, filePath);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${safeName}`;
}

interface RebuildState {
  lastRebuildMs: number;
}

function readRebuildState(): RebuildState {
  try {
    const raw = fs.readFileSync(REBUILD_STATE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (typeof parsed.lastRebuildMs === 'number') return parsed as RebuildState;
  } catch {}
  return { lastRebuildMs: 0 };
}

function writeRebuildState(state: RebuildState): void {
  try {
    fs.writeFileSync(REBUILD_STATE_PATH, JSON.stringify(state), 'utf-8');
  } catch {}
}

function acquireRebuildLock(): boolean {
  try {
    if (fs.existsSync(REBUILD_LOCK_PATH)) {
      const stat = fs.statSync(REBUILD_LOCK_PATH);
      if (Date.now() - stat.mtimeMs < REBUILD_STALE_LOCK_MS) {
        return false;
      }
      fs.unlinkSync(REBUILD_LOCK_PATH);
    }
    fs.writeFileSync(REBUILD_LOCK_PATH, String(process.pid), { flag: 'wx' });
    return true;
  } catch {
    return false;
  }
}

function releaseRebuildLock(): void {
  try {
    fs.unlinkSync(REBUILD_LOCK_PATH);
  } catch {}
}

export function isRebuilding(): boolean {
  if (!fs.existsSync(REBUILD_LOCK_PATH)) return false;
  try {
    const stat = fs.statSync(REBUILD_LOCK_PATH);
    return Date.now() - stat.mtimeMs < REBUILD_STALE_LOCK_MS;
  } catch {
    return false;
  }
}

export function rebuildCooldownRemainingMs(): number {
  const state = readRebuildState();
  const since = Date.now() - state.lastRebuildMs;
  return Math.max(0, REBUILD_MIN_INTERVAL_MS - since);
}

export async function rebuildSite(): Promise<boolean> {
  const cooldown = rebuildCooldownRemainingMs();
  if (cooldown > 0) {
    throw new Error(`Rate limited: wait ${Math.ceil(cooldown / 1000)}s before rebuilding again`);
  }

  if (!acquireRebuildLock()) {
    throw new Error('Build already in progress');
  }

  try {
    await execFileAsync('npm', ['run', 'build'], {
      cwd: process.cwd(),
      timeout: BUILD_TIMEOUT_MS,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        SKIP_TYPE_CHECK: '1',
      },
    });
    writeRebuildState({ lastRebuildMs: Date.now() });
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown build error';
    throw new Error(`Build failed: ${message}`);
  } finally {
    releaseRebuildLock();
  }
}

export async function gitCommitAndPush(message: string): Promise<boolean> {
  if (typeof message !== 'string' || message.length === 0 || message.length > 500) {
    return false;
  }
  try {
    const cwd = process.cwd();
    const opts = { cwd, timeout: GIT_TIMEOUT_MS };
    await execFileAsync('git', ['add', 'content/', 'public/uploads/'], opts);
    await execFileAsync('git', ['commit', '-m', message], opts);
    await execFileAsync('git', ['push'], opts);
    return true;
  } catch {
    return false;
  }
}
