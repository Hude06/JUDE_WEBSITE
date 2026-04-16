'use client';

import type { StatsBlock, StatItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface StatsEditorProps {
  block: StatsBlock;
  onChange: (block: StatsBlock) => void;
}

export function StatsEditor({ block, onChange }: StatsEditorProps) {
  function updateItem(i: number, updates: Partial<StatItem>) {
    const items = block.items.map((item, idx) => (idx === i ? { ...item, ...updates } : item));
    onChange({ ...block, items });
  }

  function removeItem(i: number) {
    onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) });
  }

  function addItem() {
    onChange({ ...block, items: [...block.items, { value: '', label: '' }] });
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>Eyebrow</Label>
        <Input
          value={block.eyebrow ?? ''}
          onChange={(e) => onChange({ ...block, eyebrow: e.target.value || undefined })}
        />
      </div>
      <div>
        <Label>Heading</Label>
        <Input
          value={block.heading ?? ''}
          onChange={(e) => onChange({ ...block, heading: e.target.value || undefined })}
        />
      </div>
      <Label>Stats</Label>
      {block.items.map((item, i) => (
        <Card key={i} size="sm">
          <CardContent className="space-y-2">
            <Input
              value={item.value}
              onChange={(e) => updateItem(i, { value: e.target.value })}
              placeholder="e.g. 98%"
            />
            <Input
              value={item.label}
              onChange={(e) => updateItem(i, { label: e.target.value })}
              placeholder="Label"
            />
            <Input
              value={item.caption ?? ''}
              onChange={(e) => updateItem(i, { caption: e.target.value || undefined })}
              placeholder="Caption (optional)"
            />
            <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addItem}>
        + Add Stat
      </Button>
    </div>
  );
}
