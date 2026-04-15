'use client';

import type { FaqBlock, FaqItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FaqEditorProps {
  block: FaqBlock;
  onChange: (block: FaqBlock) => void;
}

export function FaqEditor({ block, onChange }: FaqEditorProps) {
  function updateItem(i: number, updates: Partial<FaqItem>) {
    const items = block.items.map((item, idx) => (idx === i ? { ...item, ...updates } : item));
    onChange({ ...block, items });
  }

  function removeItem(i: number) {
    onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) });
  }

  function addItem() {
    onChange({ ...block, items: [...block.items, { question: '', answer: '' }] });
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
      <Label>Questions</Label>
      {block.items.map((item, i) => (
        <Card key={i} size="sm">
          <CardContent className="space-y-2">
            <Input
              value={item.question}
              onChange={(e) => updateItem(i, { question: e.target.value })}
              placeholder="Question"
            />
            <Textarea
              value={item.answer}
              onChange={(e) => updateItem(i, { answer: e.target.value })}
              placeholder="Answer"
              rows={3}
            />
            <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addItem}>
        + Add Question
      </Button>
    </div>
  );
}
