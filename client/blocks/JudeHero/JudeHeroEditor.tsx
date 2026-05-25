'use client';

import type { JudeHeroBlock } from '@/client/types';
import { SelectField, TextAreaField, TextField } from '@/lib/ui';

interface JudeHeroEditorProps {
  block: JudeHeroBlock;
  onChange: (block: JudeHeroBlock) => void;
}

export function JudeHeroEditor({ block, onChange }: JudeHeroEditorProps) {
  return (
    <>
      <TextField
        label="Eyebrow"
        value={block.eyebrow ?? ''}
        onChange={(eyebrow) => onChange({ ...block, eyebrow: eyebrow || undefined })}
      />
      <TextAreaField
        label="Headline"
        rows={2}
        value={block.headline}
        onChange={(headline) => onChange({ ...block, headline })}
      />
      <TextAreaField
        label="Subheadline"
        rows={3}
        value={block.subheadline ?? ''}
        onChange={(subheadline) => onChange({ ...block, subheadline: subheadline || undefined })}
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

      <TextField
        label="Image URL (optional)"
        value={block.image ?? ''}
        onChange={(image) => onChange({ ...block, image: image || undefined })}
      />
      <SelectField
        label="Alignment"
        value={block.align ?? 'left'}
        onChange={(align) => onChange({ ...block, align: align as 'left' | 'center' })}
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
        ]}
      />
    </>
  );
}
