import type { CSSProperties, ReactNode } from 'react';
import type { JudeHeroBlock as JudeHeroBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import { primaryButton, primaryButtonArrow, secondaryLink } from '@/client/blocks/shared/buttons';
import { SmartLink } from '@/client/blocks/shared/SmartLink';
import { LiveMasthead } from '@/site/components/LiveMasthead';
import styles from './JudeHeroBlock.module.css';

interface JudeHeroBlockProps {
  block: JudeHeroBlockType;
}

/**
 * Pure-CSS page-load entrance. The hero is above the fold, so its stagger is a
 * one-time load reveal (not a scroll reveal) — driven entirely by the
 * `[data-reveal]` keyframe in site/styles.css via the --reveal-delay/--reveal-dur
 * custom properties. No JS, no GSAP, no scroll trigger, so it can never race or
 * lag behind a fast scroll. Honors prefers-reduced-motion through the CSS.
 */
function HeroReveal({
  children,
  delay = 0,
  duration = 0.6,
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={className}
      style={{ '--reveal-delay': `${delay}s`, '--reveal-dur': `${duration}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function renderHeadline(headline: string) {
  const words = headline.split(' ');
  if (words.length < 2) return <span style={{ fontStyle: 'italic' }}>{headline}</span>;
  const last = words[words.length - 1];
  const rest = words.slice(0, -1).join(' ');
  return (
    <>
      {rest}{' '}
      <span className={styles.accentWord}>{last}</span>
    </>
  );
}

export function JudeHeroBlock({ block }: JudeHeroBlockProps) {
  const isCentered = block.align === 'center';

  return (
    <section className={cn('paper-grain', styles.root)}>
      <div className={styles.inner}>
        <div className={isCentered ? styles.topCentered : styles.topSplit}>
          {block.eyebrow && (
            <HeroReveal delay={0} duration={0.6}>
              <p className={styles.eyebrow}>
                <span className={styles.eyebrowLead}>{block.eyebrow.split('—')[0]?.trim() || block.eyebrow}</span>
                {block.eyebrow.includes('—') && (
                  <span className={styles.eyebrowTail}>— {block.eyebrow.split('—').slice(1).join('—').trim()}</span>
                )}
              </p>
            </HeroReveal>
          )}
        </div>

        <HeroReveal delay={0.1} duration={0.7}>
          <h1 className={cn(styles.headline, isCentered && styles.headlineCentered)}>{renderHeadline(block.headline)}</h1>
        </HeroReveal>

        <div className={isCentered ? styles.contentCentered : styles.contentSplit}>
          {block.subheadline && (
            <HeroReveal delay={0.24} duration={0.6}>
              <p className={cn(styles.subheadline, isCentered ? styles.subheadlineCentered : styles.subheadlineSplit)}>
                {block.subheadline}
              </p>
            </HeroReveal>
          )}

          <HeroReveal delay={0.3} duration={0.6} className={isCentered ? styles.metaRevealCentered : styles.metaRevealSplit}>
            <dl className={styles.metaList}>
              <MetaRow label="Based in" value="Eugene, Oregon" centered={isCentered} />
              <MetaRow label="Local time" value={<LiveMasthead />} centered={isCentered} />
              <MetaRow label="Role" value="Designer & developer" centered={isCentered} />
            </dl>
          </HeroReveal>
        </div>

        {(block.primaryCta || block.secondaryCta) && (
          <HeroReveal delay={0.38} duration={0.6}>
            <div className={isCentered ? styles.ctaCentered : styles.ctaSplit}>
              {block.primaryCta && (
                <SmartLink href={block.primaryCta.href} className={primaryButton}>
                  <span>{block.primaryCta.text}</span>
                  <span className={primaryButtonArrow} aria-hidden>→</span>
                </SmartLink>
              )}
              {block.secondaryCta && (
                <SmartLink href={block.secondaryCta.href} className={cn(secondaryLink, styles.secondaryAction)}>
                  <span className="link-underline">{block.secondaryCta.text}</span>
                  <span className={styles.secondaryArrow} aria-hidden>
                    →
                  </span>
                </SmartLink>
              )}
            </div>
          </HeroReveal>
        )}

        <HeroReveal delay={0.6} duration={0.6}>
          <div className={isCentered ? styles.workTagCentered : styles.workTagSplit}>
            <span className={styles.workTagLine} />
            <span>Selected work below</span>
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}

function MetaRow({
  label,
  value,
  centered = false,
}: {
  label: string;
  value: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <div className={centered ? styles.metaRowCentered : styles.metaRowSplit}>
      <dt className={cn(styles.metaLabel, !centered && styles.metaLabelRight)}>{label}</dt>
      <dd className={styles.metaValue}>{value}</dd>
    </div>
  );
}
