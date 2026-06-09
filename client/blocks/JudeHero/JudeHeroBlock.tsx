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
 * and the sketch draws itself in with stroke-dash + bloom keyframes. No JS, no
 * scroll triggers, so nothing can race or lag behind a fast scroll. All of it
 * honors prefers-reduced-motion through CSS.
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

/** Hand-drawn underline that sketches itself beneath the accent word. */
function Scribble() {
  return (
    <svg
      className={styles.scribble}
      viewBox="0 0 120 14"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M4 10 C 30 4, 62 3, 90 6 C 100 7, 110 8, 116 9"
        pathLength="1"
        fill="none"
        stroke="var(--amber)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Word-by-word masked line-up (the Arborea hero treatment, but resilient to
 * any headline length coming from the JSON content). The final word becomes
 * the italic moss accent and earns the scribble underline.
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
        {isLast && <Scribble />}
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

const LEAF_COLORS = ['var(--moss)', 'var(--moss-bright)', 'var(--amber)', 'var(--rust)', 'var(--moss-deep)'];

/**
 * Ambient drifting leaves. Positions/timings come from a deterministic
 * formula (not Math.random) so the server render matches hydration exactly.
 */
function LeafField() {
  return (
    <div className={styles.leafField} aria-hidden>
      {Array.from({ length: 9 }, (_, i) => {
        const size = 12 + ((i * 7) % 14);
        return (
          <div
            key={i}
            className={styles.leaf}
            style={{
              left: `${4 + ((i * 11.7) % 92)}%`,
              animationDuration: `${11 + ((i * 2.3) % 9)}s`,
              animationDelay: `${-i * 2.7}s`,
            }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              style={{ animationDuration: `${2.4 + (i % 3)}s` }}
            >
              <path
                d="M20 4 C 9 6 4 12 4 21 C 13 21 19 15 20 4 Z"
                fill={LEAF_COLORS[i % LEAF_COLORS.length]}
                opacity="0.75"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

/** Slowly rotating growth rings behind the sketch. */
function Rings() {
  return (
    <svg className={styles.rings} viewBox="0 0 620 620" aria-hidden>
      <circle cx="310" cy="310" r="60" />
      <circle cx="312" cy="308" r="105" />
      <circle cx="308" cy="312" r="150" />
      <circle cx="311" cy="309" r="196" />
      <circle cx="309" cy="311" r="243" />
      <circle cx="310" cy="310" r="290" />
    </svg>
  );
}

/**
 * The hero illustration: a website sketching itself into existence —
 * browser frame draws in, content blocks bloom, and a sprout grows out
 * from behind the corner. Every stroke uses pathLength=1 dash drawing.
 */
function SketchArt() {
  return (
    <div className={styles.art} aria-hidden>
      <svg className={styles.sketch} viewBox="0 0 460 420">
        {/* ground */}
        <ellipse cx="230" cy="400" rx="150" ry="8" fill="rgba(31,42,32,0.07)" />
        <path
          className={styles.ground}
          pathLength="1"
          d="M52 398 C 160 390, 320 390, 412 399"
          strokeWidth="2.5"
        />

        {/* browser frame draws itself */}
        <path
          className={cn(styles.stroke, styles.frame)}
          pathLength="1"
          strokeWidth="3"
          d="M84 60 H376 Q390 60 390 74 V326 Q390 340 376 340 H84 Q70 340 70 326 V74 Q70 60 84 60 Z"
        />
        <path
          className={cn(styles.stroke, styles.frameBar)}
          pathLength="1"
          strokeWidth="2.5"
          d="M70 96 H390"
        />

        {/* traffic-light dots bloom in */}
        <circle className={styles.puff} style={{ animationDelay: '1.15s' }} cx="92" cy="78" r="5" fill="var(--rust)" />
        <circle className={styles.puff} style={{ animationDelay: '1.25s' }} cx="110" cy="78" r="5" fill="var(--amber)" />
        <circle className={styles.puff} style={{ animationDelay: '1.35s' }} cx="128" cy="78" r="5" fill="var(--moss)" />

        {/* headline skeleton sketches in */}
        <path
          className={cn(styles.stroke, styles.contentInk)}
          pathLength="1"
          strokeWidth="14"
          d="M96 134 H246"
        />
        <path
          className={cn(styles.stroke, styles.contentSoft)}
          pathLength="1"
          strokeWidth="9"
          d="M96 164 H196"
        />

        {/* picture block blooms — a little landscape */}
        <g className={styles.puff} style={{ animationDelay: '1.8s' }}>
          <rect x="272" y="120" width="94" height="84" rx="10" fill="var(--paper-deep)" />
          <circle cx="344" cy="142" r="9" fill="var(--amber)" />
          <path d="M280 192 L304 160 L322 182 L336 168 L358 192 Z" fill="var(--moss)" />
          <circle cx="296" cy="146" r="7" fill="var(--moss-bright)" />
        </g>

        {/* body copy sketches in */}
        <path className={cn(styles.stroke, styles.bodyLine1)} pathLength="1" strokeWidth="5" d="M96 224 H240" />
        <path className={cn(styles.stroke, styles.bodyLine2)} pathLength="1" strokeWidth="5" d="M96 248 H260" />
        <path className={cn(styles.stroke, styles.bodyLine3)} pathLength="1" strokeWidth="5" d="M96 272 H206" />

        {/* CTA button blooms, cursor bobs toward it */}
        <g className={styles.puff} style={{ animationDelay: '2.2s' }}>
          <rect x="96" y="296" width="106" height="32" rx="16" fill="var(--moss-deep)" />
          <path d="M114 312 H164" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className={styles.cursor}>
          <path
            d="M226 310 L240 324 L233 325 L237 334 L232 336 L228 327 L223 332 Z"
            fill="var(--bark)"
            stroke="var(--paper)"
            strokeWidth="1.5"
          />
        </g>

        {/* a sprout grows from behind the frame */}
        <path
          className={cn(styles.stroke, styles.sproutStem)}
          pathLength="1"
          strokeWidth="5"
          d="M398 340 C 406 312, 398 290, 410 264"
        />
        <circle className={styles.puff} style={{ animationDelay: '2.75s' }} cx="412" cy="252" r="15" fill="var(--moss)" />
        <circle className={styles.puff} style={{ animationDelay: '2.85s' }} cx="398" cy="244" r="9" fill="var(--moss-bright)" />
        <circle className={styles.puff} style={{ animationDelay: '2.95s' }} cx="424" cy="240" r="8" fill="var(--moss-deep)" />
      </svg>
    </div>
  );
}

export function JudeHeroBlock({ block }: JudeHeroBlockProps) {
  const isCentered = block.align === 'center';

  return (
    <section className={cn(styles.root, isCentered && styles.rootCentered)}>
      {!isCentered && <Rings />}
      <LeafField />

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
