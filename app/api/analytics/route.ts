import { NextResponse } from 'next/server';
import { checkFleetToken } from '@/lib/fleet-auth';
import { readSince } from '@/lib/analytics-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Read side of the tracker. Token-protected (FLEET_TOKEN) so only the fleet
// dashboard can pull a site's visit data. Incremental: the caller passes the
// last id it has seen; the response carries bootId so the poller can detect a
// process restart and re-sync from zero.
export async function GET(req: Request) {
  if (!checkFleetToken(req)) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized' },
      { status: 401, headers: { 'cache-control': 'no-store' } }
    );
  }
  const url = new URL(req.url);
  const since = Math.max(0, Number(url.searchParams.get('since')) || 0);
  const limit = Math.min(5000, Math.max(1, Number(url.searchParams.get('limit')) || 5000));
  const { bootId, maxId, events } = readSince(since, limit);
  return NextResponse.json(
    { ok: true, bootId, maxId, events },
    { headers: { 'cache-control': 'no-store' } }
  );
}
