'use client';

import type { JudeHeroBlock } from '@/client/types';
import { ImageField, SelectField, TextAreaField, TextField } from '@/lib/ui';

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
      <TextField
        label="Headline accent (shown in red after the headline)"
        value={block.headlineAccent ?? ''}
        onChange={(headlineAccent) => onChange({ ...block, headlineAccent: headlineAccent || undefined })}
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

      <ImageField
        label="Portrait photo"
        value={block.photo ?? ''}
        onChange={(photo) => onChange({ ...block, photo: photo || undefined })}
        alt={block.photoAlt ?? ''}
      />
      <TextField
        label="Photo alt text"
        value={block.photoAlt ?? ''}
        onChange={(photoAlt) => onChange({ ...block, photoAlt: photoAlt || undefined })}
      />
      <TextField
        label="Photo caption chip"
        value={block.photoCaption ?? ''}
        onChange={(photoCaption) => onChange({ ...block, photoCaption: photoCaption || undefined })}
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
