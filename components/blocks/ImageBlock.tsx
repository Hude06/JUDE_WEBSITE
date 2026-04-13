import type { ImageBlock as ImageBlockType } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface ImageBlockProps {
  block: ImageBlockType;
}

export function ImageBlock({ block }: ImageBlockProps) {
  return (
    <Card className="my-6 overflow-hidden">
      <img
        src={block.src}
        alt={block.alt}
        className="w-full h-auto"
      />
    </Card>
  );
}
