import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 5;

const BOOT_AT = Date.now();

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      version: process.env.BUILD_SHA ?? 'dev',
      built_at: process.env.BUILD_TIME ?? null,
      uptime_s: Math.floor((Date.now() - BOOT_AT) / 1000),
    },
    {
      headers: {
        'cache-control': 'public, max-age=5, s-maxage=5',
      },
    }
  );
}
