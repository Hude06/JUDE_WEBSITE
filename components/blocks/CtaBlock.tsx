import type { CtaBlock as CtaBlockType } from '@/lib/types';
import { secondaryLink } from '@/lib/buttons';
import { cn } from '@/lib/utils';

interface CtaBlockProps {
  block: CtaBlockType;
}

export function CtaBlock({ block }: CtaBlockProps) {
  return (
    <section className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-[var(--space-section-lg)]">
      <div className="max-w-5xl">
        {block.eyebrow && (
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-muted)] mb-8">
            {block.eyebrow}
          </p>
        )}

        <h2
          className="font-display leading-[0.92] tracking-[-0.02em] text-[color:var(--color-fg)]"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
        >
          {block.title}
        </h2>

        {block.description && (
          <p className="mt-8 max-w-xl text-lg md:text-xl text-[color:var(--color-muted)] leading-snug">
            {block.description}
          </p>
        )}

        {(block.primaryCta || block.secondaryCta) && (
          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
            {block.primaryCta && (
              <a
                href={block.primaryCta.href}
                className={cn(secondaryLink, 'text-xl md:text-2xl')}
              >
                {block.primaryCta.text} →
              </a>
            )}
            {block.secondaryCta && (
              <a href={block.secondaryCta.href} className={secondaryLink}>
                {block.secondaryCta.text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
