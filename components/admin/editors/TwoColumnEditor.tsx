'use client';

import type { TwoColumnBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

type Column = TwoColumnBlock['left'];

interface TwoColumnEditorProps {
  block: TwoColumnBlock;
  onChange: (block: TwoColumnBlock) => void;
}

export function TwoColumnEditor({ block, onChange }: TwoColumnEditorProps) {
  function updateSide(side: 'left' | 'right', updates: Partial<Column>) {
    onChange({ ...block, [side]: { ...block[side], ...updates } });
  }

  function renderSide(label: string, side: 'left' | 'right') {
    const data = block[side];
    return (
      <Card size="sm">
        <CardContent className="space-y-2">
          <Label>{label}</Label>
          <Input
            value={data.heading ?? ''}
            onChange={(e) => updateSide(side, { heading: e.target.value || undefined })}
            placeholder="Heading (optional)"
          />
          <Textarea
            value={data.text}
            onChange={(e) => updateSide(side, { text: e.target.value })}
            placeholder="Body text"
            rows={3}
          />
          <Input
            value={data.image ?? ''}
            onChange={(e) => updateSide(side, { image: e.target.value || undefined })}
            placeholder="Image URL (if set, replaces text)"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {renderSide('Left column', 'left')}
      {renderSide('Right column', 'right')}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={block.reverse ?? false}
          onChange={(e) => onChange({ ...block, reverse: e.target.checked })}
        />
        Reverse column order on desktop
      </label>
    </div>
  );
}
