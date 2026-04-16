import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  if (SAFE_METHODS.has(request.method)) {
    return NextResponse.next();
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
