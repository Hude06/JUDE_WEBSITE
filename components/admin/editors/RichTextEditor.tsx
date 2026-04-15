'use client';

import type { RichTextBlock } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RichTextEditorProps {
  block: RichTextBlock;
  onChange: (block: RichTextBlock) => void;
}

export function RichTextEditor({ block, onChange }: RichTextEditorProps) {
  return (
    <div className="space-y-2">
      <Label>Content (Markdown)</Label>
      <Textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        rows={10}
        placeholder={`## A heading

A paragraph with **bold** and *italic* and [links](https://example.com).

- List item one
- List item two

> A highlighted quote.`}
      />
      <p className="text-xs text-muted-foreground">
        Supports: ## and ### headings, **bold**, *italic*, [links](url), - bullet lists, &gt; quotes.
      </p>
    </div>
  );
}
