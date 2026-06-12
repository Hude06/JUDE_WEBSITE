'use client';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './BentoFeatures.module.css';

interface Feature {
  id: string;
  icon: string;
  title: string;
  body: string;
  kbd?: string[];
}

interface BentoFeaturesBlock {
  id: string;
  type: 'bento-features';
  eyebrow?: string;
  heading: string;
  subheading?: string;
  features: Feature[];
}

const ICONS: Record<string, ReactNode> = {
  local: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="11" width="16" height="8" rx="2" />
      <path d="M7 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="11" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  projects: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="12" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="12" width="7" height="7" rx="2" />
      <rect x="12" y="12" width="7" height="7" rx="2" />
    </svg>
  ),
  drag: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9l6-6 6 6M5 13l6 6 6-6" />
    </svg>
  ),
  theme: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M11 3a8 8 0 1 0 0 16A8 8 0 0 0 11 3z" />
      <path d="M11 3v16" />
      <path d="M11 3C8 3 5.5 7 5.5 11S8 19 11 19" fill="currentColor" stroke="none" opacity="0.25" />
    </svg>
  ),
  keys: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="18" height="11" rx="2.5" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M8 13.5h6" />
    </svg>
  ),
  offline: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="18" height="12" rx="2" />
      <path d="M6 19h10M9 19v-2M13 19v-2" />
    </svg>
  ),
};

export function BentoFeatures({ block }: { block: BentoFeaturesBlock }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        gsap.fromTo('.bento-header',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: '.bento-header', start: 'top 85%' } },
        );

        gsap.fromTo('.bento-card',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out',
            scrollTrigger: { trigger: '.bento-card', start: 'top 88%' } },
        );
      }, sectionRef);

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className={`bento-header ${styles.header}`}>
          {block.eyebrow && <p className={styles.eyebrow}>{block.eyebrow}</p>}
          <h2 className={styles.heading}>{block.heading}</h2>
          {block.subheading && <p className={styles.subheading}>{block.subheading}</p>}
        </div>

        <div className={styles.grid}>
          {block.features.map((feature) => (
            <div key={feature.id} className={`bento-card ${styles.card}`}>
              <div className={styles.icon}>{ICONS[feature.icon] ?? null}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardBody}>{feature.body}</p>
              {feature.kbd && (
                <div className={styles.kbdRow}>
                  {feature.kbd.map((k) => (
                    <kbd key={k} className={styles.kbdKey}>{k}</kbd>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
