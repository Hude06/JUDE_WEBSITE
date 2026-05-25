'use client';

import type { ParagraphBlock } from '@/client/types';
import { TextAreaField, ToggleField } from '@/lib/ui';

interface ParagraphEditorProps {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
}

export function ParagraphEditor({ block, onChange }: ParagraphEditorProps) {
  return (
    <>
      <TextAreaField
        label="Text"
        rows={5}
        value={block.text}
        onChange={(text) => onChange({ ...block, text })}
      />
      <ToggleField
        label="Drop cap"
        value={Boolean(block.dropCap)}
        onChange={(dropCap) => onChange({ ...block, dropCap: dropCap || undefined })}
      />
    </>
  );
}
