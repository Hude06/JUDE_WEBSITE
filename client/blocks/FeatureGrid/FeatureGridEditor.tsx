'use client';

import type { FeatureGridBlock } from '@/client/types';
import { ArrayField, SelectField, TextAreaField, TextField } from '@/lib/ui';

interface FeatureGridEditorProps {
  block: FeatureGridBlock;
  onChange: (block: FeatureGridBlock) => void;
}

export function FeatureGridEditor({ block, onChange }: FeatureGridEditorProps) {
  return (
    <>
      <TextField
        label="Eyebrow"
        value={block.eyebrow ?? ''}
        onChange={(eyebrow) => onChange({ ...block, eyebrow: eyebrow || undefined })}
      />
      <TextField
        label="Heading"
        value={block.heading ?? ''}
        onChange={(heading) => onChange({ ...block, heading: heading || undefined })}
      />
      <SelectField
        label="Columns"
        value={String(block.columns ?? 3)}
        onChange={(value) => onChange({ ...block, columns: Number(value) as 2 | 3 | 4 })}
        options={[
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
        ]}
      />

      <ArrayField
        label="Features"
        items={block.items}
        onChange={(items) => onChange({ ...block, items })}
        createItem={() => ({ icon: 'sparkles', title: 'New feature', description: '' })}
        itemLabel={(item, index) => item.title || `Feature ${index + 1}`}
        renderItem={(item, _index, update) => (
          <>
            <TextField label="Icon name (optional)" value={item.icon ?? ''} onChange={(icon) => update({ ...item, icon: icon || undefined })} />
            <TextField label="Title" value={item.title} onChange={(title) => update({ ...item, title })} />
            <TextAreaField
              label="Description"
              rows={3}
              value={item.description}
              onChange={(description) => update({ ...item, description })}
            />
          </>
        )}
        addLabel="Add feature"
        minItems={1}
        maxItems={12}
      />
    </>
  );
}
