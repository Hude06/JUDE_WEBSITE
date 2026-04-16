import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { timingSafeEqual } from 'crypto';
import { listPages, loadPage } from '@/lib/content';

export const dynamic = 'force-dynamic';

interface FleetStats {
  pages_count: number;
  blocks_count: number;
  last_admin_edit: string | null;
  last_build: string | null;
  node_version: string;
}

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

function checkAuth(req: Request): boolean {
  const expected = process.env.FLEET_TOKEN;
  if (!expected) return false;
  const header = req.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  const provided = match[1];
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function computeStats(): FleetStats {
  const slugs = listPages();
  let blocksCount = 0;
  let newestMtime: number | null = null;

  for (const slug of slugs) {
    try {
      const page = loadPage(slug);
      blocksCount += page.blocks.length;
    } catch {
      // ignore malformed pages
    }
    const mtime = safeMtime(path.join(PAGES_DIR, `${slug}.json`));
    if (mtime != null && (newestMtime == null || mtime > newestMtime)) {
      newestMtime = mtime;
    }
  }

  return {
    pages_count: slugs.length,
    blocks_count: blocksCount,
    last_admin_edit: newestMtime ? new Date(newestMtime).toISOString() : null,
    last_build: process.env.BUILD_TIME ?? null,
    node_version: process.version,
  };
}

function safeMtime(file: string): number | null {
  try {
    return fs.statSync(file).mtimeMs;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized' },
      { status: 401 }
    );
  }

  try {
    return NextResponse.json({ ok: true, data: computeStats() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'stats failed';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
