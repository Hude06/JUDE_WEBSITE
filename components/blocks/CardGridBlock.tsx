import type { CardGridBlock as CardGridBlockType } from '@/lib/types';

interface CardGridBlockProps {
  block: CardGridBlockType;
}

export function CardGridBlock({ block }: CardGridBlockProps) {
  const hasImages = block.cards.some((c) => c.image);

  // Image-less cards render as hairline-separated rows (contact methods, social links)
  if (!hasImages) {
    return (
      <nav className="mx-auto max-w-[var(--container-default)] px-6 md:px-10 py-6">
        <ul className="border-t border-[color:var(--color-hairline)]">
          {block.cards.map((card) => {
            const content = (
              <div className="flex items-baseline justify-between gap-6 py-7 transition-colors">
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-display leading-tight text-[color:var(--color-fg)]"
                    style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-[color:var(--color-muted)] truncate">
                    {card.description}
                  </p>
                </div>
                <span
                  className="text-[color:var(--color-subtle)] text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[color:var(--color-fg)]"
                  aria-hidden
                >
                  →
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
                    target={card.link.startsWith('http') ? '_blank' : undefined}
                    rel={
                      card.link.startsWith('http') ? 'noopener noreferrer' : undefined
                    }
                    className="group block hover:bg-[color:var(--color-hairline)]/40 transition-colors -mx-4 px-4 md:-mx-6 md:px-6"
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

  // Image cards — clean image + title/description pairs, no borders
  return (
    <section className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {block.cards.map((card) => {
          const inner = (
            <article className="group">
              {card.image && (
                <div className="overflow-hidden bg-[color:var(--color-hairline)]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-[500ms] ease-out group-hover:scale-[1.02]"
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
