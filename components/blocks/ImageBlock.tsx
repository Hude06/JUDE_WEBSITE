import type { ImageBlock as ImageBlockType } from '@/lib/types';

interface ImageBlockProps {
  block: ImageBlockType;
}

export function ImageBlock({ block }: ImageBlockProps) {
  return (
    <figure className="my-6">
      <img
        src={block.src}
        alt={block.alt}
        className="w-full h-auto rounded-lg"
      />
    </figure>
  );
}
