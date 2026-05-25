'use client';

import type { StepsBlock } from '@/client/types';
import { ArrayField, TextAreaField, TextField } from '@/lib/ui';

interface StepsEditorProps {
  block: StepsBlock;
  onChange: (block: StepsBlock) => void;
}

export function StepsEditor({ block, onChange }: StepsEditorProps) {
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

      <ArrayField
        label="Steps"
        items={block.steps}
        onChange={(steps) => onChange({ ...block, steps })}
        createItem={() => ({ title: 'New step', description: '' })}
        itemLabel={(item, index) => item.title || `Step ${index + 1}`}
        renderItem={(item, _index, update) => (
          <>
            <TextField label="Title" value={item.title} onChange={(title) => update({ ...item, title })} />
            <TextAreaField
              label="Description"
              rows={3}
              value={item.description}
              onChange={(description) => update({ ...item, description })}
            />
          </>
        )}
        addLabel="Add step"
        minItems={1}
        maxItems={12}
      />
    </>
  );
}
