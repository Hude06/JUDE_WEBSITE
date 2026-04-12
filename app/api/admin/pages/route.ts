import { NextResponse } from 'next/server';
import { listPages, loadPage } from '@/lib/content';
import { writePage, validateSlug, generateBlockId } from '@/lib/admin';
import type { ApiResponse, PageContent } from '@/lib/types';

export async function GET() {
  const pages = listPages();
  const pageList = pages.map((slug) => {
    const page = loadPage(slug);
    return { slug, title: page.title };
  });

  return NextResponse.json<ApiResponse<{ slug: string; title: string }[]>>({
    success: true,
    data: pageList,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!slug || !validateSlug(slug)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Slug must be lowercase alphanumeric with hyphens' },
        { status: 400 }
      );
    }

    const existing = listPages();
    if (existing.includes(slug)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'A page with this slug already exists' },
        { status: 409 }
      );
    }

    const page: PageContent = {
      title,
      slug,
      blocks: [
        { id: generateBlockId(slug, 0), type: 'heading', text: title },
        { id: generateBlockId(slug, 1), type: 'paragraph', text: 'Start editing this page...' },
      ],
    };

    writePage(page);

    return NextResponse.json<ApiResponse<PageContent>>({
      success: true,
      data: page,
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create page';
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
