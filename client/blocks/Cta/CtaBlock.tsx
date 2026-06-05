import type { CtaBlock as CtaBlockType } from '@/client/types';
import { secondaryLink } from '@/client/blocks/shared/buttons';
import { SmartLink } from '@/client/blocks/shared/SmartLink';

interface CtaBlockProps {
  block: CtaBlockType;
}

export function CtaBlock({ block }: CtaBlockProps) {
  return (
    <section className="jude-container cta-block">
      <div className="cta-block__inner">
        {block.eyebrow && (
          <p className="cta-block__eyebrow">
            {block.eyebrow}
          </p>
        )}

        <h2 className="cta-block__title">
          {block.title}
        </h2>

        {block.description && (
          <p className="cta-block__description">
            {block.description}
          </p>
        )}

        {(block.primaryCta || block.secondaryCta) && (
          <div className="cta-block__actions">
            {block.primaryCta && (
              <SmartLink href={block.primaryCta.href} className={`${secondaryLink} cta-block__primary-link`}>
                {block.primaryCta.text} →
              </SmartLink>
            )}
            {block.secondaryCta && (
              <SmartLink href={block.secondaryCta.href} className={secondaryLink}>
                {block.secondaryCta.text}
              </SmartLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
