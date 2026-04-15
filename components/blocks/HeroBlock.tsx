import type { HeroBlock as HeroBlockType } from '@/lib/types';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface HeroBlockProps {
  block: HeroBlockType;
}

export function HeroBlock({ block }: HeroBlockProps) {
  const align = block.align ?? 'left';
  const isCenter = align === 'center';

  return (
    <section className="relative -mx-4 my-12 overflow-hidden md:-mx-8 lg:-mx-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.05),transparent_60%)]" />
      <div
        className={cn(
          'relative grid gap-10 px-4 py-20 md:px-8 md:py-28 lg:px-16 lg:py-32',
          block.image && !isCenter ? 'lg:grid-cols-[1.3fr_1fr] lg:items-end' : 'grid-cols-1',
          isCenter && 'text-center',
        )}
      >
        <div className={cn('space-y-6', isCenter && 'mx-auto max-w-3xl')}>
          {block.eyebrow && (
            <p
              className={cn(
                'inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground',
                isCenter && 'justify-center',
              )}
            >
              <span className="h-px w-8 bg-foreground/40" />
              {block.eyebrow}
            </p>
          )}
          <h1 className="font-heading text-5xl leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-7xl xl:text-8xl">
            {block.headline}
          </h1>
          {block.subheadline && (
            <p
              className={cn(
                'max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl',
                isCenter && 'mx-auto',
              )}
            >
              {block.subheadline}
            </p>
          )}
          {(block.primaryCta || block.secondaryCta) && (
            <div className={cn('flex flex-wrap gap-3 pt-2', isCenter && 'justify-center')}>
              {block.primaryCta && (
                <a
                  href={block.primaryCta.href}
                  className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'group/hcta')}
                >
                  {block.primaryCta.text}
                  <ArrowUpRight className="ml-1 size-4 transition-transform group-hover/hcta:-translate-y-0.5 group-hover/hcta:translate-x-0.5" />
                </a>
              )}
              {block.secondaryCta && (
                <a
                  href={block.secondaryCta.href}
                  className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}
                >
                  {block.secondaryCta.text}
                </a>
              )}
            </div>
          )}
        </div>
        {block.image && !isCenter && (
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent" />
            <img
              src={block.image}
              alt={block.headline}
              className="aspect-[4/5] w-full rounded-xl object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
