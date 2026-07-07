/* eslint-disable @next/next/no-img-element */
import { Container, Heading, Button } from '../../lib/ui';
import type { HeroBlock as HeroBlockType, HeroLayout } from '../../lib/types';
import type { ThemeStructure } from '../../lib/themes';
import styles from './HeroBlock.module.css';

const alignClass = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
} as const;

function Buttons({ buttons }: { buttons: NonNullable<HeroBlockType['buttons']> }) {
  return (
    <div className={styles.buttons}>
      {buttons.map((btn, i) => (
        <Button key={i} variant={btn.variant ?? (i === 0 ? 'primary' : 'secondary')} size="lg" href={btn.href}>
          {btn.label}
        </Button>
      ))}
    </div>
  );
}

export function HeroBlock({ block: b, dna }: { block: HeroBlockType; dna?: ThemeStructure }) {
  const layout: HeroLayout = b.layout ?? dna?.heroLayout ?? 'stack';
  const align = b.align ?? 'left';
  const hasButtons = !!(b.buttons && b.buttons.length > 0);

  // Split — text column beside an image.
  if (layout === 'split') {
    return (
      <div className={styles.hero}>
        <Container width="wide">
          <div className={styles.split}>
            <div className={`${styles.splitText} ${alignClass[align]}`}>
              {b.eyebrow && <p className={styles.eyebrow}>{b.eyebrow}</p>}
              <Heading level={1} size="display" align={align}>{b.title}</Heading>
              {b.subtitle && <p className={styles.subtitle}>{b.subtitle}</p>}
              {hasButtons && <Buttons buttons={b.buttons!} />}
            </div>
            {b.image && (
              <div className={styles.splitMedia}>
                <img src={b.image} alt={b.title} className={styles.splitImage} />
              </div>
            )}
          </div>
        </Container>
      </div>
    );
  }

  // Full-bleed — image as a background band with overlaid copy.
  if (layout === 'full-bleed') {
    return (
      <div
        className={styles.fullBleed}
        style={b.image ? { backgroundImage: `url(${b.image})` } : undefined}
      >
        <div className={styles.fullBleedScrim} />
        <Container width="wide">
          <div className={`${styles.fullBleedInner} ${alignClass[align]}`}>
            {b.eyebrow && <p className={styles.eyebrow}>{b.eyebrow}</p>}
            <Heading level={1} size="hero" align={align}>{b.title}</Heading>
            {b.subtitle && <p className={styles.subtitle}>{b.subtitle}</p>}
            {hasButtons && <Buttons buttons={b.buttons!} />}
          </div>
        </Container>
      </div>
    );
  }

  // Offset — oversized asymmetric editorial hero.
  if (layout === 'offset') {
    return (
      <div className={styles.hero}>
        <Container width="wide">
          <div className={styles.offset}>
            {b.eyebrow && <p className={styles.eyebrow}>{b.eyebrow}</p>}
            <Heading level={1} size="mega" className={styles.offsetTitle}>{b.title}</Heading>
            <div className={styles.offsetAside}>
              {b.subtitle && <p className={styles.subtitle}>{b.subtitle}</p>}
              {hasButtons && <Buttons buttons={b.buttons!} />}
            </div>
            {b.image && <img src={b.image} alt={b.title} className={styles.image} />}
          </div>
        </Container>
      </div>
    );
  }

  // Stack — original layout (unchanged).
  return (
    <div className={styles.hero}>
      <Container width="wide">
        <div className={`${styles.inner} ${alignClass[align]}`}>
          {b.eyebrow && <p className={styles.eyebrow}>{b.eyebrow}</p>}
          <Heading level={1} size="hero" align={align}>
            {b.title}
          </Heading>
          {b.subtitle && <p className={styles.subtitle}>{b.subtitle}</p>}
          {hasButtons && <Buttons buttons={b.buttons!} />}
          {b.image && <img src={b.image} alt={b.title} className={styles.image} />}
        </div>
      </Container>
    </div>
  );
}
