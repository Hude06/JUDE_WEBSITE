'use client';

import type { SectionBlock, LeafBlock } from '@/lib/types';
import { Label } from '@/components/ui/label';

interface SectionEditorProps {
  block: SectionBlock;
  onChange: (block: SectionBlock) => void;
}

const SELECT_CLASS =
  'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm';

export function SectionEditor({ block, onChange }: SectionEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Background</Label>
        <select
          value={block.background ?? 'default'}
          onChange={(e) =>
            onChange({ ...block, background: e.target.value as SectionBlock['background'] })
          }
          className={SELECT_CLASS}
        >
          <option value="default">Default</option>
          <option value="muted">Muted</option>
          <option value="card">Card</option>
          <option value="foreground">Inverted (foreground)</option>
          <option value="accent">Accent</option>
        </select>
      </div>
      <div>
        <Label>Width</Label>
        <select
          value={block.width ?? 'standard'}
          onChange={(e) =>
            onChange({ ...block, width: e.target.value as SectionBlock['width'] })
          }
          className={SELECT_CLASS}
        >
          <option value="narrow">Narrow</option>
          <option value="standard">Standard</option>
          <option value="wide">Wide</option>
          <option value="full">Full bleed</option>
        </select>
      </div>
      <div>
        <Label>Padding</Label>
        <select
          value={block.padding ?? 'md'}
          onChange={(e) =>
            onChange({ ...block, padding: e.target.value as SectionBlock['padding'] })
          }
          className={SELECT_CLASS}
        >
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra large</option>
        </select>
      </div>
      <p className="text-xs text-muted-foreground">
        This section wraps {block.blocks.length} block{block.blocks.length === 1 ? '' : 's'}.
        Edit child blocks via JSON or by adding a SectionEditor tree in a future release.
      </p>
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground">View child block JSON</summary>
        <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted p-2 text-xs">
          {JSON.stringify(block.blocks, null, 2)}
        </pre>
      </details>
      <BlockJsonEditor
        value={block.blocks}
        onChange={(blocks) => onChange({ ...block, blocks })}
      />
    </div>
  );
}

interface BlockJsonEditorProps {
  value: LeafBlock[];
  onChange: (blocks: LeafBlock[]) => void;
}

function BlockJsonEditor({ value, onChange }: BlockJsonEditorProps) {
  return (
    <div>
      <Label>Child blocks (JSON)</Label>
      <textarea
        value={JSON.stringify(value, null, 2)}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            if (Array.isArray(parsed)) onChange(parsed as LeafBlock[]);
          } catch {
            // ignore parse errors while typing
          }
        }}
        rows={8}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
      />
    </div>
  );
}
