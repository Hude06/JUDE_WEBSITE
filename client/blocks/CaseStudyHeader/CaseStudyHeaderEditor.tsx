'use client';

import type { CaseStudyHeaderBlock } from '@/client/types';
import { TextAreaField, TextField } from '@/lib/ui';

interface CaseStudyHeaderEditorProps {
  block: CaseStudyHeaderBlock;
  onChange: (block: CaseStudyHeaderBlock) => void;
}

export function CaseStudyHeaderEditor({ block, onChange }: CaseStudyHeaderEditorProps) {
  return (
    <>
      <TextField
        label="Eyebrow"
        value={block.eyebrow ?? ''}
        onChange={(eyebrow) => onChange({ ...block, eyebrow: eyebrow || undefined })}
      />
      <TextField
        label="Client"
        value={block.client}
        onChange={(client) => onChange({ ...block, client })}
      />
      <TextAreaField
        label="Tagline"
        rows={2}
        value={block.tagline ?? ''}
        onChange={(tagline) => onChange({ ...block, tagline: tagline || undefined })}
      />
      <TextField
        label="Role"
        value={block.role ?? ''}
        onChange={(role) => onChange({ ...block, role: role || undefined })}
      />
      <TextField
        label="Year"
        value={block.year ?? ''}
        onChange={(year) => onChange({ ...block, year: year || undefined })}
      />
      <TextField
        label="Services (comma separated)"
        value={(block.services ?? []).join(', ')}
        onChange={(raw) => {
          const services = raw
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean);
          onChange({ ...block, services: services.length > 0 ? services : undefined });
        }}
      />
      <TextField
        label="Live site URL"
        value={block.link ?? ''}
        onChange={(link) => onChange({ ...block, link: link || undefined })}
      />
      <TextField
        label="Back link href"
        value={block.backHref ?? ''}
        onChange={(backHref) => onChange({ ...block, backHref: backHref || undefined })}
      />
      <TextField
        label="Back link label"
        value={block.backLabel ?? ''}
        onChange={(backLabel) => onChange({ ...block, backLabel: backLabel || undefined })}
      />
    </>
  );
}
