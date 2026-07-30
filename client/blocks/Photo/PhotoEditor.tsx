'use client';

import type { PhotoBlock } from '@/client/types';
import { ImageField, TextField } from '@/lib/ui';

interface PhotoEditorProps {
  block: PhotoBlock;
  onChange: (block: PhotoBlock) => void;
}

export function PhotoEditor({ block, onChange }: PhotoEditorProps) {
  return (
    <>
      <ImageField
        label="Photo"
        value={block.image ?? ''}
        onChange={(image) => onChange({ ...block, image: image || undefined })}
        alt={block.alt ?? ''}
      />
      <TextField
        label="Alt text"
        value={block.alt ?? ''}
        onChange={(alt) => onChange({ ...block, alt: alt || undefined })}
      />
      <TextField
        label="Caption (optional)"
        value={block.caption ?? ''}
        onChange={(caption) => onChange({ ...block, caption: caption || undefined })}
      />
    </>
  );
}
