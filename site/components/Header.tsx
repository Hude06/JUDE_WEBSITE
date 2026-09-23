'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Moodie, EXPRESSION_NAMES, type ExpressionName } from '@moodie/react';
import type { NavLink } from '@/lib/types';
import { MARK_PALETTE } from '@/client/blocks/shared/markPalette';

interface HeaderProps {
  siteName: string;
  nav: NavLink[];
}

function randomExpression(): ExpressionName {
  return EXPRESSION_NAMES[Math.floor(Math.random() * EXPRESSION_NAMES.length)];
}

function randomColor() {
  return MARK_PALETTE[Math.floor(Math.random() * MARK_PALETTE.length)];
}

type Mood = { color: string; expression: ExpressionName };

function randomMood(): Mood {
  return { color: randomColor(), expression: randomExpression() };
}

/* How far (px) the cursor can get from the mark before the eyes hit the edge
   of their travel. Past this they just keep pointing the right way. */
const GAZE_REACH = 420;
const SLEEP_AFTER_MS = 30_000;
const WAKE_ALERT_MS = 1200;

/* Any way into a project conversation, including ones that carry a business
   name from the work grid. Hovering one of these gets a reaction. */
const HIRE_LINK_SELECTOR = 'a[href^="/contact"]';

/* Temporary faces the mark puts on in response to the visitor. While one is
   active, the ambient reroll timer leaves the mood alone. */
type Reaction = 'sleepy' | 'alert' | 'surprised';

function BrandMark() {
  // Fixed on the server so SSR and the first client render match; the idle
  // timer below rerolls it shortly after mount so every load gets a fresh face.
  const [mood, setMood] = useState<Mood>({
    color: '#3a5bd6',
    expression: 'neutral',
  });
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  // The hint retires permanently once the mark has been clicked — it exists to
  // teach the interaction, not to nag about it.
  const [discovered, setDiscovered] = useState(false);
  const [popping, setPopping] = useState(false);
  const markRef = useRef<HTMLButtonElement>(null);
  const reactionRef = useRef<Reaction | null>(null);

  const showReaction = useCallback((next: Reaction | null) => {
    reactionRef.current = next;
    setReaction(next);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNext = (delay: number) => {
      timeoutId = setTimeout(() => {
        if (!reactionRef.current) setMood(randomMood());
        scheduleNext(3500 + Math.random() * 3500);
      }, delay);
    };
    // Deferred rather than set synchronously here: the first face still lands
    // well before anyone reads the page, and the effect body stays free of a
    // setState that would cascade a second render on every mount.
    scheduleNext(400);

    return () => clearTimeout(timeoutId);
  }, []);

  // Eyes follow the cursor anywhere on the page, not just over the mark.
  // Mouse and pen only: on touch, a tap would yank the gaze somewhere random.
  useEffect(() => {
    let frame = 0;
    let lastX = 0;
    let lastY = 0;

    const aim = () => {
      frame = 0;
      const mark = markRef.current;
      if (!mark) return;
      const box = mark.getBoundingClientRect();
      const dx = lastX - (box.left + box.width / 2);
      const dy = lastY - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy);
      if (distance < 1) return setGaze({ x: 0, y: 0 });
      const reach = Math.min(distance / GAZE_REACH, 1);
      // Rounded so sub-pixel jitter doesn't re-render the face every frame.
      const x = Math.round((dx / distance) * reach * 50) / 50;
      const y = Math.round((dy / distance) * reach * 50) / 50;
      setGaze((prev) => (prev.x === x && prev.y === y ? prev : { x, y }));
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      lastX = event.clientX;
      lastY = event.clientY;
      if (!frame) frame = requestAnimationFrame(aim);
    };
    const lookAhead = () => setGaze({ x: 0, y: 0 });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', lookAhead);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', lookAhead);
    };
  }, []);

  // Dozes off after a stretch of nothing, and jolts awake when you come back.
  useEffect(() => {
    let sleepTimer: ReturnType<typeof setTimeout>;
    let wakeTimer: ReturnType<typeof setTimeout>;

    const nudge = () => {
      clearTimeout(sleepTimer);
      sleepTimer = setTimeout(() => showReaction('sleepy'), SLEEP_AFTER_MS);
      if (reactionRef.current !== 'sleepy') return;
      showReaction('alert');
      clearTimeout(wakeTimer);
      wakeTimer = setTimeout(() => {
        if (reactionRef.current === 'alert') showReaction(null);
      }, WAKE_ALERT_MS);
    };

    const events = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((name) => window.addEventListener(name, nudge, { passive: true }));
    nudge();
    return () => {
      clearTimeout(sleepTimer);
      clearTimeout(wakeTimer);
      events.forEach((name) => window.removeEventListener(name, nudge));
    };
  }, [showReaction]);

  // Surprised whenever the cursor lands on a way to hire Jude. Delegated, so
  // it covers CTAs in page content without the blocks knowing about the mark.
  useEffect(() => {
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest?.(HIRE_LINK_SELECTOR)) showReaction('surprised');
    };
    const onOut = (event: PointerEvent) => {
      const from = (event.target as Element | null)?.closest?.(HIRE_LINK_SELECTOR);
      const to = (event.relatedTarget as Element | null)?.closest?.(HIRE_LINK_SELECTOR);
      if (from && from !== to && reactionRef.current === 'surprised') showReaction(null);
    };

    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
    };
  }, [showReaction]);

  const reroll = useCallback(() => {
    setMood(randomMood());
    showReaction(null);
    setDiscovered(true);
    setPopping(true);
  }, [showReaction]);

  return (
    /* Its own control rather than part of the home link: clicking the
       face is a toy, and nesting a button inside an anchor is invalid. */
    <button
      ref={markRef}
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
        expression={reaction ?? mood.expression}
        eyeScale={1.15}
        motion="gentle"
        size="100%"
        gaze={gaze}
      />
      {!discovered && (
        <span aria-hidden className="site-brand__hint">click me</span>
      )}
    </button>
  );
}

export function Header({ siteName, nav }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="jude-container site-header__inner">
        <div className="site-brand">
          <BrandMark />

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
