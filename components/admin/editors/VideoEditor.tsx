'use client';

import type { VideoBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VideoEditorProps {
  block: VideoBlock;
  onChange: (block: VideoBlock) => void;
}

export function VideoEditor({ block, onChange }: VideoEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Source URL</Label>
        <Input
          value={block.src}
          onChange={(e) => onChange({ ...block, src: e.target.value })}
          placeholder="YouTube, Vimeo, or direct video URL"
        />
      </div>
      <div>
        <Label>Caption (optional)</Label>
        <Input
          value={block.title ?? ''}
          onChange={(e) => onChange({ ...block, title: e.target.value || undefined })}
        />
      </div>
      <div>
        <Label>Provider</Label>
        <select
          value={block.provider ?? 'youtube'}
          onChange={(e) =>
            onChange({ ...block, provider: e.target.value as VideoBlock['provider'] })
          }
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="file">Direct file</option>
        </select>
      </div>
      <div>
        <Label>Aspect ratio</Label>
        <select
          value={block.aspectRatio ?? '16:9'}
          onChange={(e) =>
            onChange({ ...block, aspectRatio: e.target.value as VideoBlock['aspectRatio'] })
          }
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value="16:9">16:9 (standard)</option>
          <option value="4:3">4:3</option>
          <option value="1:1">1:1 (square)</option>
          <option value="21:9">21:9 (cinematic)</option>
        </select>
      </div>
    </div>
  );
}
