import type { HeroBlock as HeroBlockType } from '@/lib/types';
import { Reveal } from '@/lib/motion';
import { primaryButton, primaryButtonArrow, secondaryLink } from '@/lib/buttons';
import { LiveMasthead } from '@/components/LiveMasthead';

interface HeroBlockProps {
  block: HeroBlockType;
}

function renderHeadline(headline: string) {
  const words = headline.split(' ');
  if (words.length < 2) {
    return <span className="italic">{headline}</span>;
  }
  const last = words[words.length - 1];
  const rest = words.slice(0, -1).join(' ');
  return (
    <>
      {rest}{' '}
      <span className="italic text-[color:var(--color-accent-ink)]">{last}</span>
    </>
  );
}

export function HeroBlock({ block }: HeroBlockProps) {
  return (
    <section className="paper-grain relative overflow-hidden">
      <div className="relative mx-auto max-w-[var(--container-wide)] px-6 md:px-10 pt-10 md:pt-16 pb-20 md:pb-28">
        {/* Top meta row — eyebrow left, status right */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-12 mb-14 md:mb-20">
          {block.eyebrow && (
            <Reveal delay={0} duration={0.6}>
              <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[color:var(--color-muted)]">
                <span className="text-[color:var(--color-fg)] font-medium">
                  {block.eyebrow.split('—')[0]?.trim() || block.eyebrow}
                </span>
                {block.eyebrow.includes('—') && (
                  <span className="ml-2 text-[color:var(--color-subtle)]">
                    — {block.eyebrow.split('—').slice(1).join('—').trim()}
                  </span>
                )}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.08} duration={0.55}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/70 backdrop-blur-sm pl-2.5 pr-4 py-1.5">
              <span className="pulse-dot" aria-hidden />
              <span className="text-[0.72rem] uppercase tracking-[0.22em] text-[color:var(--color-fg)] tabular-nums">
                Available · 2026
              </span>
            </div>
          </Reveal>
        </div>

        {/* Main headline */}
        <Reveal delay={0.1} duration={0.7}>
          <h1
            className="font-display leading-[0.88] tracking-[-0.035em] text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(3.75rem, 13vw, 11.5rem)' }}
          >
            {renderHeadline(block.headline)}
          </h1>
        </Reveal>

        {/* Subheadline + meta — two-column asymmetric */}
        <div className="mt-12 md:mt-16 grid gap-10 md:gap-16 md:grid-cols-[1.3fr_1fr] items-end">
          {block.subheadline && (
            <Reveal delay={0.24} duration={0.6}>
              <p className="max-w-xl text-xl md:text-2xl text-[color:var(--color-fg)]/80 leading-[1.35]">
                {block.subheadline}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.3} duration={0.6} className="md:justify-self-end">
            <dl className="space-y-3 text-[0.78rem] uppercase tracking-[0.22em] tabular-nums">
              <MetaRow label="Based in" value="Eugene, Oregon" />
              <MetaRow label="Local time" value={<LiveMasthead />} />
              <MetaRow label="Role" value="Designer & developer" />
            </dl>
          </Reveal>
        </div>

        {/* CTAs */}
        {(block.primaryCta || block.secondaryCta) && (
          <Reveal delay={0.38} duration={0.6}>
            <div className="mt-14 md:mt-20 flex flex-wrap items-center gap-x-8 gap-y-5">
              {block.primaryCta && (
                <a href={block.primaryCta.href} className={primaryButton}>
                  <span>{block.primaryCta.text}</span>
                  <span className={primaryButtonArrow} aria-hidden>→</span>
                </a>
              )}
              {block.secondaryCta && (
                <a href={block.secondaryCta.href} className={secondaryLink}>
                  <span className="link-underline">{block.secondaryCta.text}</span>
                  <span
                    className="inline-block transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
                    aria-hidden
                  >
                    →
                  </span>
                </a>
              )}
            </div>
          </Reveal>
        )}

        {/* Scroll cue */}
        <Reveal delay={0.6} duration={0.6}>
          <div className="mt-20 md:mt-28 flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
            <span className="block h-px w-10 bg-[color:var(--color-hairline-strong)]" />
            <span>Selected work below</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-5 md:justify-end">
      <dt className="text-[color:var(--color-subtle)] min-w-[5.5rem] md:text-right">
        {label}
      </dt>
      <dd className="text-[color:var(--color-fg)]">{value}</dd>
    </div>
  );
}
