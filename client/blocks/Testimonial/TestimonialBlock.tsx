import type { TestimonialBlock as TestimonialBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import styles from './TestimonialBlock.module.css';

interface TestimonialBlockProps {
  block: TestimonialBlockType;
}

export function TestimonialBlock({ block }: TestimonialBlockProps) {
  const { quote, name, business, link } = block;

  return (
    <section className={cn(styles.root, 'scroll-reveal')}>
      <figure className={styles.inner}>
        <span aria-hidden className={styles.ghostMark}>
          “
        </span>
        <blockquote className={styles.quote}>{quote}</blockquote>
        <figcaption className={styles.attribution}>
          <span className={styles.name}>{name}</span>
          {business &&
            (link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.business}
              >
                {business}
              </a>
            ) : (
              <span className={styles.business}>{business}</span>
            ))}
        </figcaption>
      </figure>
    </section>
  );
}
