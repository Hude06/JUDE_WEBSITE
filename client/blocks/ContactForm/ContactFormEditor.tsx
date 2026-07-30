'use client';

import type { ContactFormBlock } from '@/client/types';
import { ArrayField, TextAreaField, TextField } from '@/lib/ui';

interface ContactFormEditorProps {
  block: ContactFormBlock;
  onChange: (block: ContactFormBlock) => void;
}

export function ContactFormEditor({ block, onChange }: ContactFormEditorProps) {
  return (
    <>
      <TextField
        label="Form endpoint (FormSubmit/Formspree URL)"
        value={block.action}
        onChange={(action) => onChange({ ...block, action })}
      />
      <TextField
        label="Eyebrow (optional)"
        value={block.eyebrow ?? ''}
        onChange={(eyebrow) => onChange({ ...block, eyebrow: eyebrow || undefined })}
      />
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ''}
        onChange={(heading) => onChange({ ...block, heading: heading || undefined })}
      />
      <TextAreaField
        label="Intro (optional)"
        rows={2}
        value={block.intro ?? ''}
        onChange={(intro) => onChange({ ...block, intro: intro || undefined })}
      />
      <ArrayField
        label="Facts (label + value ledger)"
        items={block.facts ?? []}
        onChange={(facts) => onChange({ ...block, facts: facts.length ? facts : undefined })}
        createItem={() => ({ label: 'Label', value: '' })}
        itemLabel={(fact, index) => fact.label || `Fact ${index + 1}`}
        renderItem={(fact, _index, update) => (
          <>
            <TextField
              value={fact.label}
              onChange={(label) => update({ ...fact, label })}
              placeholder="Label (e.g. Based in)"
            />
            <TextField
              value={fact.value}
              onChange={(value) => update({ ...fact, value })}
              placeholder="Value (e.g. Eugene, OR)"
            />
          </>
        )}
        addLabel="Add fact"
        minItems={0}
        maxItems={6}
      />
      <TextField
        label="Timeline question label"
        value={block.timelineLabel ?? ''}
        onChange={(timelineLabel) => onChange({ ...block, timelineLabel: timelineLabel || undefined })}
        placeholder="When would you like your new site built?"
      />
      <TextField
        label="Timeline options (comma-separated)"
        value={(block.timelineOptions ?? []).join(', ')}
        onChange={(raw) => {
          const timelineOptions = raw
            .split(',')
            .map((option) => option.trim())
            .filter(Boolean);
          onChange({ ...block, timelineOptions: timelineOptions.length ? timelineOptions : undefined });
        }}
        placeholder="Today, Tomorrow, Next week"
      />
      <TextField
        label="Email subject line"
        value={block.subject ?? ''}
        onChange={(subject) => onChange({ ...block, subject: subject || undefined })}
      />
      <TextAreaField
        label="Message placeholder"
        rows={2}
        value={block.placeholder ?? ''}
        onChange={(placeholder) => onChange({ ...block, placeholder: placeholder || undefined })}
      />
      <TextField
        label="Submit button text"
        value={block.submitLabel ?? ''}
        onChange={(submitLabel) => onChange({ ...block, submitLabel: submitLabel || undefined })}
      />
      <TextField
        label="Note next to the button"
        value={block.note ?? ''}
        onChange={(note) => onChange({ ...block, note: note || undefined })}
      />
    </>
  );
}
