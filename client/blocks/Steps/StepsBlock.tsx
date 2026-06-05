import type { StepsBlock as StepsBlockType } from '@/client/types';

interface StepsBlockProps {
  block: StepsBlockType;
}

export function StepsBlock({ block }: StepsBlockProps) {
  if (!block.steps?.length) return null;

  return (
    <section className="jude-container steps-block scroll-reveal">
      {(block.eyebrow || block.heading) && (
        <header className="steps-block__header">
          {block.eyebrow && (
            <p className="steps-block__eyebrow">
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="steps-block__heading">
              {block.heading}
            </h2>
          )}
        </header>
      )}

      <ol className="steps-block__list">
        {block.steps.map((step, i) => (
          <li
            key={`${i}-${step.title}`}
            className="steps-block__item"
          >
            <div className="steps-block__meta">
              <span className="steps-block__index tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="steps-block__label">
                Step
              </span>
            </div>
            <h3 className="steps-block__title">
              {step.title}
            </h3>
            <p className="steps-block__description">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
