'use client';
import { useEffect, useRef } from 'react';
import { AtelierMark } from '@/site/components/AtelierMark';
import styles from './DownloadCta.module.css';

interface DownloadCtaBlock {
  id: string;
  type: 'download-cta';
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  cta: { label: string; href: string };
  platform?: string;
}

export function DownloadCta({ block }: { block: DownloadCtaBlock }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        gsap.fromTo('.dl-inner > *',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } },
        );
      }, sectionRef);

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={`dl-inner ${styles.inner}`}>
        {block.eyebrow && <p className={styles.eyebrow}>{block.eyebrow}</p>}
        <h2 className={styles.headline}>{block.headline}</h2>
        {block.subheadline && <p className={styles.subheadline}>{block.subheadline}</p>}
        <div className={styles.ctaWrap}>
          <a href={block.cta.href} className={styles.btn}>
            <span className={styles.btnIcon}><AtelierMark size={12} diamondColor="#fdfcf8" /></span>
            {block.cta.label}
          </a>
          {block.platform && (
            <p className={styles.platform} dangerouslySetInnerHTML={{ __html: block.platform }} />
          )}
        </div>
      </div>
    </section>
  );
}
