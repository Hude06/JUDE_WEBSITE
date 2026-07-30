'use client';

import type { PhotoStripBlock } from '@/client/types';
import { ArrayField, ImageField, TextAreaField, TextField } from '@/lib/ui';

interface PhotoStripEditorProps {
  block: PhotoStripBlock;
  onChange: (block: PhotoStripBlock) => void;
}

export function PhotoStripEditor({ block, onChange }: PhotoStripEditorProps) {
  return (
    <>
      <TextField
        label="Title (optional)"
        value={block.title ?? ''}
        onChange={(title) => onChange({ ...block, title: title || undefined })}
      />
      <TextAreaField
        label="Text (optional)"
        rows={3}
        value={block.text ?? ''}
        onChange={(text) => onChange({ ...block, text: text || undefined })}
      />
      <ArrayField
        label="Photos (max 3 shown)"
        items={block.photos}
        onChange={(photos) => onChange({ ...block, photos })}
        createItem={() => ({ image: '', alt: '' })}
        itemLabel={(item, index) => item.alt || `Photo ${index + 1}`}
        renderItem={(item, _index, update) => (
          <>
            <ImageField label="Photo" value={item.image} onChange={(image) => update({ ...item, image })} alt={item.alt ?? ''} />
            <TextField label="Alt text" value={item.alt ?? ''} onChange={(alt) => update({ ...item, alt: alt || undefined })} />
          </>
        )}
        addLabel="Add photo"
        minItems={1}
        maxItems={3}
      />
    </>
  );
}
