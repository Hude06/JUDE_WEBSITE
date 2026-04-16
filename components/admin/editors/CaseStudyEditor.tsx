'use client';

import { useRef, useState } from 'react';
import type { CaseStudyBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { uploadImage } from '@/lib/admin-api';

interface CaseStudyEditorProps {
  block: CaseStudyBlock;
  onChange: (block: CaseStudyBlock) => void;
}

export function CaseStudyEditor({ block, onChange }: CaseStudyEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const path = await uploadImage(file);
      onChange({ ...block, image: path });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Client name</Label>
        <Input
          value={block.client}
          onChange={(e) => onChange({ ...block, client: e.target.value })}
          placeholder="Rosales Designs"
        />
      </div>

      <div>
        <Label>Tagline</Label>
        <Input
          value={block.tagline}
          onChange={(e) => onChange({ ...block, tagline: e.target.value })}
          placeholder="One sentence describing the work"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Year</Label>
          <Input
            value={block.year}
            onChange={(e) => onChange({ ...block, year: e.target.value })}
            placeholder="2025"
          />
        </div>
        <div>
          <Label>Role</Label>
          <Input
            value={block.role}
            onChange={(e) => onChange({ ...block, role: e.target.value })}
            placeholder="Design + Build"
          />
        </div>
      </div>

      <div>
        <Label>Screenshot</Label>
        <div
          className={`
            relative border-2 border-dashed overflow-hidden cursor-pointer transition-colors
            ${uploading ? 'opacity-50' : 'border-border hover:border-primary'}
          `}
          onClick={() => !uploading && fileRef.current?.click()}
        >
          {block.image ? (
            <img
              src={block.image}
              alt={block.client}
              className="w-full max-h-64 object-contain bg-muted/20"
            />
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">
                {uploading ? 'Uploading…' : 'Click to upload screenshot'}
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>

      <div>
        <Label>Live URL (optional)</Label>
        <Input
          value={block.link ?? ''}
          onChange={(e) => onChange({ ...block, link: e.target.value })}
          placeholder="https://rosalesdesigns.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Status</Label>
          <Select
            value={block.status ?? 'live'}
            onValueChange={(value) =>
              onChange({ ...block, status: value as 'live' | 'archived' })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Layout</Label>
          <Select
            value={block.reverse ? 'reverse' : 'default'}
            onValueChange={(value) =>
              onChange({ ...block, reverse: value === 'reverse' })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Image left</SelectItem>
              <SelectItem value="reverse">Image right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {block.image && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ ...block, image: '' })}
        >
          Remove image
        </Button>
      )}
    </div>
  );
}
