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

/** Light sprout mark for the deep-moss footer band. */
function SproutMarkLight() {
  return (
    <svg width="26" height="30" viewBox="0 0 26 30" fill="none" aria-hidden>
      <path
        d="M13 29V12"
        stroke="var(--paper)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="13" cy="8" r="7" fill="var(--moss-bright)" />
      <circle cx="6" cy="10" r="3.6" fill="#b8d4a8" />
      <circle cx="20" cy="11" r="3.2" fill="#9dc2a4" />
    </svg>
  );
}

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
      <section className="site-footer__cta-band">
        <div className="jude-container site-footer__cta-inner">
          <p className="site-footer__eyebrow">Got an idea?</p>
          <h2 className="site-footer__title">
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
              <span aria-hidden className="site-footer__email-arrow">
                →
              </span>
            </a>
            <Link href="/contact" className="site-footer__brief-link">
              <span className="link-underline">Or start a project brief</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Treeline silhouette into the deep-moss band — a little Eugene,
          Oregon horizon at the bottom of every page. */}
      <svg
        className="site-footer__treeline"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="var(--moss-deep)"
          d="M0 150 L0 96 L34 96 L30 70 L52 70 L48 44 L62 44 L74 70 L94 70 L90 96 L130 96 L126 78 L150 78 L146 52 L166 52 L178 78 L200 78 L196 104 L240 104 L236 64 L256 64 L252 34 L270 34 L284 64 L302 64 L298 104 L348 104 L344 80 L366 80 L362 54 L382 54 L394 80 L414 80 L410 110 L470 110 L466 72 L488 72 L484 40 L504 40 L518 72 L536 72 L532 110 L590 110 L586 84 L608 84 L604 58 L624 58 L636 84 L656 84 L652 112 L710 112 L706 68 L728 68 L724 32 L744 32 L758 68 L776 68 L772 112 L830 112 L826 86 L848 86 L844 60 L864 60 L876 86 L896 86 L892 114 L950 114 L946 76 L968 76 L964 46 L984 46 L998 76 L1016 76 L1012 114 L1070 114 L1066 88 L1088 88 L1084 62 L1104 62 L1116 88 L1136 88 L1132 116 L1190 116 L1186 72 L1208 72 L1204 38 L1224 38 L1238 72 L1256 72 L1252 116 L1310 116 L1306 90 L1328 90 L1324 64 L1344 64 L1356 90 L1376 90 L1372 118 L1410 118 L1410 96 L1440 96 L1440 150 Z"
        />
      </svg>

      <div className="site-footer__band">
        {/* Link bar */}
        <div className="site-footer__links-wrap">
          <div className="jude-container site-footer__links-grid">
            <div>
              <div className="site-footer__brand-row">
                <span aria-hidden className="site-footer__brand-mark">
                  <SproutMarkLight />
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
            <span className="site-footer__stack">
              Designed, built &amp; animated by hand
            </span>
          </div>
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
      <p className="site-footer-col__title">{title}</p>
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
                <span aria-hidden className="site-footer-col__arrow">
                  ↗
                </span>
              </a>
            ) : (
              <Link href={link.href} className="site-footer-col__link">
                <span className="link-underline">{link.label}</span>
                <span aria-hidden className="site-footer-col__arrow">
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
