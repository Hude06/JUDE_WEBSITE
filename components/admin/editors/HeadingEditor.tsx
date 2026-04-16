'use client';

import type { HeadingBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HeadingEditorProps {
  block: HeadingBlock;
  onChange: (block: HeadingBlock) => void;
}

export function HeadingEditor({ block, onChange }: HeadingEditorProps) {
  return (
    <div className="space-y-2">
      <div>
        <Label>Text</Label>
        <Input
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
        />
      </div>
      <div>
        <Label>Level</Label>
        <select
          value={block.level ?? 1}
          onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 })}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
          <option value={5}>H5</option>
          <option value={6}>H6</option>
        </select>
      </div>
      <div>
        <Label>Anchor ID (optional)</Label>
        <Input
          value={block.anchorId ?? ''}
          onChange={(e) =>
            onChange({ ...block, anchorId: e.target.value || undefined })
          }
          placeholder="e.g. work — lets nav links target this heading"
        />
      </div>
    </div>
  );
}
