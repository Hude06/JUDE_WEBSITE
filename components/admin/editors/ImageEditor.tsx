'use client';

import { useRef, useState } from 'react';
import type { ImageBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/admin-api';

interface ImageEditorProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
}

export function ImageEditor({ block, onChange }: ImageEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const path = await uploadImage(file);
      onChange({ ...block, src: path });
    } catch {
      // upload failed — keep current image
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {block.src && (
        <img src={block.src} alt={block.alt} className="w-32 h-32 object-cover rounded" />
      )}
      <div>
        <Label>Alt text</Label>
        <Input
          value={block.alt}
          onChange={(e) => onChange({ ...block, alt: e.target.value })}
        />
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Change Image'}
      </Button>
    </div>
  );
}
