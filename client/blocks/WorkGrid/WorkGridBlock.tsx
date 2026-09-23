import type { WorkGridBlock as WorkGridBlockType, WorkGridItem } from '@/client/types';
import { cn } from '@/lib/utils';
import { YourSiteCard } from './YourSiteCard';
import styles from './WorkGridBlock.module.css';

interface WorkGridBlockProps {
  block: WorkGridBlockType;
}

/* The first row sits right under the hero, so on most screens it holds the
   biggest thing in view. Lazy-loading it made the browser discover the
   page's main image late (Lighthouse: 1.6s of LCP load delay). */
const EAGER_CARDS = 3;

function Card({ item, index }: { item: WorkGridItem; index: number }) {
  const eager = index < EAGER_CARDS;
  const isArchived = item.status === 'archived';
  const clickable = Boolean(item.link) && !isArchived;

  const body = (
    <>
      <div className={cn('browser-frame', styles.frame)}>
        <div className={styles.imageSurface}>
          <img
            src={item.image}
            alt={`${item.name} — ${item.tagline}`}
            className={styles.image}
            width={1600}
            height={1000}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
            decoding="async"
          />
        </div>
      </div>
      <div className={styles.meta}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.year}>
          {isArchived ? `${item.year} · archived` : item.year}
        </span>
      </div>
      <p className={styles.tagline}>{item.tagline}</p>
    </>
  );

  if (clickable) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.card}
        aria-label={`Visit ${item.name}`}
      >
        {body}
      </a>
    );
  }
  return <div className={styles.card}>{body}</div>;
}

export function WorkGridBlock({ block }: WorkGridBlockProps) {
  return (
    <section className={cn(styles.root, 'scroll-reveal')} id={block.anchorId}>
      {(block.heading || block.countLabel) && (
        <div className={styles.head}>
          {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
          <span aria-hidden className={styles.rule} />
          {block.countLabel && <span className={styles.count}>{block.countLabel}</span>}
        </div>
      )}

      <div className={styles.grid}>
        {block.items.map((item, index) => (
          <Card key={item.name} item={item} index={index} />
        ))}
        {block.showEmptyCard && <YourSiteCard />}
      </div>
    </section>
  );
}
