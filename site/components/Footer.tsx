import Link from 'next/link';
import { LiveMasthead } from '@/site/components/LiveMasthead';
import { Marquee } from '@/site/components/Marquee';

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
    <footer className="site-footer">
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
      <section className="site-footer__cta-band paper-grain">
        <div className="jude-container site-footer__cta-inner">
          <p className="site-footer__eyebrow">
            Got an idea?
          </p>
          <h2
            className="site-footer__title"
            style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}
          >
            Let&rsquo;s make
            <br />
            something <span className="site-footer__title-accent">
              good.
            </span>
          </h2>

          <div className="site-footer__cta-actions">
            <a
              href="mailto:jude@micah77.org"
              className="site-footer__email-link"
            >
              <span className="link-underline">jude@micah77.org</span>
              <span
                aria-hidden
                className="site-footer__email-arrow"
              >
                →
              </span>
            </a>
            <Link
              href="/contact"
              className="site-footer__brief-link"
            >
              <span className="link-underline">Or start a project brief</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Link bar */}
      <div className="site-footer__links-wrap">
        <div className="jude-container site-footer__links-grid">
          <div>
            <div className="site-footer__brand-row">
              <span
                aria-hidden
                className="site-footer__brand-mark"
              >
                <span
                  aria-hidden
                  className="site-footer__brand-letter"
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
              <span className="site-footer__brand-label">
                <span className="site-footer__brand-name">Jude Hill</span>
                <span className="site-footer__brand-separator">—</span>
                <span className="site-footer__brand-role">
                  Designer &amp; Developer
                </span>
              </span>
            </div>
            <p className="site-footer__bio">
              Freelance designer &amp; developer making fast, beautiful websites for
              small businesses, creatives, and anyone with an idea worth shipping.
            </p>
          </div>

          <FooterCol title="Sitemap" links={quickLinks} />
          <FooterCol title="Elsewhere" links={elsewhere} external />
        </div>
      </div>

      {/* Fine print */}
      <div className="site-footer__fine-print-wrap">
        <div className="jude-container site-footer__fine-print">
          <span className="site-footer__copyright">
            © {year} · {siteName}
          </span>
          <span className="site-footer__location">
            <span className="pulse-dot" aria-hidden />
            <span className="tabular-nums">
              Eugene, Oregon · <LiveMasthead />
            </span>
          </span>
          <span className="site-footer__stack">Hand-built with Next.js</span>
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
    <div className="site-footer-col">
      <p className="site-footer-col__title">
        {title}
      </p>
      <ul className="site-footer-col__list">
        {links.map((link) => (
          <li key={link.href}>
            {external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-col__link"
              >
                <span className="link-underline">{link.label}</span>
                <span
                  aria-hidden
                  className="site-footer-col__arrow"
                >
                  ↗
                </span>
              </a>
            ) : (
              <Link
                href={link.href}
                className="site-footer-col__link"
              >
                <span className="link-underline">{link.label}</span>
                <span
                  aria-hidden
                  className="site-footer-col__arrow"
                >
                  →
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
