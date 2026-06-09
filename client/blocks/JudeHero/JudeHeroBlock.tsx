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
 * Pure-CSS page-load entrance. The hero is above the fold, so everything here
 * is a one-time load reveal (not a scroll reveal): copy rises via the shared
 * `[data-reveal]` keyframe, the headline plays a word-by-word masked line-up,
 * and the illustration draws itself in with stroke-dash + bloom keyframes.
 * No JS, no scroll triggers, so nothing can race or lag behind a fast scroll.
 * All of it honors prefers-reduced-motion through CSS.
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

/**
 * Word-by-word masked line-up, resilient to any headline length coming from
 * the JSON content. The final word becomes the italic accent and gets a
 * clean rule that draws in beneath it.
 */
function renderHeadline(headline: string) {
  const words = headline.split(' ').filter(Boolean);

  return words.map((word, i) => {
    const isLast = i === words.length - 1;
    const inner = (
      <span
        className={cn(styles.lineInner, isLast && styles.accentWord)}
        style={{ animationDelay: `${0.3 + i * 0.09}s` }}
      >
        {word}
        {isLast && <span className={styles.accentRule} aria-hidden />}
      </span>
    );

    return (
      <span key={`${i}-${word}`}>
        <span className={styles.lineMask}>{inner}</span>
        {!isLast && ' '}
      </span>
    );
  });
}

/**
 * The hero illustration: a website assembling itself — the browser frame
 * draws in stroke-by-stroke, then the layout blocks settle into place.
 * Every stroke uses pathLength=1 dash drawing.
 */
function SketchArt() {
  return (
    <div className={styles.art} aria-hidden>
      <svg className={styles.sketch} viewBox="0 0 460 360">
        {/* browser frame draws itself */}
        <path
          className={cn(styles.stroke, styles.frame)}
          pathLength="1"
          strokeWidth="2.5"
          d="M84 20 H376 Q390 20 390 34 V306 Q390 320 376 320 H84 Q70 320 70 306 V34 Q70 20 84 20 Z"
        />
        <path
          className={cn(styles.stroke, styles.frameBar)}
          pathLength="1"
          strokeWidth="2"
          d="M70 56 H390"
        />

        {/* traffic-light dots bloom in */}
        <circle className={styles.puff} style={{ animationDelay: '1.15s' }} cx="92" cy="38" r="4.5" fill="var(--rust)" />
        <circle className={styles.puff} style={{ animationDelay: '1.25s' }} cx="109" cy="38" r="4.5" fill="var(--amber)" />
        <circle className={styles.puff} style={{ animationDelay: '1.35s' }} cx="126" cy="38" r="4.5" fill="var(--moss)" />

        {/* headline skeleton sketches in */}
        <path
          className={cn(styles.stroke, styles.contentInk)}
          pathLength="1"
          strokeWidth="14"
          d="M96 100 H246"
        />
        <path
          className={cn(styles.stroke, styles.contentSoft)}
          pathLength="1"
          strokeWidth="9"
          d="M96 130 H196"
        />

        {/* media block settles in */}
        <g className={styles.puff} style={{ animationDelay: '1.8s' }}>
          <rect x="272" y="86" width="94" height="84" rx="10" fill="var(--paper-deep)" />
          <circle cx="344" cy="108" r="9" fill="var(--amber)" />
          <path d="M280 158 L304 126 L322 148 L336 134 L358 158 Z" fill="var(--moss)" />
          <circle cx="296" cy="112" r="7" fill="var(--moss-bright)" />
        </g>

        {/* body copy sketches in */}
        <path className={cn(styles.stroke, styles.bodyLine1)} pathLength="1" strokeWidth="5" d="M96 190 H240" />
        <path className={cn(styles.stroke, styles.bodyLine2)} pathLength="1" strokeWidth="5" d="M96 214 H260" />
        <path className={cn(styles.stroke, styles.bodyLine3)} pathLength="1" strokeWidth="5" d="M96 238 H206" />

        {/* CTA button blooms, cursor settles onto it */}
        <g className={styles.puff} style={{ animationDelay: '2.2s' }}>
          <rect x="96" y="266" width="106" height="32" rx="16" fill="var(--moss-deep)" />
          <path d="M114 282 H164" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className={styles.cursor}>
          <path
            d="M226 280 L240 294 L233 295 L237 304 L232 306 L228 297 L223 302 Z"
            fill="var(--ink)"
            stroke="var(--paper)"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

export function JudeHeroBlock({ block }: JudeHeroBlockProps) {
  const isCentered = block.align === 'center';

  return (
    <section className={cn(styles.root, isCentered && styles.rootCentered)}>
      <div className={cn(styles.inner, isCentered ? styles.innerCentered : styles.innerSplit)}>
        <div className={styles.copy}>
          {block.eyebrow && (
            <HeroReveal delay={0.1} duration={0.7}>
              <p className={styles.eyebrow}>{block.eyebrow}</p>
            </HeroReveal>
          )}

          <h1 className={styles.headline}>{renderHeadline(block.headline)}</h1>

          {block.subheadline && (
            <HeroReveal delay={0.85} duration={0.7}>
              <p className={styles.subheadline}>{block.subheadline}</p>
            </HeroReveal>
          )}

          <HeroReveal delay={1.0} duration={0.7}>
            <dl className={styles.metaList}>
              <MetaRow label="Based in" value="Eugene, Oregon" />
              <MetaRow label="Local time" value={<LiveMasthead />} />
              <MetaRow label="Role" value="Designer & developer" />
            </dl>
          </HeroReveal>

          {(block.primaryCta || block.secondaryCta) && (
            <HeroReveal delay={1.15} duration={0.7}>
              <div className={styles.ctaRow}>
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
        </div>

        {!isCentered && <SketchArt />}
      </div>

      <div className={styles.scrollHint} aria-hidden>
        Scroll
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.metaRow}>
      <dt className={styles.metaLabel}>{label}</dt>
      <dd className={styles.metaValue}>{value}</dd>
    </div>
  );
}
