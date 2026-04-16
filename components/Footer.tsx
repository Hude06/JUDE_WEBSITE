import { LiveMasthead } from '@/components/LiveMasthead';
import { Marquee } from '@/components/Marquee';

interface FooterProps {
  siteName: string;
}

const quickLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const elsewhere = [
  { label: 'Instagram', href: 'https://instagram.com/judemakes' },
  { label: 'YouTube', href: 'https://youtube.com/@Judemakesfpv' },
  { label: 'GitHub', href: 'https://github.com/Hude06' },
  { label: 'Etsy', href: 'https://etsy.com/shop/JudeMakesThings' },
];

export function Footer({ siteName }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 md:mt-32">
      {/* Marquee — decorative motion strip */}
      <Marquee
        items={[
          'Websites',
          'Portfolios',
          'Landing pages',
          'Small business',
          'Brand sites',
          'Design + Build',
          'Eugene, Oregon',
        ]}
      />

      {/* Big CTA band */}
      <section className="border-t border-[color:var(--color-hairline)] paper-grain relative overflow-hidden">
        <div className="mx-auto max-w-[var(--container-wide)] px-6 py-24 md:px-10 md:py-40">
          <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[color:var(--color-muted)] mb-8">
            Got an idea?
          </p>
          <h2
            className="font-display leading-[0.9] tracking-[-0.035em] text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}
          >
            Let&rsquo;s make
            <br />
            something{' '}
            <span className="italic text-[color:var(--color-accent-ink)]">
              good.
            </span>
          </h2>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
            <a
              href="mailto:jude@judemakes.com"
              className="group inline-flex items-center gap-3 text-xl md:text-2xl text-[color:var(--color-fg)]"
            >
              <span className="link-underline">jude@judemakes.com</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 text-[0.95rem] font-medium tracking-tight text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)] transition-colors"
            >
              <span className="link-underline">Or start a project brief</span>
            </a>
          </div>
        </div>
      </section>

      {/* Link bar */}
      <div className="border-t border-[color:var(--color-hairline)]">
        <div className="mx-auto grid max-w-[var(--container-wide)] gap-10 px-6 py-14 md:px-10 md:py-16 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--color-hairline-strong)] bg-white"
              >
                <span
                  aria-hidden
                  className="italic"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.35rem',
                    lineHeight: 1,
                    transform: 'translate(1px, -2px)',
                  }}
                >
                  J
                </span>
              </span>
              <span className="text-[0.72rem] uppercase tracking-[0.26em] tabular-nums">
                <span className="text-[color:var(--color-fg)] font-medium">Jude Hill</span>
                <span className="mx-2 text-[color:var(--color-subtle)]">—</span>
                <span className="text-[color:var(--color-subtle)]">
                  Designer &amp; Developer
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[color:var(--color-muted)]">
              Freelance designer &amp; developer making fast, beautiful websites for
              small businesses, creatives, and anyone with an idea worth shipping.
            </p>
          </div>

          <FooterCol title="Sitemap" links={quickLinks} />
          <FooterCol title="Elsewhere" links={elsewhere} external />
        </div>
      </div>

      {/* Fine print */}
      <div className="border-t border-[color:var(--color-hairline)]">
        <div className="mx-auto flex max-w-[var(--container-wide)] flex-col gap-3 px-6 py-6 text-[0.7rem] uppercase tracking-[0.22em] text-[color:var(--color-muted)] md:flex-row md:items-center md:justify-between md:px-10">
          <span className="text-[color:var(--color-fg)]">
            © {year} · {siteName}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="pulse-dot" aria-hidden />
            <span className="tabular-nums">
              Eugene, Oregon · <LiveMasthead />
            </span>
          </span>
          <span>Hand-built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  external = false,
}: {
  title: string;
  links: { label: string; href: string }[];
  external?: boolean;
}) {
  return (
    <div>
      <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[color:var(--color-subtle)]">
        {title}
      </p>
      <ul className="mt-5 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="group inline-flex items-center gap-1.5 text-[0.95rem] text-[color:var(--color-fg)]"
            >
              <span className="link-underline">{link.label}</span>
              <span
                aria-hidden
                className="text-[color:var(--color-subtle)] opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
              >
                {external ? '↗' : '→'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
