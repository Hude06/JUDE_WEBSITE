import type { VideoBlock as VideoBlockType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VideoBlockProps {
  block: VideoBlockType;
}

function detectProvider(src: string): 'youtube' | 'vimeo' | 'file' {
  if (/youtu\.?be/.test(src)) return 'youtube';
  if (/vimeo/.test(src)) return 'vimeo';
  return 'file';
}

function extractYouTubeId(src: string): string | null {
  const match = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

function extractVimeoId(src: string): string | null {
  const match = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export function VideoBlock({ block }: VideoBlockProps) {
  const provider = block.provider ?? detectProvider(block.src);
  const aspect = block.aspectRatio ?? '16:9';
  const aspectClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
  }[aspect];

  let embed: React.ReactNode = (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
      Video source not recognized
    </div>
  );

  if (provider === 'youtube') {
    const id = extractYouTubeId(block.src);
    if (id) {
      embed = (
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={block.title ?? 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      );
    }
  } else if (provider === 'vimeo') {
    const id = extractVimeoId(block.src);
    if (id) {
      embed = (
        <iframe
          src={`https://player.vimeo.com/video/${id}`}
          title={block.title ?? 'Video'}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      );
    }
  } else if (provider === 'file' && block.src) {
    embed = (
      <video src={block.src} controls className="h-full w-full object-cover">
        Your browser does not support video playback.
      </video>
    );
  }

  return (
    <figure className="my-12">
      <div
        className={cn(
          'relative overflow-hidden rounded-xl bg-muted ring-1 ring-border',
          aspectClass,
        )}
      >
        {embed}
      </div>
      {block.title && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {block.title}
        </figcaption>
      )}
    </figure>
  );
}
