'use client';

import type { TestimonialBlock } from '@/client/types';
import { TextAreaField, TextField } from '@/lib/ui';

interface TestimonialEditorProps {
  block: TestimonialBlock;
  onChange: (block: TestimonialBlock) => void;
}

export function TestimonialEditor({ block, onChange }: TestimonialEditorProps) {
  return (
    <>
      <TextAreaField
        label="Quote"
        rows={4}
        value={block.quote}
        onChange={(quote) => onChange({ ...block, quote })}
      />
      <TextField label="Name" value={block.name} onChange={(name) => onChange({ ...block, name })} />
      <TextField
        label="Business (optional)"
        value={block.business ?? ''}
        onChange={(business) => onChange({ ...block, business: business || undefined })}
      />
      <TextField
        label="Business link (optional)"
        value={block.link ?? ''}
        onChange={(link) => onChange({ ...block, link: link || undefined })}
      />
    </>
  );
}
