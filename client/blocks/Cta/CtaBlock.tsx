import type { CtaBlock as CtaBlockType } from '@/client/types';
import { secondaryLink } from '@/client/blocks/shared/buttons';

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

        <h2
          className="cta-block__title"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
        >
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
              <a href={block.primaryCta.href} className={`${secondaryLink} cta-block__primary-link`}>
                {block.primaryCta.text} →
              </a>
            )}
            {block.secondaryCta && (
              <a href={block.secondaryCta.href} className={secondaryLink}>
                {block.secondaryCta.text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
