'use client';
import { useEffect, useRef } from 'react';
import styles from './AtelierAbout.module.css';

interface AtelierAboutBlock {
  id: string;
  type: 'about-page';
}

const PRINCIPLES = [
  {
    title: 'Local-first, always',
    body: "Your work is yours. It lives on your device as a plain JSON file you can read and back up yourself. No server knows what you're working on.",
  },
  {
    title: 'No configuration required',
    body: "Open the app and it works. Three columns, one project, ready to go. Options exist — but you never have to touch them.",
  },
  {
    title: 'Calm interface',
    body: 'No animations demanding attention. No modals stacked on modals. The board is quiet so you can think.',
  },
];

const TECH = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="16" height="11" rx="2"/>
        <path d="M6 17h8M10 14v3"/>
      </svg>
    ),
    title: 'Built with Tauri',
    body: "A native macOS app via Tauri 2 — a thin Rust shell wrapping a React frontend. Proper .app bundle, title bar overlay, and system-level feel without Electron's overhead.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M10 3v14M6 5l4-2 4 2M6 15l4 2 4-2"/>
        <path d="M3 8l3.5 2L3 12M17 8l-3.5 2 3.5 4"/>
      </svg>
    ),
    title: 'Fonts bundled in',
    body: 'Fraunces and Schibsted Grotesk ship inside the app via Fontsource. No network connection needed — open Atelier in a cabin with no Wi-Fi and it looks exactly the same.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14l3-3 2 2 4-5 3 3"/>
        <rect x="2" y="2" width="16" height="16" rx="3"/>
      </svg>
    ),
    title: 'Plain JSON data',
    body: 'Your boards are stored in ~/Library as plain JSON. Readable in any text editor, backupable with Time Machine, inspectable without any special tool.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8"/>
        <path d="M10 6v4l3 3"/>
      </svg>
    ),
    title: 'Fast by default',
    body: 'No cloud sync latency, no loading spinners, no authentication round-trips. Everything is local so every interaction is instant.',
  },
];

export function AtelierAbout({ block: _block }: { block: AtelierAboutBlock }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!rootRef.current) return;

      const ctx = gsap.context(() => {
        gsap.fromTo('.ab-eyebrow',  { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
        gsap.fromTo('.ab-headline', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 });
        gsap.fromTo('.ab-intro',    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.35 });
        gsap.fromTo('.ab-divider',  { scaleX: 0 },         { scaleX: 1, duration: 0.9, ease: 'power3.out', delay: 0.55, transformOrigin: 'left' });

        const staggerReveal = (selector: string, triggerEl?: string) => {
          gsap.fromTo(selector,
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out',
              scrollTrigger: { trigger: triggerEl ?? selector, start: 'top 85%' } },
          );
        };

        staggerReveal('.ab-manifesto-p', '.ab-manifesto');
        staggerReveal('.ab-principle', '.ab-principles');
        staggerReveal('.ab-tech-col', '.ab-tech');
      }, rootRef);

      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <p className={`ab-eyebrow ${styles.eyebrow}`}>
            <span className={styles.eyebrowDot} />
            About Atelier
          </p>
          <h2 className={`ab-headline ${styles.headline}`}>
            A quiet<br />kanban board.
          </h2>
          <p className={`ab-intro ${styles.intro}`}>
            The thinking behind the tool — and why less is the whole point.
          </p>
        </div>
        <div className={`ab-divider ${styles.divider}`} />
      </header>

      <section className={`ab-manifesto ${styles.manifesto}`}>
        <div className={styles.manifestoInner}>
          <span className={styles.openQuote} aria-hidden>{'"'}</span>
          <div className={styles.manifestoText}>
            <p className={`ab-manifesto-p ${styles.manifestoLead}`}>
              Most productivity apps make you feel busy before you&apos;ve done anything.
            </p>
            <p className={`ab-manifesto-p ${styles.manifestoBody}`}>
              Notifications, badges, sync indicators, premium tiers. They dress up task
              management as if complexity were a feature. The real work gets buried under
              the apparatus meant to organise it.
            </p>
            <p className={`ab-manifesto-p ${styles.manifestoBody}`}>
              Atelier disagrees. A kanban board is a simple thing: a few columns, some
              cards, a way to move them around. That&apos;s the whole job.{' '}
              <em>Atelier does that job and stops.</em>
            </p>
          </div>
        </div>
      </section>

      <section className={`ab-principles ${styles.principles}`}>
        <div className={styles.principlesInner}>
          <h2 className={styles.sectionLabel}>Design principles</h2>
          <div className={styles.principlesGrid}>
            {PRINCIPLES.map((p, i) => (
              <article key={i} className={`ab-principle ${styles.principle}`}>
                <span className={styles.principleNum}>0{i + 1}</span>
                <h3 className={styles.principleTitle}>{p.title}</h3>
                <p className={styles.principleBody}>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`ab-tech ${styles.tech}`}>
        <div className={styles.techInner}>
          <h2 className={styles.sectionLabel}>Under the hood</h2>
          <div className={styles.techGrid}>
            {TECH.map((t, i) => (
              <div key={i} className={`ab-tech-col ${styles.techCol}`}>
                <div className={styles.techIcon}>{t.icon}</div>
                <h3 className={styles.techTitle}>{t.title}</h3>
                <p className={styles.techBody}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <blockquote className={styles.pullQuote}>
        <div className={styles.pullQuoteInner}>
          <p className={styles.pullQuoteText}>
            <span className={styles.pqMark}>{'"'}</span>
            A tool should fit the hand. Atelier is built to disappear into the work.
            <span className={styles.pqMark}>{'"'}</span>
          </p>
          <cite className={styles.pullQuoteCite}>Atelier — v0.1.0</cite>
        </div>
      </blockquote>
    </div>
  );
}
