import type { JudeHeroBlock as JudeHeroBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import { ghostButton, primaryButton, primaryButtonArrow } from '@/client/blocks/shared/buttons';
import { SmartLink } from '@/client/blocks/shared/SmartLink';
import { HeroLoadReadout } from './LoadMeter';
import styles from './JudeHeroBlock.module.css';

interface JudeHeroBlockProps {
  block: JudeHeroBlockType;
}

export function JudeHeroBlock({ block }: JudeHeroBlockProps) {
  const isCentered = block.align === 'center';
  const hasPhoto = !isCentered && Boolean(block.photo);
  const showFacts = block.showFacts !== false;

  return (
    <section className={cn(styles.root, isCentered && styles.rootCentered)}>
      <div className={cn(styles.inner, hasPhoto && styles.innerSplit)}>
        <div className={styles.copy}>
          {block.eyebrow && (
            <p className={styles.eyebrow}>{block.eyebrow}</p>
          )}

          <h1 className={styles.headline}>
            {block.headline}
            {block.headlineAccent && (
              <>
                {' '}
                <em className={styles.headlineAccent}>{block.headlineAccent}</em>
              </>
            )}
          </h1>

          {block.subheadline && (
            <p className={styles.subheadline}>{block.subheadline}</p>
          )}

          {(block.primaryCta || block.secondaryCta) && (
            <div className={styles.ctaRow}>
              {block.primaryCta && (
                <SmartLink href={block.primaryCta.href} className={primaryButton}>
                  <span>{block.primaryCta.text}</span>
                  <span className={primaryButtonArrow} aria-hidden>→</span>
                </SmartLink>
              )}
              {block.secondaryCta && (
                <SmartLink href={block.secondaryCta.href} className={ghostButton}>
                  <span>{block.secondaryCta.text}</span>
                  <span className="jude-btn__arrow" aria-hidden>→</span>
                </SmartLink>
              )}
            </div>
          )}

          {/* The load readout leads the ledger: it is the only fact on the
              page that the page itself proves while you read it. */}
          {showFacts && (
            <dl className={styles.factRow}>
              <HeroLoadReadout
                className={styles.fact}
                labelClassName={styles.factLabel}
                valueClassName={styles.factValue}
              />
              <FactItem label="Based in" value="Eugene, OR" />
              <FactItem label="Sites from" value="$500" />
              <FactItem label="Replies" value="within a day" />
            </dl>
          )}
        </div>

        {hasPhoto && (
          <div className={styles.photoColumn}>
            <div className={styles.photoWrap}>
              <div className={styles.photoFrame}>
                <img
                  src={block.photo}
                  alt={block.photoAlt ?? ''}
                  className={styles.photo}
                  width={928}
                  height={1400}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              {block.photoCaption && (
                <span className={styles.photoCaption}>{block.photoCaption}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FactItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.fact}>
      <dt className={styles.factLabel}>{label}</dt>
      <dd className={styles.factValue}>{value}</dd>
    </div>
  );
}
