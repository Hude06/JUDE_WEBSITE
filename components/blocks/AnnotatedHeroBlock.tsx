'use client';

import type {
  Annotation,
  AnnotatedHeroBlock as AnnotatedHeroBlockType,
  AnnotatedHeroImageAspect,
  AnnotationVariant,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reveal } from '@/lib/motion';
import { buttonVariants } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface AnnotatedHeroBlockProps {
  block: AnnotatedHeroBlockType;
}

const ASPECT_CLASS: Record<AnnotatedHeroImageAspect, string> = {
  landscape: 'aspect-[16/10]',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
};

function hashRotate(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 9) - 4;
}

function splitLines(text: string): string[] {
  return text.split('\n');
}

export function AnnotatedHeroBlock({ block }: AnnotatedHeroBlockProps) {
  const {
    eyebrow,
    headline,
    subheadline,
    caption,
    primaryCta,
    secondaryCta,
    image,
    imageAlt = '',
    imagePosition = 'left',
    imageAspect = 'landscape',
    annotations = [],
    align = 'left',
  } = block;

  const isCenter = align === 'center';
  const aspectClass = ASPECT_CLASS[imageAspect];
  const hasArrows = annotations.some((a) => a.arrow);

  const imageColumn = (
    <div className="relative">
      <Reveal direction="up" duration={0.9} distance={32}>
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,oklch(0.7_0.14_55/0.18),transparent_65%)] blur-3xl"
          />

          <div
            data-slot="annotated-hero-image"
            className={cn('relative w-full overflow-visible', aspectClass)}
          >
            <div
              className={cn(
                'absolute inset-0 overflow-hidden rounded-[2rem] bg-muted',
                'shadow-[0_50px_120px_-40px_rgb(0_0_0_/_0.28)]',
              )}
            >
              <img
                src={image}
                alt={imageAlt}
                className="h-full w-full object-cover"
              />
            </div>

            <div
              data-slot="annotation-layer"
              className="pointer-events-none absolute inset-0 hidden md:block"
            >
              {hasArrows && <ArrowOverlay annotations={annotations} />}
              {annotations.map((ann) => (
                <AnnotationAnchor key={ann.id} annotation={ann} />
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {annotations.length > 0 && (
        <ul
          data-slot="annotation-mobile"
          className="mt-8 grid grid-cols-2 gap-2 md:hidden"
        >
          {annotations.map((ann) => (
            <li
              key={ann.id}
              className="flex items-start gap-2 rounded-xl bg-background p-3 text-[13px] leading-snug text-foreground ring-1 ring-foreground/8 shadow-sm"
            >
              {ann.emoji && (
                <span className="shrink-0" aria-hidden>
                  {ann.emoji}
                </span>
              )}
              <span>{ann.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const textColumn = (
    <Reveal direction="up" duration={0.9} delay={0.12} distance={32}>
      <div
        className={cn(
          'flex h-full flex-col justify-center gap-8',
          isCenter && 'items-center text-center',
        )}
      >
        {eyebrow && (
          <p className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
            <span aria-hidden className="h-px w-10 bg-muted-foreground/50" />
            {eyebrow}
          </p>
        )}

        <h1 className="font-heading text-5xl leading-[0.92] tracking-[-0.02em] text-foreground md:text-6xl lg:text-[5.5rem]">
          {splitLines(headline).map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>

        {subheadline && (
          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {subheadline}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div
            className={cn(
              'flex flex-wrap items-center gap-3 pt-2',
              isCenter && 'justify-center',
            )}
          >
            {primaryCta && (
              <a
                href={primaryCta.href}
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'group/ah-primary h-12 gap-2 rounded-full px-6 text-sm',
                )}
              >
                {primaryCta.text}
                <ArrowUpRight className="size-4 transition-transform group-hover/ah-primary:-translate-y-0.5 group-hover/ah-primary:translate-x-0.5" />
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'lg' }),
                  'h-12 rounded-full px-5',
                )}
              >
                {secondaryCta.text}
              </a>
            )}
          </div>
        )}

        {caption && (
          <p className="text-xs text-muted-foreground">{caption}</p>
        )}
      </div>
    </Reveal>
  );

  return (
    <section
      data-slot="annotated-hero"
      data-image-position={imagePosition}
      className="my-20 md:my-28 lg:my-36"
    >
      <div
        className={cn(
          'grid items-center gap-16 md:gap-20 lg:gap-28',
          imagePosition === 'left'
            ? 'md:grid-cols-[1.35fr_1fr]'
            : 'md:grid-cols-[1fr_1.35fr]',
        )}
      >
        {imagePosition === 'left' ? imageColumn : textColumn}
        {imagePosition === 'left' ? textColumn : imageColumn}
      </div>
    </section>
  );
}

function AnnotationAnchor({ annotation }: { annotation: Annotation }) {
  const rotate = annotation.rotate ?? hashRotate(annotation.id);
  const delay = annotation.delay ?? 0;

  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
    >
      <Reveal direction="up" delay={delay} duration={0.55} distance={14}>
        <div
          className="pointer-events-auto origin-center"
          style={{
            transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          }}
        >
          <AnnotationChip annotation={annotation} />
        </div>
      </Reveal>
    </div>
  );
}

function AnnotationChip({ annotation }: { annotation: Annotation }) {
  const variant: AnnotationVariant = annotation.variant ?? 'note';

  switch (variant) {
    case 'chip':
      return <ChipTag annotation={annotation} />;
    case 'callout':
      return <CalloutPill annotation={annotation} />;
    case 'popover':
      return <PopoverMenu annotation={annotation} />;
    case 'tag':
      return <TagLabel annotation={annotation} />;
    case 'note':
    default:
      return <NoteCard annotation={annotation} />;
  }
}

function NoteCard({ annotation }: { annotation: Annotation }) {
  return (
    <div
      data-variant="note"
      className={cn(
        'max-w-[240px] rounded-2xl bg-background px-4 py-2.5 text-[13px] leading-snug text-foreground',
        'ring-1 ring-foreground/8 shadow-[0_18px_44px_-14px_rgb(0_0_0_/_0.22)]',
      )}
    >
      {annotation.emoji && (
        <span className="mr-1.5" aria-hidden>
          {annotation.emoji}
        </span>
      )}
      <span>{annotation.text}</span>
    </div>
  );
}

function ChipTag({ annotation }: { annotation: Annotation }) {
  return (
    <div
      data-variant="chip"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-[12px] font-medium text-foreground',
        'ring-1 ring-foreground/8 shadow-[0_12px_28px_-8px_rgb(0_0_0_/_0.2)]',
      )}
    >
      {annotation.emoji && <span aria-hidden>{annotation.emoji}</span>}
      <span>{annotation.text}</span>
    </div>
  );
}

