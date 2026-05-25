'use client';

import type { CtaBlock } from '@/client/types';
import { SelectField, TextAreaField, TextField } from '@/lib/ui';

interface CtaEditorProps {
  block: CtaBlock;
  onChange: (block: CtaBlock) => void;
}

export function CtaEditor({ block, onChange }: CtaEditorProps) {
  return (
    <>
      <TextField
        label="Eyebrow"
        value={block.eyebrow ?? ''}
        onChange={(eyebrow) => onChange({ ...block, eyebrow: eyebrow || undefined })}
      />
      <TextAreaField label="Title" rows={2} value={block.title} onChange={(title) => onChange({ ...block, title })} />
      <TextAreaField
        label="Description"
        rows={3}
        value={block.description ?? ''}
        onChange={(description) => onChange({ ...block, description: description || undefined })}
      />

      <TextField
        label="Primary CTA text"
        value={block.primaryCta?.text ?? ''}
        onChange={(text) =>
          onChange({
            ...block,
            primaryCta: text ? { text, href: block.primaryCta?.href ?? '' } : undefined,
          })
        }
      />
      <TextField
        label="Primary CTA link"
        value={block.primaryCta?.href ?? ''}
        onChange={(href) =>
          onChange({
            ...block,
            primaryCta: block.primaryCta ? { ...block.primaryCta, href } : href ? { text: '', href } : undefined,
          })
        }
      />

      <TextField
        label="Secondary CTA text"
        value={block.secondaryCta?.text ?? ''}
        onChange={(text) =>
          onChange({
            ...block,
            secondaryCta: text ? { text, href: block.secondaryCta?.href ?? '' } : undefined,
          })
        }
      />
      <TextField
        label="Secondary CTA link"
        value={block.secondaryCta?.href ?? ''}
        onChange={(href) =>
          onChange({
            ...block,
            secondaryCta: block.secondaryCta ? { ...block.secondaryCta, href } : href ? { text: '', href } : undefined,
          })
        }
      />

      <SelectField
        label="Tone"
        value={block.tone ?? 'default'}
        onChange={(tone) => onChange({ ...block, tone: tone as CtaBlock['tone'] })}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'bold', label: 'Bold' },
          { value: 'quiet', label: 'Quiet' },
        ]}
      />
    </>
  );
}
