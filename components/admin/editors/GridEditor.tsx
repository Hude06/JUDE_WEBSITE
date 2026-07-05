'use client';

import type { GridBlock, GridItem } from '../../../lib/types';
import { Stack, TextField, TextAreaField, ImageField, SelectField, ArrayField } from '../../../lib/ui';

const columnsOptions = [
  { value: '2', label: '2 columns' },
  { value: '3', label: '3 columns' },
  { value: '4', label: '4 columns' },
];

const styleOptions = [
  { value: 'auto', label: 'Theme default' },
  { value: 'cards', label: 'Cards' },
  { value: 'bare', label: 'Bare (no chrome)' },
  { value: 'bordered-list', label: 'Bordered list' },
  { value: 'numbered', label: 'Numbered' },
  { value: 'feature', label: 'Feature' },
];

export function GridEditor({ block, onChange }: { block: GridBlock; onChange: (b: GridBlock) => void }) {
  return (
    <Stack gap={4}>
      <TextField label="Eyebrow (optional)" hint="Small label above the heading" value={block.eyebrow ?? ''} onChange={(v) => onChange({ ...block, eyebrow: v || undefined })} />
      <TextField label="Heading (optional)" value={block.heading ?? ''} onChange={(v) => onChange({ ...block, heading: v || undefined })} />
      <SelectField label="Item style" value={block.style ?? 'auto'} options={styleOptions} onChange={(v) => onChange({ ...block, style: v === 'auto' ? undefined : (v as GridBlock['style']) })} />
      <SelectField
        label="Columns"
        value={String(block.columns ?? 3)}
        options={columnsOptions}
        onChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}
      />
      <ArrayField<GridItem>
        label="Items"
        items={block.items}
        onChange={(items) => onChange({ ...block, items })}
        createItem={() => ({ title: 'New item', body: '' })}
        itemLabel={(item) => item.title || 'Untitled item'}
        maxItems={20}
        addLabel="Add item"
        renderItem={(item, _i, update) => (
          <Stack gap={3}>
            <TextField label="Title" value={item.title} onChange={(title) => update({ ...item, title })} />
            <TextAreaField label="Body" value={item.body ?? ''} rows={3} onChange={(body) => update({ ...item, body: body || undefined })} />
            <ImageField label="Image (optional)" value={item.image ?? ''} onChange={(image) => update({ ...item, image: image || undefined })} alt={item.title} />
          </Stack>
        )}
      />
    </Stack>
  );
}
