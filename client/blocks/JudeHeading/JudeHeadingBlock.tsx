import type { JudeHeadingBlock as JudeHeadingBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import styles from './JudeHeadingBlock.module.css';

interface JudeHeadingBlockProps {
  block: JudeHeadingBlockType;
}

/** The last word of display headings becomes the italic moss accent.
    Single-word headings stay plain — an all-accent title reads as a mistake. */
function renderAccentText(text: string) {
  const words = text.split(' ').filter(Boolean);
  if (words.length < 2) return text;
  return (
    <>
      {words.slice(0, -1).join(' ')}{' '}
      <em className={styles.accent}>{words[words.length - 1]}</em>
    </>
  );
}

export function JudeHeadingBlock({ block }: JudeHeadingBlockProps) {
  const level = block.level ?? 1;
  const id = block.anchorId;

  const container = cn(styles.container, id && styles.withAnchor);

  switch (level) {
    case 1:
      return (
        <div id={id} className={cn(container, styles.level1Wrap)}>
          <h1 className={styles.level1Heading}>{renderAccentText(block.text)}</h1>
        </div>
      );
    case 2:
      return (
        <div id={id} className={cn(container, styles.level2Wrap)}>
          <div className={styles.dividerRow} aria-hidden>
            <span className={styles.dividerLine} />
            <span className={styles.sectionMark}>{id ? `§ ${id}` : '§'}</span>
          </div>
          <h2 className={styles.level2Heading}>{renderAccentText(block.text)}</h2>
        </div>
      );
    case 3:
      return (
        <div id={id} className={cn(container, styles.level3Wrap)}>
          <h3 className={styles.level3Heading}>{block.text}</h3>
        </div>
      );
    case 4:
      return (
        <div id={id} className={cn(container, styles.level4Wrap)}>
          <h4 className={styles.level4Heading}>{block.text}</h4>
        </div>
      );
    case 5:
      return (
        <div id={id} className={cn(container, styles.level5Wrap)}>
          <h5 className={styles.level5Heading}>{block.text}</h5>
        </div>
      );
    case 6:
      return (
        <div id={id} className={cn(container, styles.level6Wrap)}>
          <h6 className={styles.level6Heading}>{block.text}</h6>
        </div>
      );
    default:
      return (
        <div id={id} className={container}>
          <h1 className={styles.defaultHeading}>{block.text}</h1>
        </div>
      );
  }
}
