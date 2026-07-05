import { Container } from '../../lib/ui';
import type { SectionBlock as SectionBlockType, SectionLayout } from '../../lib/types';
import type { ThemeStructure } from '../../lib/themes';
import type { ContainerWidth } from '../../lib/ui/Container';
import block from './Block.module.css';
import styles from './SectionBlock.module.css';

export function SectionBlock({ block: b, dna }: { block: SectionBlockType; dna?: ThemeStructure }) {
  const bg = `bg-${b.background ?? 'default'}` as const;
  const pad = `padding-${b.padding ?? 'md'}` as const;
  const layout: SectionLayout | undefined = b.layout ?? dna?.sectionLayout;
  const eyebrow = b.eyebrow ? <p className={block.eyebrow}>{b.eyebrow}</p> : null;

  // Aside — heading column beside body column.
  if (layout === 'aside') {
    return (
      <section id={b.anchor} className={`${styles.section} ${styles[bg]} ${styles[pad]}`}>
        <Container width="wide">
          <div className={styles.aside}>
            <div className={styles.asideHead}>
              {eyebrow}
              {b.heading && <h2 className={styles.heading}>{b.heading}</h2>}
            </div>
            {b.body && <p className={`${styles.body} ${styles.asideBody}`}>{b.body}</p>}
          </div>
        </Container>
      </section>
    );
  }

  if (layout === 'centered' || layout === 'left' || layout === 'wide') {
    const width: ContainerWidth = layout === 'wide' ? 'full' : layout === 'centered' ? 'default' : 'wide';
    const alignClass =
      layout === 'centered' ? styles.centered : layout === 'wide' ? styles.wide : styles.left;
    return (
      <section id={b.anchor} className={`${styles.section} ${styles[bg]} ${styles[pad]}`}>
        <Container width={width}>
          <div className={alignClass}>
            {eyebrow}
            {b.heading && <h2 className={styles.heading}>{b.heading}</h2>}
            {b.body && <p className={styles.body}>{b.body}</p>}
          </div>
        </Container>
      </section>
    );
  }

  // Default — original layout (unchanged).
  return (
    <section
      id={b.anchor}
      className={`${styles.section} ${styles[bg]} ${styles[pad]}`}
    >
      <Container width="wide">
        {eyebrow}
        {b.heading && <h2 className={styles.heading}>{b.heading}</h2>}
        {b.body && <p className={styles.body}>{b.body}</p>}
      </Container>
    </section>
  );
}
