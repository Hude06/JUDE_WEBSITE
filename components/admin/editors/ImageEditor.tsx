'use client';

import { useRef, useState } from 'react';
import type { ImageBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/admin-api';
import { ImageCropper } from '@/components/admin/ImageCropper';

interface ImageEditorProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
}

export function ImageEditor({ block, onChange }: ImageEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    setError(null);
    setPendingFile(file);
    setCropperOpen(true);
  }

  async function handleCropComplete(blob: Blob) {
    if (!pendingFile) return;

    setCropperOpen(false);
    setUploading(true);

    try {
      const croppedFile = new File([blob], pendingFile.name, {
        type: blob.type,
      });
      const path = await uploadImage(croppedFile);
      onChange({ ...block, src: path });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setPendingFile(null);
    }
  }

  function handleCropCancel() {
    setCropperOpen(false);
    setPendingFile(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-lg border-2 border-dashed overflow-hidden
          transition-colors cursor-pointer
          ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}
          ${uploading ? 'opacity-50' : ''}
        `}
        onClick={() => !uploading && fileRef.current?.click()}
      >
        {block.src ? (
          <div className="relative">
            <img
              src={block.src}
              alt={block.alt}
              className="w-full max-h-64 object-contain bg-muted/20"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="text-white text-sm font-medium">
                {uploading ? 'Uploading...' : 'Click or drop to change'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">
              {uploading ? 'Uploading...' : 'Click or drop an image here'}
            </p>
            <p className="text-xs mt-1">PNG, JPG, WebP, GIF up to 5MB</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div>
        <Label>Alt text</Label>
        <Input
          value={block.alt}
          onChange={(e) => onChange({ ...block, alt: e.target.value })}
          placeholder="Describe the image for accessibility"
        />
        {!block.alt && (
          <p className="text-xs text-muted-foreground mt-1">
            Alt text helps screen readers and SEO
          </p>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {block.src && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ ...block, src: '' })}
        >
          Remove image
        </Button>
      )}

      <ImageCropper
        open={cropperOpen}
        file={pendingFile}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    </div>
  );
}
