'use client';

import type { StatItem, StatRowBlock } from '@/client/types';
import { ArrayField, TextAreaField, TextField } from '@/lib/ui';

interface StatRowEditorProps {
  block: StatRowBlock;
  onChange: (block: StatRowBlock) => void;
}

export function StatRowEditor({ block, onChange }: StatRowEditorProps) {
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
        label="Stats"
        items={block.stats}
        onChange={(stats) => onChange({ ...block, stats })}
        createItem={(): StatItem => ({ label: 'New stat', value: '—' })}
        itemLabel={(item, index) => item.label || `Stat ${index + 1}`}
        renderItem={(item, _index, update) => (
          <>
            <TextField
              label="Label"
              value={item.label}
              onChange={(label) => update({ ...item, label })}
            />
            <TextField
              label="Value"
              value={item.value}
              onChange={(value) => update({ ...item, value })}
            />
            <TextField
              label="Note (optional)"
              value={item.note ?? ''}
              onChange={(note) => update({ ...item, note: note || undefined })}
            />
          </>
        )}
        addLabel="Add stat"
        minItems={1}
        maxItems={4}
      />

      <TextAreaField
        label="Footnote — where these numbers came from"
        rows={2}
        value={block.note ?? ''}
        onChange={(note) => onChange({ ...block, note: note || undefined })}
      />
    </>
  );
}
