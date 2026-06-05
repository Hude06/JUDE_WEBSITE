import type { CardGridBlock as CardGridBlockType } from '@/client/types';
import { SmartLink } from '@/client/blocks/shared/SmartLink';
import styles from './CardGridBlock.module.css';

interface CardGridBlockProps {
  block: CardGridBlockType;
}

export function CardGridBlock({ block }: CardGridBlockProps) {
  const hasImages = block.cards.some((c) => c.image);

  if (!hasImages) {
    return (
      <section className={`${styles.root} ${styles.listRoot}`}>
        <ul className={styles.list}>
          {block.cards.map((card, i) => {
            const isExternal = card.link?.startsWith('http');
            const content = (
              <div className={styles.row}>
                <div className={styles.lead}>
                  <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.copy}>
                    <h3 className={styles.title}>
                      {card.title}
                    </h3>
                    <p className={styles.description}>{card.description}</p>
                  </div>
                </div>
                <span className={styles.arrow} aria-hidden>
                  {isExternal ? '↗' : '→'}
                </span>
              </div>
            );

            return (
              <li key={card.title} className={styles.item}>
                {card.link ? (
                  <SmartLink href={card.link} className={styles.itemLink}>
                    {content}
                  </SmartLink>
                ) : (
                  <div className={styles.group}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return (
    <section className={`${styles.root} ${styles.gridRoot}`}>
      <div className={styles.grid}>
        {block.cards.map((card) => {
          const inner = (
            <article className={styles.card}>
              {card.image && (
                <div className={styles.imageWrap}>
                  <img
                    src={card.image}
                    alt={card.title}
                    className={styles.image}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <h3 className={styles.cardTitle}>
                {card.title}
              </h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </article>
          );

          return card.link ? (
            <SmartLink key={card.title} href={card.link} className={styles.cardLink}>
              {inner}
            </SmartLink>
          ) : (
            <div key={card.title}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
