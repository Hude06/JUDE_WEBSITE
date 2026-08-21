import type { StatRowBlock as StatRowBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import styles from './StatRowBlock.module.css';

interface StatRowBlockProps {
  block: StatRowBlockType;
}

export function StatRowBlock({ block }: StatRowBlockProps) {
  const { eyebrow, heading, stats, note } = block;

  return (
    <section className={cn(styles.root, 'scroll-reveal')}>
      {(eyebrow || heading) && (
        <div className={styles.head}>
          {eyebrow && <p className={cn('mono-label', styles.eyebrow)}>{eyebrow}</p>}
          {heading && <h2 className={styles.heading}>{heading}</h2>}
        </div>
      )}

      <dl className={styles.grid}>
        {stats.map((stat, index) => (
          <div key={`${stat.label}-${index}`} className={styles.stat}>
            <dt className={cn('mono-label', styles.label)}>{stat.label}</dt>
            <dd className={styles.value}>{stat.value}</dd>
            {stat.note && <p className={styles.note}>{stat.note}</p>}
          </div>
        ))}
      </dl>

      {note && <p className={styles.footnote}>{note}</p>}
    </section>
  );
}
