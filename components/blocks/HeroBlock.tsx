import type { HeroBlock as HeroBlockType } from '@/lib/types';
import { Reveal } from '@/lib/motion';
import { primaryButton, secondaryLink } from '@/lib/buttons';

interface HeroBlockProps {
  block: HeroBlockType;
}

export function HeroBlock({ block }: HeroBlockProps) {
  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{
        backgroundImage: 'url(/noise.svg)',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
      }}
    >
      {/* Wash slightly de-saturating the noise so it feels like paper grain */}
      <div
        aria-hidden
        className="absolute inset-0 bg-white/[0.88] pointer-events-none"
      />

      <div className="relative mx-auto max-w-[var(--container-wide)] px-6 md:px-10 pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-12 mb-10 md:mb-14">
          {block.eyebrow && (
            <Reveal delay={0} duration={0.6}>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-muted)]">
                {block.eyebrow}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.04} duration={0.5}>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-muted)] tabular-nums md:text-right">
              Eugene, Oregon · 2026 · Available
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} duration={0.7}>
          <h1
            className="font-display leading-[0.92] tracking-[-0.03em] text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}
          >
            {block.headline}
          </h1>
        </Reveal>

        {block.subheadline && (
          <Reveal delay={0.22} duration={0.6}>
            <p className="mt-12 max-w-2xl text-xl md:text-2xl lg:text-3xl text-[color:var(--color-muted)] leading-[1.3]">
              {block.subheadline}
            </p>
          </Reveal>
        )}

        {(block.primaryCta || block.secondaryCta) && (
          <Reveal delay={0.34} duration={0.6}>
            <div className="mt-16 md:mt-20 flex flex-wrap items-center gap-x-10 gap-y-6">
              {block.primaryCta && (
                <a href={block.primaryCta.href} className={primaryButton}>
                  {block.primaryCta.text}
                </a>
              )}
              {block.secondaryCta && (
                <a href={block.secondaryCta.href} className={secondaryLink}>
                  {block.secondaryCta.text} →
                </a>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
