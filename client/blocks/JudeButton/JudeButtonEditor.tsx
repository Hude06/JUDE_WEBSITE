'use client';

import type { JudeButtonBlock } from '@/client/types';
import { SelectField, TextField } from '@/lib/ui';

interface JudeButtonEditorProps {
  block: JudeButtonBlock;
  onChange: (block: JudeButtonBlock) => void;
}

export function JudeButtonEditor({ block, onChange }: JudeButtonEditorProps) {
  return (
    <>
      <TextField label="Text" value={block.text} onChange={(text) => onChange({ ...block, text })} />
      <TextField label="Link" value={block.href} onChange={(href) => onChange({ ...block, href })} />
      <SelectField
        label="Variant"
        value={block.variant ?? 'default'}
        onChange={(variant) => onChange({ ...block, variant: variant as JudeButtonBlock['variant'] })}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
          { value: 'ghost', label: 'Ghost' },
        ]}
      />
    </>
  );
}
