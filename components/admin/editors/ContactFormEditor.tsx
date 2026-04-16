'use client';

import type { ContactFormBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Field = 'name' | 'email' | 'subject' | 'message';
const ALL_FIELDS: Field[] = ['name', 'email', 'subject', 'message'];

interface ContactFormEditorProps {
  block: ContactFormBlock;
  onChange: (block: ContactFormBlock) => void;
}

export function ContactFormEditor({ block, onChange }: ContactFormEditorProps) {
  const activeFields = new Set<Field>(block.fields ?? ['name', 'email', 'message']);

  function toggleField(field: Field) {
    const next = new Set(activeFields);
    if (next.has(field)) next.delete(field);
    else next.add(field);
    onChange({ ...block, fields: ALL_FIELDS.filter((f) => next.has(f)) });
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
        <Label>Description</Label>
        <Textarea
          value={block.description ?? ''}
          onChange={(e) => onChange({ ...block, description: e.target.value || undefined })}
          rows={2}
        />
      </div>
      <div>
        <Label>Form action URL</Label>
        <Input
          value={block.action ?? ''}
          onChange={(e) => onChange({ ...block, action: e.target.value || undefined })}
          placeholder="mailto:you@example.com or POST endpoint"
        />
      </div>
      <div>
        <Label>Submit button label</Label>
        <Input
          value={block.submitLabel ?? ''}
          onChange={(e) => onChange({ ...block, submitLabel: e.target.value || undefined })}
          placeholder="Send message"
        />
      </div>
      <div>
        <Label>Fields</Label>
        <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
          {ALL_FIELDS.map((field) => (
            <label key={field} className="flex items-center gap-2 capitalize">
              <input
                type="checkbox"
                checked={activeFields.has(field)}
                onChange={() => toggleField(field)}
              />
              {field}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
