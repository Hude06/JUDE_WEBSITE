'use client';

import type { ProjectListItem, ProjectListBlock } from '@/client/types';
import { ArrayField, TextAreaField, TextField } from '@/lib/ui';

interface ProjectListEditorProps {
  block: ProjectListBlock;
  onChange: (block: ProjectListBlock) => void;
}

export function ProjectListEditor({ block, onChange }: ProjectListEditorProps) {
  return (
    <>
      <TextField
        label="Heading"
        value={block.heading ?? ''}
        onChange={(heading) => onChange({ ...block, heading: heading || undefined })}
      />
      <TextField
        label="Count label — e.g. “02 building”"
        value={block.countLabel ?? ''}
        onChange={(countLabel) => onChange({ ...block, countLabel: countLabel || undefined })}
      />
      <TextField
        label="Anchor id (optional)"
        value={block.anchorId ?? ''}
        onChange={(anchorId) => onChange({ ...block, anchorId: anchorId || undefined })}
      />

      <ArrayField
        label="Projects"
        items={block.items}
        onChange={(items) => onChange({ ...block, items })}
        createItem={(): ProjectListItem => ({ name: 'New project', description: '' })}
        itemLabel={(item, index) => item.name || `Project ${index + 1}`}
        renderItem={(item, _index, update) => (
          <>
            <TextField
              label="Name"
              value={item.name}
              onChange={(name) => update({ ...item, name })}
            />
            <TextAreaField
              label="One line — what it is, not why it matters"
              rows={2}
              value={item.description}
              onChange={(description) => update({ ...item, description })}
            />
            <TextField
              label="Link (optional) — makes the whole row clickable"
              value={item.link ?? ''}
              onChange={(link) => update({ ...item, link: link || undefined })}
            />
            <TextField
              label="Status — shown only when there is no link"
              value={item.status ?? ''}
              onChange={(status) => update({ ...item, status: status || undefined })}
            />
          </>
        )}
        addLabel="Add project"
        minItems={1}
      />
    </>
  );
}
