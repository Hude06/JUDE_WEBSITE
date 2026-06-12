'use client';
import { useEffect, useRef } from 'react';
import { AtelierMark } from '@/site/components/AtelierMark';
import theme from './AtelierPage.module.css';
import styles from './AtelierDownload.module.css';

interface AtelierDownloadBlock {
  id: string;
  type: 'atelier-download';
}

const RELEASES_URL = 'https://github.com/Hude06/atelier/releases/latest';
const REPO_URL = 'https://github.com/Hude06/atelier';

const STEPS = [
  {
    title: 'Download',
    body: 'Grab the .dmg from the latest release. One file, a few megabytes, no installer wizard.',
  },
  {
    title: 'Drag it in',
    body: 'Open the disk image and drop Atelier into Applications. Eject. That was the whole setup.',
  },
  {
    title: 'Start moving cards',
    body: 'Launch it from Applications. A seeded project is waiting so you can feel it out immediately.',
  },
];

/* The .dmg install vignette — a window with the app icon being dragged
   toward an Applications folder. Pure CSS/SVG, drawn in the app's palette. */
function InstallVignette() {
  return (
    <div className={styles.vignette} aria-hidden>
      <div className={styles.dmgWindow}>
        <div className={styles.dmgTitleBar}>
          <div className={styles.dmgLights}>
            <span /><span /><span />
          </div>
          <span className={styles.dmgTitle}>Atelier 0.1.5</span>
        </div>
        <div className={styles.dmgBody}>
          <div className={styles.dmgApp}>
            <div className={styles.dmgAppIcon}>
              <AtelierMark size={30} />
            </div>
            <span className={styles.dmgLabel}>Atelier</span>
          </div>

          <svg className={styles.dmgArrow} width="74" height="28" viewBox="0 0 74 28" fill="none">
            <path
              d="M2 14 C 22 4, 48 24, 66 14"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 7"
            />
            <path d="M59 8l8 6-9 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <div className={styles.dmgApp}>
            <div className={styles.dmgFolder}>
              <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
                <path
                  d="M2 6.5A3.5 3.5 0 0 1 5.5 3h7l3.4 3.6h12.6A3.5 3.5 0 0 1 32 10v11.5a3.5 3.5 0 0 1-3.5 3.5h-23A3.5 3.5 0 0 1 2 21.5z"
                  fill="currentColor" opacity="0.22"
                />
                <path
                  d="M2 10.5A3.5 3.5 0 0 1 5.5 7h23a3.5 3.5 0 0 1 3.5 3.5v11a3.5 3.5 0 0 1-3.5 3.5h-23A3.5 3.5 0 0 1 2 21.5z"
                  fill="currentColor" opacity="0.45"
                />
              </svg>
            </div>
            <span className={styles.dmgLabel}>Applications</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AtelierDownload({ block: _block }: { block: AtelierDownloadBlock }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!rootRef.current) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.dlp-eyebrow',   { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
          .fromTo('.dlp-headline',  { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.3')
          .fromTo('.dlp-sub',       { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, '-=0.5')
          .fromTo('.dlp-actions',   { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.35')
          .fromTo('.dlp-vignette',  { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, '-=0.4');

        gsap.fromTo('.dlp-step',
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.65, ease: 'power3.out',
            scrollTrigger: { trigger: '.dlp-steps', start: 'top 82%' } },
        );

        gsap.fromTo('.dlp-fact',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: '.dlp-facts', start: 'top 84%' } },
        );
      }, rootRef);

      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <div ref={rootRef} className={`${theme.theme} ${styles.root}`}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={`dlp-eyebrow ${styles.eyebrow}`}>
            <span className={styles.eyebrowDot} />
            Free · macOS 13+ · Apple Silicon
          </p>
          <h1 className={`dlp-headline ${styles.headline}`}>
            Get Atelier.
          </h1>
          <p className={`dlp-sub ${styles.sub}`}>
            No account. No subscription. One small .dmg —<br />
            open it, drag, and start working.
          </p>
          <div className={`dlp-actions ${styles.actions}`}>
            <a href={RELEASES_URL} className={styles.btn}>
              <span className={styles.btnIcon}><AtelierMark size={12} diamondColor="#fdfcf8" /></span>
              Download for Mac
            </a>
            <span className={styles.actionsMeta}>v0.1.5 · about 10 MB</span>
          </div>
        </div>

        <div className={`dlp-vignette`}>
          <InstallVignette />
        </div>
      </header>

      {/* ── Steps ────────────────────────────────────────────── */}
      <section className={`dlp-steps ${styles.steps}`}>
        <div className={styles.stepsInner}>
          {STEPS.map((s, i) => (
            <div key={i} className={`dlp-step ${styles.step}`}>
              <span className={styles.stepNum}>0{i + 1}</span>
              <h2 className={styles.stepTitle}>{s.title}</h2>
              <p className={styles.stepBody}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Facts ────────────────────────────────────────────── */}
      <section className={`dlp-facts ${styles.facts}`}>
        <div className={styles.factsInner}>
          <div className={`dlp-fact ${styles.fact}`}>
            <h3 className={styles.factTitle}>Where is my data?</h3>
            <p className={styles.factBody}>
              Everything lives in one plain JSON file you can open, back up, or
              move between machines:
            </p>
            <code className={styles.factPath}>
              ~/Library/Application Support/com.jude.atelier/atelier-state.json
            </code>
          </div>
          <div className={`dlp-fact ${styles.fact}`}>
            <h3 className={styles.factTitle}>Updates</h3>
            <p className={styles.factBody}>
              Atelier checks for updates silently on launch. When a new version
              is ready you&apos;ll see a quiet prompt in Settings (⌘,) — nothing
              interrupts your board.
            </p>
          </div>
          <div className={`dlp-fact ${styles.fact}`}>
            <h3 className={styles.factTitle}>Open source</h3>
            <p className={styles.factBody}>
              Read the code, file issues, or build it yourself.
            </p>
            <a href={REPO_URL} className={styles.factLink}>
              View the repository
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2.5 9.5l7-7M4 2h5.5v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
