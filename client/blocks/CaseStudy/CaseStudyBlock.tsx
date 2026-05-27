import type { CaseStudyBlock as CaseStudyBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import { Tilt } from '@/client/blocks/shared/Tilt';
import styles from './CaseStudyBlock.module.css';

interface CaseStudyBlockProps {
  block: CaseStudyBlockType;
}

function deriveIndex(id: string): string | null {
  const match = id.match(/-(\d+)$/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  const idx = Math.max(1, n - 2);
  return String(idx).padStart(2, '0');
}

export function CaseStudyBlock({ block }: CaseStudyBlockProps) {
  const { client, tagline, year, role, image, link, status = 'live', reverse = false, id } = block;

  const isArchived = status === 'archived';
  const index = deriveIndex(id);

  const imageElement = (
    <div className="browser-frame">
      <div className="browser-frame__bar">
        <span className="browser-frame__dot" />
        <span className="browser-frame__dot" />
        <span className="browser-frame__dot" />
        <span className={styles.domain}>
          {link ? link.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${client.toLowerCase().replace(/[^a-z]/g, '')}.com`}
        </span>
      </div>
      <div className={styles.imageSurface}>
        <img
          src={image}
          alt={`${client} — ${tagline}`}
          className={styles.image}
          loading="lazy"
        />
      </div>
    </div>
  );

  return (
    <section className={styles.root}>
      <div className={cn(styles.layout, reverse && styles.reverse)}>
        <figure className={styles.figure}>
          {link && !isArchived ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${client}`}
              className={styles.figureLink}
            >
              <Tilt maxTilt={3}>{imageElement}</Tilt>
            </a>
          ) : (
            <Tilt maxTilt={3}>{imageElement}</Tilt>
          )}
        </figure>

        <div className={styles.content}>
          {index && <span className={styles.index}>{index} / Case study</span>}

          <h3 className={styles.title}>{client}</h3>

          <p className={styles.tagline}>{tagline}</p>

          <dl className={styles.metaList}>
            <MetaRow label="Role" value={role} />
            <MetaRow label="Year" value={year} />
            <MetaRow
              label="Status"
              value={
                isArchived ? (
                  <span className={styles.archivedStatus}>Archived</span>
                ) : (
                  <span className={styles.statusLive}>
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
              className={styles.visitLink}
            >
              <span className="link-underline">Visit {client.replace(/['’].*$/, '')}</span>
              <span className={styles.visitArrow} aria-hidden>
                ↗
              </span>
            </a>
          )}
          {isArchived && <p className={styles.archivedNote}>Site no longer available</p>}
        </div>
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.metaRow}>
      <dt className={styles.metaLabel}>{label}</dt>
      <dd className={styles.metaValue}>{value}</dd>
    </div>
  );
}
