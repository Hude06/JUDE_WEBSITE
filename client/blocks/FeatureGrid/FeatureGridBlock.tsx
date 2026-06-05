import type { FeatureGridBlock as FeatureGridBlockType } from '@/client/types';

interface FeatureGridBlockProps {
  block: FeatureGridBlockType;
}

export function FeatureGridBlock({ block }: FeatureGridBlockProps) {
  if (!block.items?.length) return null;

  const columns = block.columns ?? 3;
  const colClass = `feature-grid-block__grid--cols-${columns}`;

  return (
    <section className="jude-container feature-grid-block scroll-reveal">
      {(block.eyebrow || block.heading) && (
        <header className="feature-grid-block__header">
          {block.eyebrow && (
            <p className="feature-grid-block__eyebrow">
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="feature-grid-block__heading">
              {block.heading}
            </h2>
          )}
        </header>
      )}

      <ul className={`feature-grid-block__grid ${colClass}`}>
        {block.items.map((item, i) => (
          <li
            key={`${i}-${item.title}`}
            className="feature-grid-block__item"
          >
            <div className="feature-grid-block__meta">
              <span className="feature-grid-block__index tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="feature-grid-block__rule" />
            </div>

            <h3 className="feature-grid-block__title">
              {item.title}
            </h3>
            <p className="feature-grid-block__description">
              {item.description}
            </p>

            <span
              aria-hidden
              className="feature-grid-block__arrow"
            >
              →
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
