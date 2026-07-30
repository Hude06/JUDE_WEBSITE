import type { PhotoBlock as PhotoBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import styles from './PhotoBlock.module.css';

interface PhotoBlockProps {
  block: PhotoBlockType;
}

export function PhotoBlock({ block }: PhotoBlockProps) {
  const { image, alt, caption } = block;

  return (
    <section className={cn(styles.root, 'scroll-reveal')}>
      <figure className={styles.figure}>
        {image ? (
          <div className={styles.frame}>
            <img
              src={image}
              alt={alt ?? ''}
              className={styles.image}
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div className={cn(styles.frame, styles.placeholder)}>
            <span className={styles.placeholderLabel}>Photo coming soon</span>
          </div>
        )}
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    </section>
  );
}
