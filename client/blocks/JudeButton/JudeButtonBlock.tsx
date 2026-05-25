import type { JudeButtonBlock as JudeButtonBlockType } from '@/client/types';
import { primaryButton, primaryButtonArrow, ghostButton } from '@/client/blocks/shared/buttons';

interface JudeButtonBlockProps {
  block: JudeButtonBlockType;
}

export function JudeButtonBlock({ block }: JudeButtonBlockProps) {
  const variant = block.variant ?? 'default';
  const isGhost = variant === 'ghost' || variant === 'outline';
  const isExternal = block.href.startsWith('http') || block.href.startsWith('mailto:');

  return (
    <div className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-6">
      <a
        href={block.href}
        className={isGhost ? ghostButton : primaryButton}
        target={block.href.startsWith('http') ? '_blank' : undefined}
        rel={block.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        <span>{block.text}</span>
        <span className={primaryButtonArrow} aria-hidden>
          {isExternal ? '↗' : '→'}
        </span>
      </a>
    </div>
  );
}
