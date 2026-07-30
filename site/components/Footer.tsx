import Link from 'next/link';

interface FooterProps {
  siteName: string;
}

export function Footer({ siteName }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* Closing CTA band — title left, action right. */}
      <section className="site-footer__cta-band">
        <div className="jude-container site-footer__cta-inner">
          <h2 className="site-footer__title">
            Got something
            <br />
            to build?
          </h2>

          <div className="site-footer__cta-actions">
            <Link href="/contact" className="jude-btn jude-btn--primary">
              <span>Start a project</span>
              <span aria-hidden className="jude-btn__arrow">→</span>
            </Link>
            <span className="site-footer__email-line">
              <a href="mailto:jude@micah77.org">jude@micah77.org</a> · replies within a day
            </span>
          </div>
        </div>
      </section>

      {/* Thin fine-print bar */}
      <div className="site-footer__fine-print-wrap">
        <div className="jude-container site-footer__fine-print">
          <span className="site-footer__copyright">
            © {year} · {siteName}
          </span>
          <span className="site-footer__location">Eugene, Oregon</span>
          <span className="site-footer__stack">Designed &amp; built by Jude Hill</span>
        </div>
      </div>
    </footer>
  );
}
