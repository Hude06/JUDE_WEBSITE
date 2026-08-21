import type { CaseStudyHeaderBlock as CaseStudyHeaderBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import { formatDomain } from '@/client/blocks/shared/domain';
import styles from './CaseStudyHeaderBlock.module.css';

interface CaseStudyHeaderBlockProps {
  block: CaseStudyHeaderBlockType;
}

export function CaseStudyHeaderBlock({ block }: CaseStudyHeaderBlockProps) {
  const { eyebrow, client, tagline, role, year, services, link, backHref, backLabel } = block;

  const domain = link ? formatDomain(link) : undefined;

  return (
    <header className={cn(styles.root, 'scroll-reveal')}>
      {backHref && (
        <a href={backHref} className={cn('mono-label', styles.back)}>
          <span aria-hidden className={styles.backArrow}>
            ←
          </span>
          <span className="link-underline">{backLabel ?? 'All work'}</span>
        </a>
      )}

      {eyebrow && <p className={cn('mono-label', styles.eyebrow)}>{eyebrow}</p>}

      <h1 className={styles.client}>{client}</h1>
      {tagline && <p className={styles.tagline}>{tagline}</p>}

      <dl className={styles.ledger}>
        {role && <MetaCell label="Role" value={role} />}
        {year && <MetaCell label="Year" value={year} />}
        {services && services.length > 0 && (
          <MetaCell label="Services" value={services.join(', ')} />
        )}
        {link && (
          <MetaCell
            label="Live site"
            value={
              <a href={link} target="_blank" rel="noopener noreferrer" className={styles.visitLink}>
                <span className="link-underline">{domain}</span>
                <span aria-hidden className={styles.visitArrow}>
                  ↗
                </span>
              </a>
            }
          />
        )}
      </dl>
    </header>
  );
}

function MetaCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.cell}>
      <dt className={cn('mono-label', styles.cellLabel)}>{label}</dt>
      <dd className={styles.cellValue}>{value}</dd>
    </div>
  );
}
