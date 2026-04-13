import { NextResponse } from 'next/server';
import { rebuildSite, gitCommitAndPush, isRebuilding } from '@/lib/admin';
import type { ApiResponse } from '@/lib/types';

interface RebuildResult {
  rebuilt: boolean;
  committed: boolean;
}

export async function POST(request: Request) {
  if (isRebuilding()) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Build already in progress' },
      { status: 409 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const message = (body as { message?: string }).message || 'content: update via admin panel';

    await rebuildSite();
    const committed = await gitCommitAndPush(message);

    return NextResponse.json<ApiResponse<RebuildResult>>({
      success: true,
      data: { rebuilt: true, committed },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Rebuild failed';
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
