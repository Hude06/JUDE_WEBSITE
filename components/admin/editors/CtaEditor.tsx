'use client';

import type { CtaBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CtaEditorProps {
  block: CtaBlock;
  onChange: (block: CtaBlock) => void;
}

export function CtaEditor({ block, onChange }: CtaEditorProps) {
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
        <Label>Title</Label>
        <Textarea
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          rows={2}
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
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Primary CTA text</Label>
          <Input
            value={block.primaryCta?.text ?? ''}
            onChange={(e) =>
              onChange({
                ...block,
                primaryCta: e.target.value
                  ? { text: e.target.value, href: block.primaryCta?.href ?? '' }
                  : undefined,
              })
            }
          />
        </div>
        <div>
          <Label>Primary CTA link</Label>
          <Input
            value={block.primaryCta?.href ?? ''}
            onChange={(e) =>
              onChange({
                ...block,
                primaryCta: block.primaryCta
                  ? { ...block.primaryCta, href: e.target.value }
                  : { text: '', href: e.target.value },
              })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Secondary CTA text</Label>
          <Input
            value={block.secondaryCta?.text ?? ''}
            onChange={(e) =>
              onChange({
                ...block,
                secondaryCta: e.target.value
                  ? { text: e.target.value, href: block.secondaryCta?.href ?? '' }
                  : undefined,
              })
            }
          />
        </div>
        <div>
          <Label>Secondary CTA link</Label>
          <Input
            value={block.secondaryCta?.href ?? ''}
            onChange={(e) =>
              onChange({
                ...block,
                secondaryCta: block.secondaryCta
                  ? { ...block.secondaryCta, href: e.target.value }
                  : { text: '', href: e.target.value },
              })
            }
          />
        </div>
      </div>
      <div>
        <Label>Tone</Label>
        <select
          value={block.tone ?? 'default'}
          onChange={(e) =>
            onChange({ ...block, tone: e.target.value as CtaBlock['tone'] })
          }
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value="default">Default (muted background)</option>
          <option value="bold">Bold (inverted)</option>
          <option value="quiet">Quiet (outlined)</option>
        </select>
      </div>
    </div>
  );
}
