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
    <div className="space-y-3">
      <div>
        <Label>Text</Label>
        <Textarea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          rows={3}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!block.dropCap}
          onChange={(e) =>
            onChange({ ...block, dropCap: e.target.checked || undefined })
          }
        />
        <span>Drop cap on first letter</span>
      </label>
    </div>
  );
}
