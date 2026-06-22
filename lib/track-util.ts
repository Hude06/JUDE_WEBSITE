import crypto from 'node:crypto';

// Pure, dependency-free helpers for the pageview tracker. Kept free of Next /
// browser imports so they can be unit-tested and reused by the route handler.

const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|monitor|preview|scan|fetch|curl|wget|python-requests|axios|go-http|httpclient|lighthouse|uptimerobot/i;

// Drop ASCII control chars (0-31) and DEL (127); keep everything printable.
function stripControl(s: string): string {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0) ?? 0;
    if (c >= 32 && c !== 127) out += ch;
  }
  return out;
}

// Most automated traffic never executes the client beacon, but defend the
// endpoint anyway. A missing UA is almost always a script.
export function isBot(ua: string | null): boolean {
  if (!ua) return true;
  return BOT_RE.test(ua);
}

export function sanitizePath(input: unknown): string {
  if (typeof input !== 'string') return '/';
  let p = input.split('#')[0].split('?')[0];
  if (!p.startsWith('/')) p = '/' + p;
  p = stripControl(p);
  return p.slice(0, 512) || '/';
}

// Any ref value is accepted — only clamped and stripped of control chars so a
// junk/abusive value can't bloat storage. Empty/missing → null ("(none)").
export function sanitizeRef(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const r = stripControl(input).trim();
  if (!r) return null;
  return r.slice(0, 64);
}

// Host only, never the full referrer URL. Self-referrals (same host) are
// internal navigation, not a referral source → null.
export function referrerHost(referrer: unknown, selfHost: string | null): string | null {
  if (typeof referrer !== 'string' || !referrer) return null;
  try {
    const host = new URL(referrer).host.toLowerCase();
    if (!host) return null;
    if (selfHost && host === selfHost.toLowerCase()) return null;
    return host.slice(0, 128);
  } catch {
    return null;
  }
}

export function clientIp(headers: Headers): string | null {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim() || null;
  return headers.get('x-real-ip');
}

// Cookieless rough-unique id: sha256 of (daily salt | ip | ua), truncated.
// The salt is random per UTC day and lives only in memory — raw IP/UA are
// never stored and the hash can't be reversed or correlated across days.
let saltDay = '';
let salt = '';
export function visitorHash(ip: string | null, ua: string | null, day: string): string | null {
  if (!ip) return null;
  if (day !== saltDay) {
    saltDay = day;
    salt = crypto.randomBytes(16).toString('hex');
  }
  return crypto.createHash('sha256').update(`${salt}|${ip}|${ua ?? ''}`).digest('hex').slice(0, 16);
}

// Fixed-window per-key rate limit (defence-in-depth; real flood protection is
// the Nginx limit_req in front of the app — see nginx.conf).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimited(key: string, now: number): boolean {
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
    }
    buckets.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  b.count++;
  return b.count > MAX_PER_WINDOW;
}
