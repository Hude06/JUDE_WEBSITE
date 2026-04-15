'use client';

import type { QuoteBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface QuoteEditorProps {
  block: QuoteBlock;
  onChange: (block: QuoteBlock) => void;
}

export function QuoteEditor({ block, onChange }: QuoteEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Quote</Label>
        <Textarea
          value={block.quote}
          onChange={(e) => onChange({ ...block, quote: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <Label>Author</Label>
        <Input
          value={block.author}
          onChange={(e) => onChange({ ...block, author: e.target.value })}
        />
      </div>
      <div>
        <Label>Role (optional)</Label>
        <Input
          value={block.role ?? ''}
          onChange={(e) => onChange({ ...block, role: e.target.value || undefined })}
        />
      </div>
      <div>
        <Label>Avatar URL (optional)</Label>
        <Input
          value={block.avatar ?? ''}
          onChange={(e) => onChange({ ...block, avatar: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
