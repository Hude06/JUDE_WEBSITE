'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Moodie, EXPRESSION_NAMES, type ExpressionName } from '@moodie/react';
import type { NavLink } from '@/lib/types';

interface HeaderProps {
  siteName: string;
  nav: NavLink[];
}

function randomExpression(): ExpressionName {
  return EXPRESSION_NAMES[Math.floor(Math.random() * EXPRESSION_NAMES.length)];
}

/* Curated so the mark always reads well against the page; fully random hex
   regularly produced muddy or near-background colors. */
const PALETTE = [
  '#e05d5d', '#e08b3a', '#d9b23a', '#7fb069',
  '#3fa7a0', '#4a90d9', '#7a6fd0', '#c964a7',
] as const;

function randomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

type Mood = { color: string; expression: ExpressionName };

function randomMood(): Mood {
  return { color: randomColor(), expression: randomExpression() };
}

export function Header({ siteName, nav }: HeaderProps) {
  // Fixed on the server so SSR and the first client render match; the idle
  // timer below rerolls it shortly after mount so every load gets a fresh face.
  const [mood, setMood] = useState<Mood>({
    color: '#3a5bd6',
    expression: 'neutral',
  });
  // The hint retires permanently once the mark has been clicked — it exists to
  // teach the interaction, not to nag about it.
  const [discovered, setDiscovered] = useState(false);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNext = (delay: number) => {
      timeoutId = setTimeout(() => {
        setMood(randomMood());
        scheduleNext(3500 + Math.random() * 3500);
      }, delay);
    };
    // Deferred rather than set synchronously here: the first face still lands
    // well before anyone reads the page, and the effect body stays free of a
    // setState that would cascade a second render on every mount.
    scheduleNext(400);

    return () => clearTimeout(timeoutId);
  }, []);

  const reroll = useCallback(() => {
    setMood(randomMood());
    setDiscovered(true);
    setPopping(true);
  }, []);

  return (
    <header className="site-header">
      <div className="jude-container site-header__inner">
        <div className="site-brand">
          {/* Its own control rather than part of the home link: clicking the
              face is a toy, and nesting a button inside an anchor is invalid. */}
          <button
            type="button"
            onClick={reroll}
            onAnimationEnd={() => setPopping(false)}
            className={`site-brand__mark${popping ? ' is-popping' : ''}`}
            aria-label="Give the mark a new face"
          >
            <Moodie
              shape="circle"
              color={mood.color}
              eyeColor="#17181c"
              expression={mood.expression}
              eyeScale={1.15}
              motion="gentle"
              size="100%"
            />
            {!discovered && (
              <span aria-hidden className="site-brand__hint">click me</span>
            )}
          </button>

          <Link
            href="/"
            className="site-brand__label"
            aria-label={`${siteName} — home`}
          >
            <span className="site-brand__name">Jude Hill</span>
            <span className="site-brand__separator">—</span>
            <span className="site-brand__role">
              Designer &amp; Developer
            </span>
          </Link>
        </div>

        <nav className="site-nav">
          {nav.map((link) =>
            link.href.startsWith('/') ? (
              <Link
                key={link.href}
                href={link.href}
                className="site-nav__link"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="site-nav__link"
              >
                {link.label}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
