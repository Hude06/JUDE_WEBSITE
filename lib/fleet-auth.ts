import { timingSafeEqual } from 'node:crypto';

// Shared bearer-token check for fleet read endpoints (/api/analytics, and the
// same scheme /api/fleet/stats uses). Constant-time compare; returns false when
// FLEET_TOKEN is unset so the endpoints stay closed by default.
export function checkFleetToken(req: Request): boolean {
  const expected = process.env.FLEET_TOKEN;
  if (!expected) return false;
  const header = req.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  const a = Buffer.from(match[1]);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
