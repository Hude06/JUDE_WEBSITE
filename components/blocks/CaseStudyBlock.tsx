import type { CaseStudyBlock as CaseStudyBlockType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tilt } from '@/components/motion/Tilt';

interface CaseStudyBlockProps {
  block: CaseStudyBlockType;
}

/**
 * Index counter — we can't know position from JSON, so we derive from the id suffix
 * when the id follows the `home-N` / `work-N` pattern. Fallback to blank.
 */
function deriveIndex(id: string): string | null {
  const match = id.match(/-(\d+)$/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  // home.json: home-3 = first case study. Shift so 3→01, 4→02, 5→03
  const idx = Math.max(1, n - 2);
  return String(idx).padStart(2, '0');
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
    id,
  } = block;

  const isArchived = status === 'archived';
  const index = deriveIndex(id);

  const imageElement = (
    <div className="browser-frame">
      <div className="browser-frame__bar">
        <span className="browser-frame__dot" />
        <span className="browser-frame__dot" />
        <span className="browser-frame__dot" />
        <span className="ml-3 text-[0.68rem] text-[color:var(--color-subtle)] tracking-wide truncate">
          {link ? link.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${client.toLowerCase().replace(/[^a-z]/g, '')}.com`}
        </span>
      </div>
      <div className="overflow-hidden bg-[color:var(--color-surface)]">
        <img
          src={image}
          alt={`${client} — ${tagline}`}
          className="w-full h-auto block transition-transform duration-[800ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
    </div>
  );

  return (
    <section className="scroll-reveal mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-10 md:py-16">
      <div
        className={cn(
          'grid gap-10 md:gap-16 lg:gap-24 items-center',
          'md:grid-cols-[1.3fr_1fr]',
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
              className="block"
            >
              <Tilt maxTilt={3}>{imageElement}</Tilt>
            </a>
          ) : (
            <Tilt maxTilt={3}>{imageElement}</Tilt>
          )}
        </figure>

        <div className="relative">
          {index && (
            <span
              className="block font-display text-[color:var(--color-subtle)] leading-none tabular-nums mb-4"
              style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', letterSpacing: '0.02em' }}
            >
              {index} / Case study
            </span>
          )}

          <h3
            className="font-display leading-[0.95] tracking-[-0.025em] text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.75rem)' }}
          >
            {client}
          </h3>

          <p className="mt-6 max-w-md text-lg md:text-xl text-[color:var(--color-muted)] leading-[1.45]">
            {tagline}
          </p>

          <dl className="mt-10 border-t border-[color:var(--color-hairline)]">
            <MetaRow label="Role" value={role} />
            <MetaRow label="Year" value={year} />
            <MetaRow
              label="Status"
              value={
                isArchived ? (
                  <span className="text-[color:var(--color-subtle)]">Archived</span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span className="pulse-dot" aria-hidden />
                    <span>Live</span>
                  </span>
                )
              }
            />
          </dl>

          {link && !isArchived && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-center gap-2 text-[0.95rem] font-medium tracking-tight text-[color:var(--color-fg)]"
            >
              <span className="link-underline">Visit {client.replace(/['’].*$/, '')}</span>
              <span
                className="inline-block transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
                aria-hidden
              >
                ↗
              </span>
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

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-[color:var(--color-hairline)] py-3.5 text-sm">
      <dt className="uppercase tracking-[0.18em] text-[color:var(--color-subtle)] text-[0.72rem]">
        {label}
      </dt>
      <dd className="text-right text-[color:var(--color-fg)]">{value}</dd>
    </div>
  );
}
