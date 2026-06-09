import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { FRAMEWORK_VERSION } from '@/lib/framework-version';

export const dynamic = 'force-dynamic';

const STARTED_AT = new Date().toISOString();

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readSiteName(): string | null {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, 'site.json'), 'utf8');
    const parsed = JSON.parse(raw) as { siteName?: string };
    return parsed.siteName ?? null;
  } catch {
    return null;
  }
}

// Newest mtime across content/ — reflects runtime admin edits without
// needing git inside the container.
function lastContentChange(): { sha: string; at: string } | null {
  try {
    let newest = fs.statSync(path.join(CONTENT_DIR, 'site.json')).mtimeMs;
    const pagesDir = path.join(CONTENT_DIR, 'pages');
    for (const file of fs.readdirSync(pagesDir)) {
      const mtime = fs.statSync(path.join(pagesDir, file)).mtimeMs;
      if (mtime > newest) newest = mtime;
    }
    return { sha: process.env.BUILD_SHA ?? 'unknown', at: new Date(newest).toISOString() };
  } catch {
    return null;
  }
}

export async function GET() {
  const siteName = readSiteName();
  const checks = [
    { name: 'site.json readable', ok: siteName !== null },
    { name: 'pages present', ok: fs.existsSync(path.join(CONTENT_DIR, 'pages')) },
  ];
  return NextResponse.json({
    siteName,
    frameworkVersion: FRAMEWORK_VERSION,
    buildSha: process.env.BUILD_SHA ?? 'dev',
    startedAt: STARTED_AT,
    lastContentCommit: lastContentChange(),
    checks,
  });
}
