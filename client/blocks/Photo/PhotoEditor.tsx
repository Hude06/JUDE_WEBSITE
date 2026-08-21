'use client';

import type { PhotoBlock } from '@/client/types';
import { ImageField, TextAreaField, TextField } from '@/lib/ui';

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
      <TextField
        label="Side column heading (optional)"
        value={block.title ?? ''}
        onChange={(title) => onChange({ ...block, title: title || undefined })}
      />
      <TextAreaField
        label="Side column text — narrows the image to make room"
        rows={4}
        value={block.text ?? ''}
        onChange={(text) => onChange({ ...block, text: text || undefined })}
      />
    </>
  );
}
