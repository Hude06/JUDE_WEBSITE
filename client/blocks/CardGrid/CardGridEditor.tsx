'use client';

import type { CardGridBlock } from '@/client/types';
import { ArrayField, ImageField, TextAreaField, TextField } from '@/lib/ui';

interface CardGridEditorProps {
  block: CardGridBlock;
  onChange: (block: CardGridBlock) => void;
}

export function CardGridEditor({ block, onChange }: CardGridEditorProps) {
  return (
    <ArrayField
      label="Cards"
      items={block.cards}
      onChange={(cards) => onChange({ ...block, cards })}
      createItem={() => ({ title: 'New card', description: '', link: '' })}
      itemLabel={(item, index) => item.title || `Card ${index + 1}`}
      renderItem={(item, _index, update) => (
        <>
          <TextField label="Title" value={item.title} onChange={(title) => update({ ...item, title })} />
          <TextAreaField
            label="Description"
            rows={3}
            value={item.description}
            onChange={(description) => update({ ...item, description })}
          />
          <TextField label="Link (optional)" value={item.link ?? ''} onChange={(link) => update({ ...item, link: link || undefined })} />
          <ImageField label="Image (optional)" value={item.image ?? ''} onChange={(image) => update({ ...item, image: image || undefined })} />
        </>
      )}
      addLabel="Add card"
      minItems={1}
      maxItems={12}
    />
  );
}
