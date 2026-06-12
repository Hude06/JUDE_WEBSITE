'use client';
import { useEffect, useRef, useState } from 'react';
import { AtelierMark } from '@/site/components/AtelierMark';
import styles from './HeroAnimated.module.css';

interface CtaLink { label: string; href: string; }
interface HeroAnimatedBlock {
  id: string; type: 'hero-animated';
  eyebrow?: string; headline: string; body: string;
  primaryCta: CtaLink; secondaryCta?: CtaLink;
}
type CardData = { id: string; text: string };
type ColData  = { id: string; title: string; cards: CardData[] };

const INIT: ColData[] = [
  { id: 'todo', title: 'To do',      cards: [{ id:'c1', text:'Design the onboarding' }, { id:'c2', text:'Write landing copy' }, { id:'c3', text:'Push to staging' }] },
  { id: 'wip',  title: 'Working on', cards: [{ id:'c4', text:'Build the API layer' }] },
  { id: 'done', title: 'Done',       cards: [{ id:'c5', text:'Logo v1' }, { id:'c6', text:'Colour system' }] },
];

function InteractiveBoard() {
  const [cols, setCols]             = useState<ColData[]>(INIT);
  const [over, setOver]             = useState<string | null>(null);
  const [editCard, setEditCard]     = useState<string | null>(null);
  const [editCol, setEditCol]       = useState<string | null>(null);
  const [editText, setEditText]     = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragging                    = useRef<{ cardId: string; fromCol: string } | null>(null);

  const moveCard = (fromId: string, toId: string, cardId: string) => {
    if (fromId === toId) return;
    setCols(prev => {
      const card = prev.find(c => c.id === fromId)?.cards.find(c => c.id === cardId);
      if (!card) return prev;
      return prev.map(col => {
        if (col.id === fromId) return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
        if (col.id === toId)   return { ...col, cards: [...col.cards, card] };
        return col;
      });
    });
  };

  const commitCard = (cardId: string, text: string) => {
    setCols(p => p.map(col => ({ ...col, cards: col.cards.map(c => c.id === cardId ? { ...c, text: text || c.text } : c) })));
    setEditCard(null);
  };

  const commitCol = (colId: string, title: string) => {
    setCols(p => p.map(c => c.id === colId ? { ...c, title: title || c.title } : c));
    setEditCol(null);
  };

  const totalCards = cols.reduce((n, c) => n + c.cards.length, 0);

  return (
    <div className={styles.boardArea}>
      <div className={styles.boardHead}>
        <div className={styles.boardChip} style={{ background: '#C24B2C22', color: '#C24B2C' }}>
          <span className={styles.chipGlyph} />
        </div>
        <span className={styles.boardName}>Launch</span>
        <span className={styles.boardMeta}>{totalCards} cards</span>
      </div>

      <div className={styles.columns}>
        {cols.map(col => (
          <div
            key={col.id}
            className={`${styles.col}${over === col.id ? ` ${styles.colOver}` : ''}`}
            onDragOver={e => { e.preventDefault(); setOver(col.id); }}
            onDragLeave={e => {
              const r = e.currentTarget.getBoundingClientRect();
              if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
                setOver(null);
            }}
            onDrop={e => {
              e.preventDefault();
              const d = dragging.current;
              if (d) moveCard(d.fromCol, col.id, d.cardId);
              dragging.current = null;
              setOver(null);
            }}
          >
            <div className={styles.colHead}>
              {editCol === col.id ? (
                <input
                  autoFocus
                  className={styles.inlineInput}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onBlur={() => commitCol(col.id, editText)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitCol(col.id, editText);
                    if (e.key === 'Escape') setEditCol(null);
                    e.stopPropagation();
                  }}
                />
              ) : (
                <span
                  className={styles.colTitle}
                  onDoubleClick={() => { setEditCol(col.id); setEditText(col.title); }}
                  title="Double-click to rename"
                >{col.title}</span>
              )}
              <span className={styles.colCount}>{col.cards.length}</span>
            </div>

            <div className={styles.cards}>
              {col.cards.map(card => (
                <div
                  key={card.id}
                  className={`card-row ${styles.card}${draggingId === card.id ? ` ${styles.cardGhost}` : ''}`}
                  draggable
                  onDragStart={e => {
                    dragging.current = { cardId: card.id, fromCol: col.id };
                    setDraggingId(card.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={() => { dragging.current = null; setDraggingId(null); setOver(null); }}
                  onDoubleClick={() => { setEditCard(card.id); setEditText(card.text); }}
                  title="Drag to move · Double-click to rename"
                >
                  {editCard === card.id ? (
                    <input
                      autoFocus
                      className={styles.inlineInput}
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      onBlur={() => commitCard(card.id, editText)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitCard(card.id, editText);
                        if (e.key === 'Escape') setEditCard(null);
                        e.stopPropagation();
                      }}
                    />
                  ) : card.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.titleBar}>
        <div className={styles.trafficLights}>
          <span className={styles.tlClose} />
          <span className={styles.tlMin} />
          <span className={styles.tlMax} />
        </div>
        <span className={styles.windowTitle}>Atelier</span>
        <span className={styles.tryBadge}>try it →</span>
      </div>

      <div className={styles.appBody}>
        <nav className={styles.sidebar}>
          <div className={styles.brandTile}>
            <AtelierMark size={13} />
          </div>
          <div className={styles.projectIcons}>
            {(['#C24B2C','#5063A8','#3D8273'] as const).map((color, i) => (
              <div key={i} className={styles.projectIcon} style={{ background: color + '22', color }}>
                <span className={styles.projectGlyph} />
              </div>
            ))}
          </div>
          <div className={styles.sidebarBottom}>
            <div className={styles.sidebarBtn}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M4.5 1.5v6M1.5 4.5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.sidebarBtn}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <circle cx="4.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M4.5 1v1M4.5 7v1M1 4.5h1M7 4.5h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </nav>

        <InteractiveBoard />
      </div>
    </div>
  );
}

export function HeroAnimated({ block }: { block: HeroAnimatedBlock }) {
  const heroRef = useRef<HTMLElement>(null);
  const words   = block.headline.split(' ');

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!heroRef.current) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.h-eyebrow', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
          .fromTo('.h-word',    { y: 65, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.72 }, '-=0.2')
          .fromTo('.h-body',    { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.45')
          .fromTo('.h-buttons', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.35')
          .fromTo('.h-window',  { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 1.05, ease: 'power2.out' }, '-=0.85')
          .fromTo('.card-row',  { y: 8,  opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.35 }, '-=0.5')
          .fromTo('.h-scroll',  { opacity: 0 },         { opacity: 1, duration: 0.5 }, '-=0.1');
      }, heroRef);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.content}>
          {block.eyebrow && (
            <p className={`h-eyebrow ${styles.eyebrow}`}>
              <span className={styles.eyebrowDot} />
              {block.eyebrow}
            </p>
          )}
          <h1 className={styles.headline}>
            {words.map((w, i) => (
              <span key={i} className={`h-word ${styles.word}`}>{w}</span>
            ))}
          </h1>
          <p className={`h-body ${styles.body}`}>{block.body}</p>
          <div className={`h-buttons ${styles.buttons}`}>
            <a href={block.primaryCta.href} className={styles.btnPrimary}>
              {block.primaryCta.label}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            {block.secondaryCta && (
              <a href={block.secondaryCta.href} className={styles.btnSecondary}>
                {block.secondaryCta.label}
              </a>
            )}
          </div>
        </div>

        <div className={`h-window ${styles.mockupWrap}`}>
          <AppWindow />
        </div>
      </div>

      <div className={`h-scroll ${styles.scrollHint}`} aria-hidden>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
