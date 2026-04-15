'use client';

import type { FeatureGridBlock, FeatureItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureGridEditorProps {
  block: FeatureGridBlock;
  onChange: (block: FeatureGridBlock) => void;
}

const ICON_OPTIONS = [
  'zap',
  'shield',
  'star',
  'heart',
  'check',
  'sparkles',
  'rocket',
  'layers',
  'compass',
  'globe',
  'lock',
  'clock',
  'target',
  'award',
  'trending-up',
  'users',
  'code',
  'palette',
];

export function FeatureGridEditor({ block, onChange }: FeatureGridEditorProps) {
  function updateItem(i: number, updates: Partial<FeatureItem>) {
    const items = block.items.map((item, idx) => (idx === i ? { ...item, ...updates } : item));
    onChange({ ...block, items });
  }

  function removeItem(i: number) {
    onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) });
  }

  function addItem() {
    onChange({
      ...block,
      items: [...block.items, { icon: 'sparkles', title: '', description: '' }],
    });
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
      <div>
        <Label>Columns</Label>
        <select
          value={block.columns ?? 3}
          onChange={(e) =>
            onChange({ ...block, columns: Number(e.target.value) as 2 | 3 | 4 })
          }
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>
      <Label>Items</Label>
      {block.items.map((item, i) => (
        <Card key={i} size="sm">
          <CardContent className="space-y-2">
            <select
              value={item.icon ?? 'sparkles'}
              onChange={(e) => updateItem(i, { icon: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              {ICON_OPTIONS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <Input
              value={item.title}
              onChange={(e) => updateItem(i, { title: e.target.value })}
              placeholder="Feature title"
            />
            <Textarea
              value={item.description}
              onChange={(e) => updateItem(i, { description: e.target.value })}
              placeholder="Feature description"
              rows={2}
            />
            <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addItem}>
        + Add Feature
      </Button>
    </div>
  );
}
