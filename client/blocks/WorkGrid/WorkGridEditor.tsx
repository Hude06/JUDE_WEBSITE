'use client';

import type { WorkGridBlock, WorkGridItem } from '@/client/types';
import { ArrayField, ImageField, SelectField, TextAreaField, TextField, ToggleField } from '@/lib/ui';

interface WorkGridEditorProps {
  block: WorkGridBlock;
  onChange: (block: WorkGridBlock) => void;
}

export function WorkGridEditor({ block, onChange }: WorkGridEditorProps) {
  return (
    <>
      <TextField
        label="Heading"
        value={block.heading ?? ''}
        onChange={(heading) => onChange({ ...block, heading: heading || undefined })}
      />
      <TextField
        label="Counter label (e.g. 03 shipped)"
        value={block.countLabel ?? ''}
        onChange={(countLabel) => onChange({ ...block, countLabel: countLabel || undefined })}
      />
      <TextField
        label="Anchor ID (optional)"
        value={block.anchorId ?? ''}
        onChange={(anchorId) => onChange({ ...block, anchorId: anchorId || undefined })}
      />
      <ArrayField
        label="Projects"
        items={block.items}
        onChange={(items) => onChange({ ...block, items })}
        createItem={(): WorkGridItem => ({ name: 'New project', tagline: '', year: '2026', image: '' })}
        itemLabel={(item, index) => item.name || `Project ${index + 1}`}
        renderItem={(item, _index, update) => (
          <>
            <TextField label="Name" value={item.name} onChange={(name) => update({ ...item, name })} />
            <TextAreaField
              label="One-line tagline"
              rows={2}
              value={item.tagline}
              onChange={(tagline) => update({ ...item, tagline })}
            />
            <TextField label="Year" value={item.year} onChange={(year) => update({ ...item, year })} />
            <ImageField label="Screenshot" value={item.image} onChange={(image) => update({ ...item, image })} alt={item.name} />
            <TextField
              label="Live URL (optional)"
              value={item.link ?? ''}
              onChange={(link) => update({ ...item, link: link || undefined })}
            />
            <TextField
              label="Domain label (optional)"
              value={item.domain ?? ''}
              onChange={(domain) => update({ ...item, domain: domain || undefined })}
            />
            <SelectField
              label="Status"
              value={item.status ?? 'live'}
              onChange={(status) => update({ ...item, status: status as 'live' | 'archived' })}
              options={[
                { value: 'live', label: 'Live' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </>
        )}
        addLabel="Add project"
        minItems={1}
        maxItems={12}
      />
      <ToggleField
        label='Show dashed "Your site here" card'
        value={Boolean(block.showEmptyCard)}
        onChange={(showEmptyCard) => onChange({ ...block, showEmptyCard })}
      />
    </>
  );
}
