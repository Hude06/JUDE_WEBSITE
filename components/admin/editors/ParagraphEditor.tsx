'use client';

import type { ParagraphBlock } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ParagraphEditorProps {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
}

export function ParagraphEditor({ block, onChange }: ParagraphEditorProps) {
  return (
    <div>
      <Label>Text</Label>
      <Textarea
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        rows={3}
      />
    </div>
  );
}
