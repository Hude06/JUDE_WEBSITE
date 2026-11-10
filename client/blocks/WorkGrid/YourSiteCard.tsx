import { useState } from 'react';
import { MARK_PALETTE } from '@/client/blocks/shared/markPalette';
import styles from './WorkGridBlock.module.css';

const PLACEHOLDER = 'Your Business';
const MAX_LENGTH = 40;

/* Same name, same color, every time — so a visitor who comes back and types
   their business again sees the site they saw before. */
function colorFor(name: string) {
  let hash = 0;
  for (const char of name.toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return MARK_PALETTE[Math.abs(hash) % MARK_PALETTE.length];
}

/* Long names shrink to stay on two lines inside the mock's hero. */
function titleSize(name: string) {
  const length = Math.max(name.length, 8);
  return `${Math.max(4.6, Math.min(10, 88 / length))}cqi`;
}

/** The portfolio's last card: type a business name and it becomes the next
    site in the grid, then carries the name through to the contact form. */
export function YourSiteCard() {
  const [name, setName] = useState('');
  const trimmed = name.trim();
  const shown = trimmed || PLACEHOLDER;
  const href = trimmed ? `/contact?business=${encodeURIComponent(trimmed)}#start` : '/contact';

  return (
    <div className={styles.card}>
      <div className={`browser-frame ${styles.frame} ${styles.yourFrame}`}>
        <div
          aria-hidden
          className={styles.mock}
          data-empty={!trimmed || undefined}
          style={{ '--mock-color': colorFor(shown) } as React.CSSProperties}
        >
          <div className={styles.mockNav}>
            <span className={styles.mockLogo} />
            <span className={styles.mockBrand}>{shown}</span>
            <span className={styles.mockLinks}>
              <span /><span /><span />
            </span>
          </div>
          <div className={styles.mockHero}>
            <span className={styles.mockTitle} style={{ fontSize: titleSize(shown) }}>
              {shown}
            </span>
            <span className={styles.mockLine} />
            <span className={`${styles.mockLine} ${styles.mockLineShort}`} />
            <span className={styles.mockButton}>Get in touch</span>
          </div>
        </div>
      </div>
      <div className={styles.meta}>
        <input
          className={styles.yourInput}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Type your business name"
          aria-label="Your business name, to preview your site"
          autoComplete="organization"
          spellCheck={false}
        />
        <span className={styles.year}>next</span>
      </div>
      <p className={styles.tagline}>
        {trimmed ? 'Like it? ' : 'Yours could be the next one here. '}
        <a href={href} className={styles.yourCta}>
          {trimmed ? 'Let’s build the real one →' : 'Start a project →'}
        </a>
      </p>
    </div>
  );
}
