import type { CaseStudyBlock as CaseStudyBlockType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tilt } from '@/components/motion/Tilt';
import { secondaryLink } from '@/lib/buttons';

interface CaseStudyBlockProps {
  block: CaseStudyBlockType;
}

export function CaseStudyBlock({ block }: CaseStudyBlockProps) {
  const {
    client,
    tagline,
    year,
    role,
    image,
    link,
    status = 'live',
    reverse = false,
  } = block;

  const isArchived = status === 'archived';

  const imageElement = (
    <img
      src={image}
      alt={`${client} — ${tagline}`}
      className="w-full h-auto block transition-transform duration-[600ms] ease-out group-hover:scale-[1.015]"
      loading="lazy"
    />
  );

  return (
    <section className="scroll-reveal mx-auto max-w-[var(--container-wide)] px-6 py-12 md:px-10 md:py-20">
      <div
        className={cn(
          'grid gap-10 md:gap-16 lg:gap-20 items-center',
          'md:grid-cols-[1.25fr_1fr]',
          reverse && 'md:[&>figure]:order-2',
        )}
      >
        <figure className="m-0 group">
          {link && !isArchived ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${client}`}
              className="block overflow-hidden rounded-2xl"
            >
              <Tilt>{imageElement}</Tilt>
            </a>
          ) : (
            <div className="block overflow-hidden rounded-2xl">
              <Tilt>{imageElement}</Tilt>
            </div>
          )}
        </figure>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-muted)] tabular-nums">
            Case Study — {year}
          </p>

          <h3
            className="mt-5 font-display leading-[0.95] tracking-[-0.02em] text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)' }}
          >
            {client}
          </h3>

          <p className="mt-6 max-w-md text-lg md:text-xl text-[color:var(--color-muted)] leading-snug">
            {tagline}
          </p>

          <dl className="mt-10 border-t border-[color:var(--color-hairline)]">
            <MetaRow label="Role" value={role} />
            <MetaRow label="Year" value={year} />
            <MetaRow label="Status" value={isArchived ? 'Archived' : 'Live'} />
          </dl>

          {link && !isArchived && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(secondaryLink, 'mt-10')}
            >
              Visit site →
            </a>
          )}
          {isArchived && (
            <p className="mt-10 text-sm text-[color:var(--color-subtle)]">
              Site no longer available
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-[color:var(--color-hairline)] py-3 text-sm">
      <dt className="uppercase tracking-[0.18em] text-[color:var(--color-subtle)] text-xs">
        {label}
      </dt>
      <dd className="text-right text-[color:var(--color-fg)]">{value}</dd>
    </div>
  );
}
