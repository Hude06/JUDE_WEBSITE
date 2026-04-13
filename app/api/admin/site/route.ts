import { NextResponse } from 'next/server';
import { loadSiteConfig } from '@/lib/content';
import { writeSiteConfig } from '@/lib/admin';
import type { ApiResponse, SiteConfig } from '@/lib/types';

export async function GET() {
  try {
    const config = loadSiteConfig();
    return NextResponse.json<ApiResponse<SiteConfig>>({
      success: true,
      data: config,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load site config';
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    writeSiteConfig(body as SiteConfig);

    return NextResponse.json<ApiResponse<SiteConfig>>({
      success: true,
      data: body as SiteConfig,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update site config';
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
