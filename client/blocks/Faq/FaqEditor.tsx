'use client';

import type { FaqBlock } from '@/client/types';
import { ArrayField, TextAreaField, TextField } from '@/lib/ui';

interface FaqEditorProps {
  block: FaqBlock;
  onChange: (block: FaqBlock) => void;
}

export function FaqEditor({ block, onChange }: FaqEditorProps) {
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
      <TextField
        label="Anchor ID"
        value={block.anchorId ?? ''}
        onChange={(anchorId) => onChange({ ...block, anchorId: anchorId || undefined })}
      />

      <ArrayField
        label="Questions"
        items={block.items}
        onChange={(items) => onChange({ ...block, items })}
        createItem={() => ({ question: 'New question?', answer: '' })}
        itemLabel={(item, index) => item.question || `Question ${index + 1}`}
        renderItem={(item, _index, update) => (
          <>
            <TextField
              label="Question"
              value={item.question}
              onChange={(question) => update({ ...item, question })}
            />
            <TextAreaField
              label="Answer"
              rows={4}
              value={item.answer}
              onChange={(answer) => update({ ...item, answer })}
            />
          </>
        )}
        addLabel="Add question"
        minItems={1}
        maxItems={20}
      />
    </>
  );
}