function CalloutPill({ annotation }: { annotation: Annotation }) {
  return (
    <div
      data-variant="callout"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background',
        'shadow-[0_18px_40px_-10px_rgb(0_0_0_/_0.35)]',
      )}
    >
      {annotation.emoji && <span aria-hidden>{annotation.emoji}</span>}
      <span>{annotation.text}</span>
    </div>
  );
}

function PopoverMenu({ annotation }: { annotation: Annotation }) {
  return (
    <div
      data-variant="popover"
      className={cn(
        'min-w-[170px] rounded-xl bg-background/95 p-1 backdrop-blur-md',
        'ring-1 ring-foreground/10 shadow-[0_30px_60px_-16px_rgb(0_0_0_/_0.28)]',
      )}
    >
      <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-muted-foreground">
        <span aria-hidden className="size-1.5 rounded-full bg-muted-foreground/30" />
        Settings
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background">
        <span aria-hidden className="size-1.5 rounded-full bg-background" />
        {annotation.text}
      </div>
      <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-muted-foreground">
        <span aria-hidden className="size-1.5 rounded-full bg-muted-foreground/30" />
        About
      </div>
    </div>
  );
}

function TagLabel({ annotation }: { annotation: Annotation }) {
  return (
    <div
      data-variant="tag"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground',
        'ring-1 ring-foreground/10 shadow-[0_8px_20px_-6px_rgb(0_0_0_/_0.15)] backdrop-blur-sm',
      )}
    >
      <span aria-hidden className="size-1 rounded-full bg-foreground" />
      <span>{annotation.text}</span>
    </div>
  );
}

function ArrowOverlay({ annotations }: { annotations: Annotation[] }) {
  const withArrows = annotations.filter((a) => a.arrow);
  if (withArrows.length === 0) return null;

  return (
    <svg
      data-slot="annotation-arrows"
      className="pointer-events-none absolute inset-0 h-full w-full text-foreground/30"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {withArrows.map((ann) => {
        const arrow = ann.arrow;
        if (!arrow) return null;
        const x1 = ann.x;
        const y1 = ann.y;
        const x2 = arrow.targetX;
        const y2 = arrow.targetY;
        const curvature = arrow.curvature ?? 30;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - curvature / 10;
        const d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
        return (
          <path
            key={ann.id}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}
