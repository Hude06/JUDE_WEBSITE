import type { PricingBlock as PricingBlockType } from '@/lib/types';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PricingBlockProps {
  block: PricingBlockType;
}

export function PricingBlock({ block }: PricingBlockProps) {
  return (
    <section className="my-16">
      {(block.eyebrow || block.heading) && (
        <div className="mb-12 max-w-2xl">
          {block.eyebrow && (
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="font-heading text-4xl leading-tight tracking-tight md:text-5xl">
              {block.heading}
            </h2>
          )}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {block.tiers.map((tier, i) => (
          <div
            key={i}
            className={cn(
              'relative flex flex-col rounded-2xl p-8 transition-transform',
              tier.featured
                ? 'bg-foreground text-background shadow-xl ring-1 ring-foreground lg:-translate-y-2'
                : 'bg-background text-foreground ring-1 ring-border',
            )}
          >
            {tier.featured && (
              <div className="absolute -top-3 left-8 rounded-full bg-background px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground ring-1 ring-border">
                Most popular
              </div>
            )}
            <div className="mb-6">
              <h3 className="font-heading text-2xl">{tier.name}</h3>
              {tier.description && (
                <p
                  className={cn(
                    'mt-2 text-sm leading-relaxed',
                    tier.featured ? 'text-background/70' : 'text-muted-foreground',
                  )}
                >
                  {tier.description}
                </p>
              )}
            </div>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="font-heading text-5xl tracking-tight">{tier.price}</span>
              {tier.period && (
                <span
                  className={cn(
                    'text-sm',
                    tier.featured ? 'text-background/60' : 'text-muted-foreground',
                  )}
                >
                  /{tier.period}
                </span>
              )}
            </div>
            <ul className="mb-8 flex-1 space-y-3">
              {tier.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3 text-sm">
                  <Check
                    className={cn(
                      'mt-0.5 size-4 shrink-0',
                      tier.featured ? 'text-background' : 'text-foreground',
                    )}
                    strokeWidth={2.5}
                  />
                  <span className={tier.featured ? 'text-background/90' : 'text-foreground'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={tier.ctaHref}
              className={cn(
                buttonVariants({
                  variant: tier.featured ? 'secondary' : 'default',
                  size: 'lg',
                }),
                'w-full',
              )}
            >
              {tier.ctaText}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
