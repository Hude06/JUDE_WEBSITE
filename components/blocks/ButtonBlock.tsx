import type { ButtonBlock as ButtonBlockType } from '@/lib/types';
import { primaryButton, secondaryLink } from '@/lib/buttons';

interface ButtonBlockProps {
  block: ButtonBlockType;
}

export function ButtonBlock({ block }: ButtonBlockProps) {
  const variant = block.variant ?? 'default';
  const isLink = variant === 'ghost' || variant === 'outline';

  return (
    <div className="mx-auto max-w-[var(--container-default)] px-6 md:px-10 py-6">
      {isLink ? (
        <a href={block.href} className={secondaryLink}>
          {block.text} →
        </a>
      ) : (
        <a href={block.href} className={primaryButton}>
          {block.text}
        </a>
      )}
    </div>
  );
}
