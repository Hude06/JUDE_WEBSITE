'use client';

import type { CaseStudyBlock } from '@/client/types';
import { ImageField, SelectField, TextAreaField, TextField, ToggleField } from '@/lib/ui';

interface CaseStudyEditorProps {
  block: CaseStudyBlock;
  onChange: (block: CaseStudyBlock) => void;
}

export function CaseStudyEditor({ block, onChange }: CaseStudyEditorProps) {
  return (
    <>
      <TextField label="Client" value={block.client} onChange={(client) => onChange({ ...block, client })} />
      <TextAreaField label="Tagline" rows={3} value={block.tagline} onChange={(tagline) => onChange({ ...block, tagline })} />
      <TextField label="Year" value={block.year} onChange={(year) => onChange({ ...block, year })} />
      <TextField label="Role" value={block.role} onChange={(role) => onChange({ ...block, role })} />
      <ImageField label="Screenshot" value={block.image} onChange={(image) => onChange({ ...block, image })} alt={block.client} />
      <TextField
        label="Live URL (optional)"
        value={block.link ?? ''}
        onChange={(link) => onChange({ ...block, link: link || undefined })}
      />
      <SelectField
        label="Status"
        value={block.status ?? 'live'}
        onChange={(status) => onChange({ ...block, status: status as 'live' | 'archived' })}
        options={[
          { value: 'live', label: 'Live' },
          { value: 'archived', label: 'Archived' },
        ]}
      />
      <ToggleField
        label="Reverse layout"
        value={Boolean(block.reverse)}
        onChange={(reverse) => onChange({ ...block, reverse })}
      />
    </>
  );
}
