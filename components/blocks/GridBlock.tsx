/* eslint-disable @next/next/no-img-element */
import { Container } from '../../lib/ui';
import type { GridBlock as GridBlockType, GridStyle } from '../../lib/types';
import type { ThemeStructure } from '../../lib/themes';
import block from './Block.module.css';
import styles from './GridBlock.module.css';

export function GridBlock({ block: b, dna }: { block: GridBlockType; dna?: ThemeStructure }) {
  const style: GridStyle = b.style ?? dna?.gridStyle ?? 'cards';
  const colsClass = `cols-${b.columns ?? 3}` as const;

  const header = (
    <>
      {b.eyebrow && <p className={block.eyebrow}>{b.eyebrow}</p>}
      {b.heading && <h2 className={styles.heading}>{b.heading}</h2>}
    </>
  );

  // Bordered list — hairline-ruled single-column rows.
  if (style === 'bordered-list') {
    return (
      <div className={block.block}>
        <Container width="wide">
          {header}
          <div className={styles.list}>
            {b.items.map((item, i) => (
              <div key={i} className={styles.row}>
                <div className={styles.rowMain}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  {item.body && <p className={styles.itemBody}>{item.body}</p>}
                </div>
                {item.image && <img src={item.image} alt={item.title} className={styles.rowImage} />}
              </div>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  // Bare / numbered / feature — grid without card chrome.
  if (style === 'bare' || style === 'numbered' || style === 'feature') {
    const gridVariant =
      style === 'bare' ? styles.gridBare : style === 'numbered' ? styles.gridNumbered : styles.gridFeature;
    const itemVariant =
      style === 'bare' ? styles.itemBare : style === 'numbered' ? styles.itemNumbered : styles.itemFeature;
    return (
      <div className={block.block}>
        <Container width="wide">
          {header}
          <div className={`${styles.grid} ${styles[colsClass]} ${gridVariant}`}>
            {b.items.map((item, i) => (
              <div key={i} className={itemVariant}>
                {style === 'numbered' && (
                  <span className={styles.numeral}>{String(i + 1).padStart(2, '0')}</span>
                )}
                {style === 'feature' && <span className={styles.featureRule} aria-hidden="true" />}
                {item.image && <img src={item.image} alt={item.title} className={styles.itemImage} />}
                <h3 className={styles.itemTitle}>{item.title}</h3>
                {item.body && <p className={styles.itemBody}>{item.body}</p>}
              </div>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  // Cards — original layout (unchanged).
  return (
    <div className={block.block}>
      <Container width="wide">
        {b.eyebrow && <p className={block.eyebrow}>{b.eyebrow}</p>}
        {b.heading && <h2 className={styles.heading}>{b.heading}</h2>}
        <div className={`${styles.grid} ${styles[colsClass]}`}>
          {b.items.map((item, i) => (
            <div key={i} className={styles.item}>
              {item.image && <img src={item.image} alt={item.title} className={styles.itemImage} />}
              <h3 className={styles.itemTitle}>{item.title}</h3>
              {item.body && <p className={styles.itemBody}>{item.body}</p>}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
