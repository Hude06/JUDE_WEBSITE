'use client';

import type { HeroBlock, CtaLink } from '../../../lib/types';
import { Stack, TextField, TextAreaField, ImageField, SelectField, ArrayField } from '../../../lib/ui';

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const variantOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'accent', label: 'Accent' },
];

const layoutOptions = [
  { value: 'auto', label: 'Theme default' },
  { value: 'stack', label: 'Stacked' },
  { value: 'split', label: 'Split (text + image)' },
  { value: 'full-bleed', label: 'Full-bleed image' },
  { value: 'offset', label: 'Offset (oversized)' },
];

export function HeroEditor({ block, onChange }: { block: HeroBlock; onChange: (b: HeroBlock) => void }) {
  return (
    <Stack gap={4}>
      <TextField label="Eyebrow (optional)" hint="Small label above the title" value={block.eyebrow ?? ''} onChange={(v) => onChange({ ...block, eyebrow: v || undefined })} />
      <TextField label="Title" value={block.title} onChange={(title) => onChange({ ...block, title })} />
      <TextAreaField label="Subtitle (optional)" value={block.subtitle ?? ''} rows={3} onChange={(v) => onChange({ ...block, subtitle: v || undefined })} />
      <SelectField label="Layout" value={block.layout ?? 'auto'} options={layoutOptions} onChange={(v) => onChange({ ...block, layout: v === 'auto' ? undefined : (v as HeroBlock['layout']) })} />
      <SelectField label="Alignment" value={block.align ?? 'left'} options={alignOptions} onChange={(v) => onChange({ ...block, align: v as HeroBlock['align'] })} />
      <ImageField label="Image (optional)" value={block.image ?? ''} onChange={(v) => onChange({ ...block, image: v || undefined })} alt={block.title} />
      <ArrayField<CtaLink>
        label="Buttons"
        items={block.buttons ?? []}
        onChange={(buttons) => onChange({ ...block, buttons })}
        createItem={() => ({ label: 'Button', href: '/', variant: 'primary' })}
        itemLabel={(b) => b.label || 'Untitled button'}
        maxItems={4}
        addLabel="Add button"
        renderItem={(item, _i, update) => (
          <Stack gap={3}>
            <TextField label="Label" value={item.label} onChange={(label) => update({ ...item, label })} />
            <TextField label="Link" value={item.href} onChange={(href) => update({ ...item, href })} />
            <SelectField label="Variant" value={item.variant ?? 'primary'} options={variantOptions} onChange={(v) => update({ ...item, variant: v as CtaLink['variant'] })} />
          </Stack>
        )}
      />
    </Stack>
  );
}
