import type { CtaBlock as CtaBlockType } from '@/lib/types';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CtaBlockProps {
  block: CtaBlockType;
}

export function CtaBlock({ block }: CtaBlockProps) {
  const tone = block.tone ?? 'default';

  const toneClasses = {
    default: 'bg-muted text-foreground',
    bold: 'bg-foreground text-background',
    quiet: 'bg-background text-foreground ring-1 ring-border',
  }[tone];

  return (
    <section
      className={cn(
        'relative my-16 overflow-hidden rounded-2xl p-10 md:p-16',
        toneClasses,
      )}
    >
      {tone === 'bold' && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_55%)]" />
      )}
      <div className="relative grid gap-8 md:grid-cols-[1.5fr_auto] md:items-end">
        <div className="space-y-4">
          {block.eyebrow && (
            <p
              className={cn(
                'text-xs uppercase tracking-[0.22em]',
                tone === 'bold' ? 'text-background/60' : 'text-muted-foreground',
              )}
            >
              {block.eyebrow}
            </p>
          )}
          <h2 className="font-heading text-4xl leading-tight tracking-tight md:text-5xl">
            {block.title}
          </h2>
          {block.description && (
            <p
              className={cn(
                'max-w-xl text-base md:text-lg',
                tone === 'bold' ? 'text-background/70' : 'text-muted-foreground',
              )}
            >
              {block.description}
            </p>
          )}
        </div>
        {(block.primaryCta || block.secondaryCta) && (
          <div className="flex flex-wrap gap-3">
            {block.primaryCta && (
              <a
                href={block.primaryCta.href}
                className={cn(
                  buttonVariants({
                    variant: tone === 'bold' ? 'secondary' : 'default',
                    size: 'lg',
                  }),
                  'group/cta',
                )}
              >
                {block.primaryCta.text}
                <ArrowRight className="ml-1 size-4 transition-transform group-hover/cta:translate-x-1" />
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
    </section>
  );
}
