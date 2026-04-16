import type { CardGridBlock as CardGridBlockType } from '@/lib/types';

interface CardGridBlockProps {
  block: CardGridBlockType;
}

export function CardGridBlock({ block }: CardGridBlockProps) {
  const hasImages = block.cards.some((c) => c.image);

  if (!hasImages) {
    return (
      <nav className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-6 md:py-8">
        <ul className="border-t border-[color:var(--color-hairline-strong)]">
          {block.cards.map((card, i) => {
            const isExternal = card.link?.startsWith('http');
            const content = (
              <div className="relative flex items-center justify-between gap-6 py-6 md:py-7">
                <div className="flex items-baseline gap-6 md:gap-10 flex-1 min-w-0">
                  <span className="font-display italic text-[color:var(--color-subtle)] tabular-nums text-sm md:text-base w-6 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-baseline md:gap-10">
                    <h3
                      className="font-display leading-tight text-[color:var(--color-fg)] transition-colors group-hover:text-[color:var(--color-accent-ink)]"
                      style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)' }}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-1 md:mt-0 text-sm text-[color:var(--color-muted)] truncate">
                      {card.description}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[color:var(--color-subtle)] text-xl transition-all duration-400 ease-[var(--ease-out-soft)] group-hover:translate-x-1 group-hover:text-[color:var(--color-fg)]"
                  aria-hidden
                >
                  {isExternal ? '↗' : '→'}
                </span>
              </div>
            );

            return (
              <li
                key={card.title}
                className="border-b border-[color:var(--color-hairline)]"
              >
                {card.link ? (
                  <a
                    href={card.link}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="group block transition-colors hover:bg-white -mx-4 px-4 md:-mx-6 md:px-6"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="group">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <section className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {block.cards.map((card) => {
          const inner = (
            <article className="group">
              {card.image && (
                <div className="overflow-hidden rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-hairline)]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-[600ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              )}
              <h3
                className="mt-6 font-display leading-tight text-[color:var(--color-fg)]"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
              >
                {card.title}
              </h3>
              <p className="mt-2 text-base text-[color:var(--color-muted)] leading-relaxed">
                {card.description}
              </p>
            </article>
          );

          return card.link ? (
            <a key={card.title} href={card.link} className="block no-underline">
              {inner}
            </a>
          ) : (
            <div key={card.title}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
