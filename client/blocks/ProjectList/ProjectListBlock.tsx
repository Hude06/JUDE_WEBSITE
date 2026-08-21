import type { ProjectListBlock as ProjectListBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import { formatDomain } from '@/client/blocks/shared/domain';
import { SmartLink } from '@/client/blocks/shared/SmartLink';
import styles from './ProjectListBlock.module.css';

interface ProjectListBlockProps {
  block: ProjectListBlockType;
}

/**
 * A ledger of side projects — one hairline row each, whole row clickable.
 * Cards were the wrong container for this: two of them left a page that was
 * mostly padding, and a card promises an image that a CLI tool does not have.
 */
export function ProjectListBlock({ block }: ProjectListBlockProps) {
  const { heading, countLabel, anchorId, items } = block;

  return (
    <section id={anchorId} className={cn(styles.root, 'scroll-reveal')}>
      {/* The heading is optional because the projects page already spends an
          h1 on the word "Projects"; there the block contributes only the rule
          and the count, and repeating the title would be noise. */}
      {(heading || countLabel) && (
        <div className={styles.head}>
          {heading && <h2 className={styles.heading}>{heading}</h2>}
          <span className={styles.rule} aria-hidden />
          {countLabel && (
            <span className={cn('mono-label', styles.count)}>{countLabel}</span>
          )}
        </div>
      )}

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.name} className={styles.item}>
            <Row item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Row({ item }: { item: ProjectListBlockType['items'][number] }) {
  const meta = item.link ? formatDomain(item.link) : item.status;

  const body = (
    <>
      <span className={styles.name}>{item.name}</span>
      <span className={styles.description}>{item.description}</span>
      <span className={cn('mono-label', styles.meta)}>{meta}</span>
      {/* The arrow is the only thing that moves on hover, so an unlinked row
          simply has no arrow rather than a dead one. */}
      <span className={styles.arrow} aria-hidden>
        {item.link ? '→' : ''}
      </span>
    </>
  );

  if (!item.link) {
    return <div className={styles.row}>{body}</div>;
  }

  return (
    <SmartLink href={item.link} className={styles.row}>
      {body}
    </SmartLink>
  );
}
