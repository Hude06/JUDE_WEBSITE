'use client';

import type { BadgeGroupBlock } from '@/client/types';
import { ArrayField, TextField } from '@/lib/ui';

interface BadgeGroupEditorProps {
  block: BadgeGroupBlock;
  onChange: (block: BadgeGroupBlock) => void;
}

export function BadgeGroupEditor({ block, onChange }: BadgeGroupEditorProps) {
  return (
    <ArrayField
      label="Badges"
      items={block.badges}
      onChange={(badges) => onChange({ ...block, badges })}
      createItem={() => ''}
      itemLabel={(_, index) => `Badge ${index + 1}`}
      renderItem={(item, _index, update) => (
        <TextField value={item} onChange={update} placeholder="Badge label" />
      )}
      addLabel="Add badge"
      minItems={0}
      maxItems={10}
    />
  );
}
