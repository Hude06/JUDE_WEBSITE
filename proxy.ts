import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_MUTATIONS = 60;

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

function clientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function isRateLimited(ip: string, nowMs: number): boolean {
  const existing = rateBuckets.get(ip);
  if (!existing || nowMs >= existing.resetAt) {
    rateBuckets.set(ip, {
      count: 1,
      resetAt: nowMs + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  existing.count += 1;
  return existing.count > RATE_LIMIT_MAX_MUTATIONS;
}

function pruneRateBuckets(nowMs: number): void {
  for (const [ip, bucket] of rateBuckets.entries()) {
    if (nowMs >= bucket.resetAt) {
      rateBuckets.delete(ip);
    }
  }
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  if (!host) return false;

  const allowedHosts = new Set<string>();
  allowedHosts.add(host);
  const envHost = process.env.ADMIN_ALLOWED_HOST;
  if (envHost) allowedHosts.add(envHost);

  const check = (value: string | null): boolean => {
    if (!value) return false;
    try {
      const u = new URL(value);
      return allowedHosts.has(u.host);
    } catch {
      return false;
    }
  };

  if (origin) return check(origin);
  if (referer) return check(referer);
  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nowMs = Date.now();

  pruneRateBuckets(nowMs);

  if (!pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  if (SAFE_METHODS.has(request.method)) {
    return NextResponse.next();
  }

  const ip = clientIp(request);
  if (isRateLimited(ip, nowMs)) {
    return NextResponse.json(
      { success: false, error: 'Rate limited: too many admin write requests' },
      { status: 429 }
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { success: false, error: 'CSRF check failed: origin not allowed' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
