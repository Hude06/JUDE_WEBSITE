import type { HeadingBlock as HeadingBlockType } from '@/lib/types';

interface HeadingBlockProps {
  block: HeadingBlockType;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  const level = block.level ?? 1;
  const id = block.anchorId;
  const scroll = id ? 'scroll-mt-24' : '';

  const container = `mx-auto max-w-[var(--container-default)] px-6 md:px-10 ${scroll}`;

  switch (level) {
    case 1:
      return (
        <div
          id={id}
          className={`${container} pt-[var(--space-section-md)] pb-6`}
        >
          <h1
            className="font-display leading-[0.95] tracking-[-0.02em] text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(2.75rem, 8vw, 6.5rem)' }}
          >
            {block.text}
          </h1>
        </div>
      );
    case 2:
      return (
        <div id={id} className={`${container} pt-[var(--space-section-sm)] pb-4`}>
          <h2
            className="font-display leading-[1.0] tracking-[-0.02em] text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
          >
            {block.text}
          </h2>
        </div>
      );
    case 3:
      return (
        <div id={id} className={`${container} pt-6 pb-2`}>
          <h3
            className="font-display leading-tight text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(1.375rem, 2vw, 1.75rem)' }}
          >
            {block.text}
          </h3>
        </div>
      );
    case 4:
      return (
        <div id={id} className={`${container} pt-4 pb-2`}>
          <h4 className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-muted)] font-medium">
            {block.text}
          </h4>
        </div>
      );
    case 5:
      return (
        <div id={id} className={`${container} pt-4 pb-2`}>
          <h5 className="text-base font-medium tracking-tight text-[color:var(--color-fg)]">
            {block.text}
          </h5>
        </div>
      );
    case 6:
      return (
        <div id={id} className={`${container} pt-2 pb-2`}>
          <h6 className="text-sm font-medium tracking-tight text-[color:var(--color-fg)]">
            {block.text}
          </h6>
        </div>
      );
    default:
      return (
        <div id={id} className={container}>
          <h1
            className="font-display leading-[0.95] tracking-[-0.02em] text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(2.75rem, 8vw, 6.5rem)' }}
          >
            {block.text}
          </h1>
        </div>
      );
  }
}
