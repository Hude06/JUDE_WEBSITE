import type { JudeButtonBlock as JudeButtonBlockType } from '@/client/types';
import { primaryButton, primaryButtonArrow, ghostButton } from '@/client/blocks/shared/buttons';
import { SmartLink } from '@/client/blocks/shared/SmartLink';

interface JudeButtonBlockProps {
  block: JudeButtonBlockType;
}

export function JudeButtonBlock({ block }: JudeButtonBlockProps) {
  const variant = block.variant ?? 'default';
  const isGhost = variant === 'ghost' || variant === 'outline';
  const isExternal = block.href.startsWith('http') || block.href.startsWith('mailto:');

  return (
    <div className="jude-container jude-button-block">
      <SmartLink
        href={block.href}
        className={isGhost ? ghostButton : primaryButton}
      >
        <span>{block.text}</span>
        <span className={primaryButtonArrow} aria-hidden>
          {isExternal ? '↗' : '→'}
        </span>
      </SmartLink>
    </div>
  );
}
