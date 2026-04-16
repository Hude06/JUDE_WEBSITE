import { LiveMasthead } from '@/components/LiveMasthead';

interface FooterProps {
  siteName: string;
}

export function Footer({ siteName }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-[color:var(--color-hairline)]">
      <section className="mx-auto max-w-[var(--container-wide)] px-6 py-24 md:px-10 md:py-40">
        <h2 className="font-display italic leading-[0.92] tracking-[-0.02em] text-[color:var(--color-fg)]"
          style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}
        >
          Let’s make<br />something.
        </h2>
        <a
          href="mailto:jude@judemakes.com"
          className="link-underline mt-12 inline-block text-xl md:text-2xl text-[color:var(--color-fg)]"
        >
          jude@judemakes.com →
        </a>
      </section>

      <div className="border-t border-[color:var(--color-hairline)]">
        <div className="mx-auto flex max-w-[var(--container-wide)] flex-col gap-3 px-6 py-8 text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)] md:flex-row md:items-baseline md:justify-between md:px-10">
          <span className="text-[color:var(--color-fg)]">
            Jude Hill · Eugene, Oregon
          </span>
          <LiveMasthead />
          <span>© {year} · {siteName}</span>
        </div>
      </div>
    </footer>
  );
}
