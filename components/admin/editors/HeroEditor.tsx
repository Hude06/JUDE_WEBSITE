'use client';

import type { HeroBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface HeroEditorProps {
  block: HeroBlock;
  onChange: (block: HeroBlock) => void;
}

export function HeroEditor({ block, onChange }: HeroEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Eyebrow</Label>
        <Input
          value={block.eyebrow ?? ''}
          onChange={(e) => onChange({ ...block, eyebrow: e.target.value || undefined })}
          placeholder="Small label above headline"
        />
      </div>
      <div>
        <Label>Headline</Label>
        <Textarea
          value={block.headline}
          onChange={(e) => onChange({ ...block, headline: e.target.value })}
          rows={2}
          placeholder="Main headline"
        />
      </div>
      <div>
        <Label>Subheadline</Label>
        <Textarea
          value={block.subheadline ?? ''}
          onChange={(e) => onChange({ ...block, subheadline: e.target.value || undefined })}
          rows={2}
          placeholder="Supporting sentence"
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
        <Label>Image URL (optional)</Label>
        <Input
          value={block.image ?? ''}
          onChange={(e) => onChange({ ...block, image: e.target.value || undefined })}
        />
      </div>
      <div>
        <Label>Alignment</Label>
        <select
          value={block.align ?? 'left'}
          onChange={(e) => onChange({ ...block, align: e.target.value as 'left' | 'center' })}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
        </select>
      </div>
    </div>
  );
}
