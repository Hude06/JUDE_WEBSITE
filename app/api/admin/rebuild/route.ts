import { NextResponse } from 'next/server';
import { rebuildSite, gitCommitAndPush, isRebuilding, rebuildCooldownRemainingMs } from '@/lib/admin';
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

  const cooldown = rebuildCooldownRemainingMs();
  if (cooldown > 0) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: `Rate limited: wait ${Math.ceil(cooldown / 1000)}s` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const raw = (body as { message?: unknown }).message;
    const message =
      typeof raw === 'string' && raw.trim().length > 0 && raw.length <= 500
        ? raw
        : 'content: update via admin panel';

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
