import type { FaqBlock as FaqBlockType } from '@/client/types';

interface FaqBlockProps {
  block: FaqBlockType;
}

/**
 * FAQ section with FAQPage structured data.
 *
 * The JSON-LD is emitted per-block rather than in the shell so it only appears
 * on pages that actually carry an FAQ — FAQPage markup on a page with no
 * visible Q&A is a structured-data violation.
 *
 * Answers render as plain text and are written to stand alone, which is also
 * what AI assistants quote when they cite a source.
 */
export function FaqBlock({ block }: FaqBlockProps) {
  const items = block.items?.filter((item) => item.question && item.answer) ?? [];
  if (!items.length) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="jude-container faq-block scroll-reveal" id={block.anchorId}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {(block.eyebrow || block.heading) && (
        <header className="faq-block__header">
          {block.eyebrow && <p className="faq-block__eyebrow">{block.eyebrow}</p>}
          {block.heading && <h2 className="faq-block__heading">{block.heading}</h2>}
        </header>
      )}

      <dl className="faq-block__list">
        {items.map((item, i) => (
          <div key={`${i}-${item.question}`} className="faq-block__item">
            <dt className="faq-block__question">{item.question}</dt>
            <dd className="faq-block__answer">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
