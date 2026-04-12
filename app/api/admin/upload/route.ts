import { NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/admin';
import type { ApiResponse } from '@/lib/types';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'File must be under 5MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = await saveUploadedFile(buffer, file.name);

    return NextResponse.json<ApiResponse<{ path: string }>>({
      success: true,
      data: { path: filePath },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
