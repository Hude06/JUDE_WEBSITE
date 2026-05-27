import type { CardGridBlock as CardGridBlockType } from '@/client/types';
import styles from './CardGridBlock.module.css';

interface CardGridBlockProps {
  block: CardGridBlockType;
}

export function CardGridBlock({ block }: CardGridBlockProps) {
  const hasImages = block.cards.some((c) => c.image);

  if (!hasImages) {
    return (
      <nav className={`${styles.root} ${styles.listRoot}`}>
        <ul className={styles.list}>
          {block.cards.map((card, i) => {
            const isExternal = card.link?.startsWith('http');
            const content = (
              <div className={styles.row}>
                <div className={styles.lead}>
                  <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.copy}>
                    <h3 className={styles.title} style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)' }}>
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
                  <a
                    href={card.link}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={styles.itemLink}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={styles.group}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
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
                  />
                </div>
              )}
              <h3 className={styles.cardTitle} style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                {card.title}
              </h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </article>
          );

          return card.link ? (
            <a key={card.title} href={card.link} className={styles.cardLink}>
              {inner}
            </a>
          ) : (
            <div key={card.title}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
