import Link from 'next/link';
import type { WorkGridBlock as WorkGridBlockType, WorkGridItem } from '@/client/types';
import { cn } from '@/lib/utils';
import styles from './WorkGridBlock.module.css';

interface WorkGridBlockProps {
  block: WorkGridBlockType;
}

function domainFor(item: WorkGridItem): string {
  if (item.domain) return item.domain;
  if (item.link) return item.link.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `${item.name.toLowerCase().replace(/[^a-z]/g, '')}.com`;
}

function Card({ item }: { item: WorkGridItem }) {
  const isArchived = item.status === 'archived';
  const clickable = Boolean(item.link) && !isArchived;

  const body = (
    <>
      <div className={cn('browser-frame', styles.frame)}>
        <div className="browser-frame__bar">
          <span className="browser-frame__dot" />
          <span className="browser-frame__dot" />
          <span className="browser-frame__dot" />
          <span className={styles.domain}>{domainFor(item)}</span>
        </div>
        <div className={styles.imageSurface}>
          <img
            src={item.image}
            alt={`${item.name} — ${item.tagline}`}
            className={styles.image}
            width={1600}
            height={1000}
            loading="lazy"
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
        {block.items.map((item) => (
          <Card key={item.name} item={item} />
        ))}
        {block.showEmptyCard && (
          <Link href="/contact" className={styles.emptyCard}>
            <span>
              <span className={styles.emptyTitle}>Your site here</span>
              <span className={styles.emptyCta}>Start a project →</span>
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
