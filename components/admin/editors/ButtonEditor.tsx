'use client';

import type { ButtonBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ButtonEditorProps {
  block: ButtonBlock;
  onChange: (block: ButtonBlock) => void;
}

export function ButtonEditor({ block, onChange }: ButtonEditorProps) {
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
        <Label>Link URL</Label>
        <Input
          value={block.href}
          onChange={(e) => onChange({ ...block, href: e.target.value })}
        />
      </div>
      <div>
        <Label>Variant</Label>
        <select
          value={block.variant ?? 'default'}
          onChange={(e) => onChange({ ...block, variant: e.target.value as ButtonBlock['variant'] })}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value="default">Default</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
        </select>
      </div>
    </div>
  );
}
