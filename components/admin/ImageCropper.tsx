'use client';

import { useRef, useState } from 'react';
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type AspectOption = {
  label: string;
  value: number | undefined;
};

const aspectOptions: AspectOption[] = [
  { label: 'Free', value: undefined },
  { label: '1:1', value: 1 },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
];

interface ImageCropperProps {
  open: boolean;
  file: File | null;
  onCropComplete: (blob: Blob) => void;
  onCancel: () => void;
}

function centerInitialCrop(width: number, height: number, aspect: number | undefined): Crop {
  if (aspect === undefined) {
    return {
      unit: '%',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    };
  }
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 80 },
      aspect,
      width,
      height
    ),
    width,
    height
  );
}

export function ImageCropper({ open, file, onCropComplete, onCancel }: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [processing, setProcessing] = useState(false);

  if (open && file && !imageSrc) {
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerInitialCrop(width, height, aspect));
  }

  function handleAspectChange(newAspect: number | undefined) {
    setAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerInitialCrop(width, height, newAspect));
    }
  }

  function handleCancel() {
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setAspect(undefined);
    onCancel();
  }

  async function handleSave() {
    if (!imgRef.current || !completedCrop || !file) return;

    setProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const quality = mimeType === 'image/jpeg' ? 0.92 : undefined;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
            setImageSrc(null);
            setCrop(undefined);
            setCompletedCrop(null);
          }
          setProcessing(false);
        },
        mimeType,
        quality
      );
    } catch {
      setProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-1">
          {aspectOptions.map((opt) => (
            <Button
              key={opt.label}
              variant={aspect === opt.value ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => handleAspectChange(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        <div className="bg-muted/20 rounded-md overflow-hidden max-h-[60vh] flex items-center justify-center">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              className="max-h-[60vh]"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                onLoad={handleImageLoad}
                className="max-h-[60vh]"
                alt="Crop preview"
              />
            </ReactCrop>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!completedCrop || processing}
          >
            {processing ? 'Processing...' : 'Crop & Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
