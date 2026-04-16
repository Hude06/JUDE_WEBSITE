import type { HeadingBlock as HeadingBlockType } from '@/lib/types';

interface HeadingBlockProps {
  block: HeadingBlockType;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  const level = block.level ?? 1;
  const id = block.anchorId;
  const scroll = id ? 'scroll-mt-24' : '';

  const container = `mx-auto max-w-[var(--container-wide)] px-6 md:px-10 ${scroll}`;

  switch (level) {
    case 1:
      return (
        <div
          id={id}
          className={`${container} pt-[var(--space-section-md)] pb-6`}
        >
          <h1
            className="font-display leading-[0.9] tracking-[-0.03em] text-[color:var(--color-fg)] max-w-5xl"
            style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
          >
            {block.text}
          </h1>
        </div>
      );
    case 2:
      return (
        <div id={id} className={`${container} pt-[var(--space-section-md)] pb-2`}>
          <div className="flex items-center gap-5 mb-6">
            <span
              aria-hidden
              className="block h-px flex-1 max-w-[4rem] bg-[color:var(--color-hairline-strong)]"
            />
            <span className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--color-muted)] tabular-nums">
              {id ? `§ ${id}` : '§'}
            </span>
          </div>
          <h2
            className="font-display leading-[1.0] tracking-[-0.025em] text-[color:var(--color-fg)] max-w-4xl"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)' }}
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
            style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2rem)' }}
          >
            {block.text}
          </h3>
        </div>
      );
    case 4:
      return (
        <div id={id} className={`${container} pt-4 pb-2`}>
          <h4 className="text-[0.72rem] uppercase tracking-[0.26em] text-[color:var(--color-muted)] font-medium">
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
            className="font-display leading-[0.9] tracking-[-0.03em] text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
          >
            {block.text}
          </h1>
        </div>
      );
  }
}
