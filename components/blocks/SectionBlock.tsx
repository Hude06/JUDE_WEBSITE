import type { SectionBlock as SectionBlockType } from '@/lib/types';
import { BlockRenderer } from '@/components/BlockRenderer';
import { cn } from '@/lib/utils';

interface SectionBlockProps {
  block: SectionBlockType;
}

const backgroundClasses: Record<NonNullable<SectionBlockType['background']>, string> = {
  default: 'bg-background text-foreground',
  muted: 'bg-muted text-foreground',
  foreground: 'bg-foreground text-background',
  accent: 'bg-accent text-accent-foreground',
  card: 'bg-card text-card-foreground',
};

const widthClasses: Record<NonNullable<SectionBlockType['width']>, string> = {
  narrow: 'max-w-2xl',
  standard: 'max-w-5xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
};

const paddingClasses: Record<NonNullable<SectionBlockType['padding']>, string> = {
  none: 'py-0',
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
  xl: 'py-32 md:py-40',
};

const outerFullBleed = 'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen';

export function SectionBlock({ block }: SectionBlockProps) {
  const background = block.background ?? 'default';
  const width = block.width ?? 'standard';
  const padding = block.padding ?? 'md';

  const isFullBleed = background !== 'default' || width === 'full';
  const innerMaxWidth = width === 'full' ? 'max-w-7xl' : widthClasses[width];

  return (
    <section
      data-section-bg={background}
      data-section-width={width}
      className={cn(
        isFullBleed && outerFullBleed,
        backgroundClasses[background],
        paddingClasses[padding],
      )}
    >
      <div className={cn('mx-auto px-4 md:px-8', innerMaxWidth)}>
        <BlockRenderer blocks={block.blocks} />
      </div>
    </section>
  );
}
