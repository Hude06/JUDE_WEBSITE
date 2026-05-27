import type { JudeHeroBlock as JudeHeroBlockType } from '@/client/types';
import { Reveal } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { primaryButton, primaryButtonArrow, secondaryLink } from '@/client/blocks/shared/buttons';
import { LiveMasthead } from '@/site/components/LiveMasthead';
import styles from './JudeHeroBlock.module.css';

interface JudeHeroBlockProps {
  block: JudeHeroBlockType;
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
            <Reveal delay={0} duration={0.6}>
              <p className={styles.eyebrow}>
                <span className={styles.eyebrowLead}>{block.eyebrow.split('—')[0]?.trim() || block.eyebrow}</span>
                {block.eyebrow.includes('—') && (
                  <span className={styles.eyebrowTail}>— {block.eyebrow.split('—').slice(1).join('—').trim()}</span>
                )}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.08} duration={0.55}>
            <div className={styles.availabilityPill}>
              <span className="pulse-dot" aria-hidden />
              <span className={styles.availabilityLabel}>Available · 2026</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} duration={0.7}>
          <h1 className={cn(styles.headline, isCentered && styles.headlineCentered)}>{renderHeadline(block.headline)}</h1>
        </Reveal>

        <div className={isCentered ? styles.contentCentered : styles.contentSplit}>
          {block.subheadline && (
            <Reveal delay={0.24} duration={0.6}>
              <p className={cn(styles.subheadline, isCentered ? styles.subheadlineCentered : styles.subheadlineSplit)}>
                {block.subheadline}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.3} duration={0.6} className={isCentered ? styles.metaRevealCentered : styles.metaRevealSplit}>
            <dl className={styles.metaList}>
              <MetaRow label="Based in" value="Eugene, Oregon" centered={isCentered} />
              <MetaRow label="Local time" value={<LiveMasthead />} centered={isCentered} />
              <MetaRow label="Role" value="Designer & developer" centered={isCentered} />
            </dl>
          </Reveal>
        </div>

        {(block.primaryCta || block.secondaryCta) && (
          <Reveal delay={0.38} duration={0.6}>
            <div className={isCentered ? styles.ctaCentered : styles.ctaSplit}>
              {block.primaryCta && (
                <a href={block.primaryCta.href} className={primaryButton} style={{ color: 'var(--color-bg)' }}>
                  <span>{block.primaryCta.text}</span>
                  <span className={primaryButtonArrow} aria-hidden>→</span>
                </a>
              )}
              {block.secondaryCta && (
                <a href={block.secondaryCta.href} className={cn(secondaryLink, styles.secondaryAction)}>
                  <span className="link-underline">{block.secondaryCta.text}</span>
                  <span className={styles.secondaryArrow} aria-hidden>
                    →
                  </span>
                </a>
              )}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.6} duration={0.6}>
          <div className={isCentered ? styles.workTagCentered : styles.workTagSplit}>
            <span className={styles.workTagLine} />
            <span>Selected work below</span>
          </div>
        </Reveal>
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
