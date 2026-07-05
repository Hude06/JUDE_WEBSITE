/* eslint-disable @next/next/no-img-element */
import { Container } from '../../lib/ui';
import type { QuoteBlock as QuoteBlockType, QuoteStyle } from '../../lib/types';
import type { ThemeStructure } from '../../lib/themes';
import block from './Block.module.css';
import styles from './QuoteBlock.module.css';

function Attribution({ b }: { b: QuoteBlockType }) {
  if (!b.author && !b.image) return null;
  return (
    <figcaption className={styles.attribution}>
      {b.image && <img src={b.image} alt={b.author ?? ''} className={styles.avatar} />}
      {b.author && (
        <span>
          <span className={styles.author}>{b.author}</span>
          {b.role && <span className={styles.role}>· {b.role}</span>}
        </span>
      )}
    </figcaption>
  );
}

export function QuoteBlock({ block: b, dna }: { block: QuoteBlockType; dna?: ThemeStructure }) {
  const style: QuoteStyle = b.style ?? dna?.quoteStyle ?? 'centered';

  // Display — oversized left-aligned pull quote.
  if (style === 'display') {
    return (
      <div className={block.block}>
        <Container width="wide">
          <figure className={styles.figureDisplay}>
            <blockquote className={styles.quoteDisplay}>{b.quote}</blockquote>
            <Attribution b={b} />
          </figure>
        </Container>
      </div>
    );
  }

  // Bordered — left accent rule, left-aligned.
  if (style === 'bordered') {
    return (
      <div className={block.block}>
        <Container width="default">
          <figure className={styles.figureBordered}>
            <blockquote className={styles.quoteBordered}>{b.quote}</blockquote>
            <Attribution b={b} />
          </figure>
        </Container>
      </div>
    );
  }

  // Centered — original layout (unchanged).
  return (
    <div className={block.block}>
      <Container width="default">
        <figure className={styles.figure}>
          <blockquote className={styles.quote}>{b.quote}</blockquote>
          {(b.author || b.image) && (
            <figcaption className={styles.attribution}>
              {b.image && <img src={b.image} alt={b.author ?? ''} className={styles.avatar} />}
              {b.author && (
                <span>
                  <span className={styles.author}>{b.author}</span>
                  {b.role && <span className={styles.role}>· {b.role}</span>}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      </Container>
    </div>
  );
}
