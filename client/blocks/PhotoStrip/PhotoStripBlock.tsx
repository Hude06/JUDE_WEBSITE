import type { PhotoStripBlock as PhotoStripBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import styles from './PhotoStripBlock.module.css';

interface PhotoStripBlockProps {
  block: PhotoStripBlockType;
}

const TILTS = [styles.tiltLeft, styles.tiltRight, styles.tiltLeft];

export function PhotoStripBlock({ block }: PhotoStripBlockProps) {
  const hasText = Boolean(block.title || block.text);

  return (
    <section className={cn(styles.root, 'scroll-reveal')}>
      <div className={cn(styles.strip, hasText && styles.stripWithText)}>
        {block.photos.slice(0, 3).map((photo, i) =>
          photo.image ? (
            <img
              key={i}
              src={photo.image}
              alt={photo.alt ?? ''}
              className={cn(styles.photo, TILTS[i % TILTS.length])}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
            />
          ) : (
            /* Same empty state as PhotoBlock, so a page can be laid out
               before its screenshots exist. */
            <div
              key={i}
              className={cn(styles.photo, styles.placeholder, TILTS[i % TILTS.length])}
            >
              <span className={styles.placeholderLabel}>Photo coming soon</span>
            </div>
          )
        )}
        {hasText && (
          <div className={styles.copy}>
            {block.title && <h3 className={styles.title}>{block.title}</h3>}
            {block.text && <p className={styles.text}>{block.text}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
