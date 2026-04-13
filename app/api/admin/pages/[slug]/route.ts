import { NextResponse } from 'next/server';
import { loadPage } from '@/lib/content';
import { writePage, deletePage, validatePageContent, validateSlug } from '@/lib/admin';
import type { ApiResponse, PageContent } from '@/lib/types';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;

  if (!validateSlug(slug)) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Invalid slug' },
      { status: 400 }
    );
  }

  try {
    const page = loadPage(slug);
    return NextResponse.json<ApiResponse<PageContent>>({
      success: true,
      data: page,
    });
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Page not found' },
      { status: 404 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  if (!validateSlug(slug)) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Invalid slug' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    if (body.slug !== slug) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Slug in body must match URL slug' },
        { status: 400 }
      );
    }

    const validated = validatePageContent(body);
    writePage(validated);

    return NextResponse.json<ApiResponse<PageContent>>({
      success: true,
      data: validated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update page';
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { slug } = await params;

  if (!validateSlug(slug)) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Invalid slug' },
      { status: 400 }
    );
  }

  try {
    deletePage(slug);
    return NextResponse.json<ApiResponse<null>>({
      success: true,
    });
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Page not found' },
      { status: 404 }
    );
  }
}
