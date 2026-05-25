'use client';

import type { JudeHeadingBlock } from '@/client/types';
import { SelectField, TextField } from '@/lib/ui';

interface JudeHeadingEditorProps {
  block: JudeHeadingBlock;
  onChange: (block: JudeHeadingBlock) => void;
}

export function JudeHeadingEditor({ block, onChange }: JudeHeadingEditorProps) {
  return (
    <>
      <TextField label="Text" value={block.text} onChange={(text) => onChange({ ...block, text })} />
      <SelectField
        label="Level"
        value={String(block.level ?? 1)}
        onChange={(value) => onChange({ ...block, level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })}
        options={[
          { value: '1', label: 'H1' },
          { value: '2', label: 'H2' },
          { value: '3', label: 'H3' },
          { value: '4', label: 'H4' },
          { value: '5', label: 'H5' },
          { value: '6', label: 'H6' },
        ]}
      />
      <TextField
        label="Anchor ID (optional)"
        value={block.anchorId ?? ''}
        onChange={(anchorId) => onChange({ ...block, anchorId: anchorId || undefined })}
        placeholder="work"
      />
    </>
  );
}
