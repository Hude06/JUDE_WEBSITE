import { NextResponse } from 'next/server';
import { recordEvent } from '@/lib/analytics-store';
import {
  clientIp,
  isBot,
  rateLimited,
  referrerHost,
  sanitizePath,
  sanitizeRef,
  visitorHash,
} from '@/lib/track-util';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY = 2048;

// Public by necessity — anonymous browsers beacon here on every pageview, so it
// cannot be token-protected (a token in client JS is visible to everyone).
// Abuse resistance instead comes from: bot filtering, per-IP rate limiting, a
// tiny body cap, cheap in-memory writes, and the Nginx limit_req in front.
function noContent() {
  return new NextResponse(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}

export async function POST(req: Request) {
  if (Number(req.headers.get('content-length') || 0) > MAX_BODY) return noContent();

  const ua = req.headers.get('user-agent');
  if (isBot(ua)) return noContent();

  const ip = clientIp(req.headers);
  const now = Date.now();
  if (ip && rateLimited(ip, now)) return noContent();

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return noContent();
  }
  if (raw.length > MAX_BODY) return noContent();

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return noContent();
  }

  const path = sanitizePath(body.path);
  if (path.startsWith('/api') || path.startsWith('/admin') || path.startsWith('/ui-preview')) {
    return noContent();
  }

  recordEvent({
    path,
    ref: sanitizeRef(body.ref),
    referrerHost: referrerHost(body.referrer, req.headers.get('host')),
    visitor: visitorHash(ip, ua, new Date(now).toISOString().slice(0, 10)),
    ts: now,
  });
  return noContent();
}
