import Link from 'next/link';
import type { JudeHeroBlock as JudeHeroBlockType, HeroIndexRow } from '@/client/types';
import { cn } from '@/lib/utils';
import { primaryButton, primaryButtonArrow, secondaryLink } from '@/client/blocks/shared/buttons';
import { SmartLink } from '@/client/blocks/shared/SmartLink';
import styles from './JudeHeroBlock.module.css';

interface JudeHeroBlockProps {
  block: JudeHeroBlockType;
}

/** The hero's right column: a rounded index card of recent work. Functional
    proof instead of decoration — every row anchors into the case studies. */
function IndexPanel({ rows }: { rows: HeroIndexRow[] }) {
  return (
    <aside className={styles.panel} aria-label="Recent work index">
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Recent work</span>
      </div>

      <ol className={styles.panelList}>
        {rows.map((row, i) => (
          <li key={row.label}>
            <Link href={row.href} className={styles.panelRow}>
              <span className={styles.panelIndex}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.panelLabel}>{row.label}</span>
              <span className={styles.panelYear}>{row.year}</span>
            </Link>
          </li>
        ))}
      </ol>

      <Link href="/#work" className={styles.panelFooter}>
        <span className="link-underline">View all work</span>
        <span aria-hidden className={styles.panelFooterArrow}>→</span>
      </Link>
    </aside>
  );
}

export function JudeHeroBlock({ block }: JudeHeroBlockProps) {
  const isCentered = block.align === 'center';
  const hasPanel = !isCentered && Boolean(block.index?.length);

  return (
    <section className={cn(styles.root, isCentered && styles.rootCentered)}>
      <div className={cn(styles.inner, hasPanel && styles.innerSplit)}>
        <div className={styles.copy}>
          {block.eyebrow && (
            <p className={styles.eyebrow}>{block.eyebrow}</p>
          )}

          <h1 className={styles.headline}>{block.headline}</h1>

          {block.subheadline && (
            <p className={styles.subheadline}>{block.subheadline}</p>
          )}

          <dl className={styles.metaList}>
            <MetaRow label="Based in" value="Eugene, Oregon" />
            <MetaRow label="Role" value="Designer & developer" />
          </dl>

          {(block.primaryCta || block.secondaryCta) && (
            <div className={styles.ctaRow}>
              {block.primaryCta && (
                <SmartLink href={block.primaryCta.href} className={primaryButton}>
                  <span>{block.primaryCta.text}</span>
                  <span className={primaryButtonArrow} aria-hidden>→</span>
                </SmartLink>
              )}
              {block.secondaryCta && (
                <SmartLink href={block.secondaryCta.href} className={secondaryLink}>
                  <span className="link-underline">{block.secondaryCta.text}</span>
                  <span className={styles.secondaryArrow} aria-hidden>→</span>
                </SmartLink>
              )}
            </div>
          )}
        </div>

        {hasPanel && (
          <div className={styles.panelColumn}>
            <IndexPanel rows={block.index!} />
          </div>
        )}
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
