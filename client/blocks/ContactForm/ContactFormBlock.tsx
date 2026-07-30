import type { ContactFormBlock as ContactFormBlockType } from '@/client/types';
import { cn } from '@/lib/utils';
import styles from './ContactFormBlock.module.css';

interface ContactFormBlockProps {
  block: ContactFormBlockType;
}

const DEFAULT_TIMELINE_LABEL = 'When would you like your new site built?';
const DEFAULT_TIMELINE_OPTIONS = ['Today', 'Tomorrow', 'Next week'];

/** Two-column opener: job-sheet intro left (pitch + fact ledger), the form
    in a lit panel right. Plain HTML POST — works with JS disabled. The
    action is a hosted form-to-email endpoint (FormSubmit/Formspree style).
    The URL field reveal is CSS-only (:has), so this stays a zero-JS
    server component. */
export function ContactFormBlock({ block }: ContactFormBlockProps) {
  const hasIntro = Boolean(block.heading || block.intro || block.facts?.length);
  const timelineOptions = block.timelineOptions?.length
    ? block.timelineOptions
    : DEFAULT_TIMELINE_OPTIONS;

  return (
    <section className={cn(styles.root, 'scroll-reveal')} id="start">
      <div className={cn(styles.layout, hasIntro && styles.layoutSplit)}>
        {hasIntro && (
          <div className={styles.intro}>
            {block.eyebrow && <p className={styles.eyebrow}>{block.eyebrow}</p>}
            {block.heading && <h1 className={styles.heading}>{block.heading}</h1>}
            {block.intro && <p className={styles.pitch}>{block.intro}</p>}
            {Boolean(block.facts?.length) && (
              <dl className={styles.facts}>
                {block.facts!.map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <dt className={styles.factLabel}>{fact.label}</dt>
                    <dd className={styles.factValue}>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}

        <form className={styles.panel} action={block.action} method="POST">
          {/* Endpoint config: subject line, no captcha page, honeypot. */}
          <input type="hidden" name="_subject" value={block.subject ?? 'New project inquiry'} />
          <input type="hidden" name="_captcha" value="false" />
          <input type="text" name="_honey" className={styles.honey} tabIndex={-1} autoComplete="off" aria-hidden />

          <fieldset className={styles.choiceField}>
            <legend className={styles.label}>Do you already have a website?</legend>
            <div className={styles.pills}>
              {['Yes', 'No'].map((option) => (
                <label key={option} className={styles.pill}>
                  <input
                    className={styles.radio}
                    type="radio"
                    name="Already have a site"
                    value={option}
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Revealed by CSS when the "Yes" pill above is checked. */}
          <label className={cn(styles.field, styles.urlField)}>
            <span className={styles.label}>What&apos;s the URL?</span>
            <input
              className={styles.input}
              type="text"
              inputMode="url"
              name="Current URL"
              placeholder="https://"
              autoComplete="url"
            />
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input className={styles.input} type="text" name="name" required autoComplete="name" />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input className={styles.input} type="email" name="email" required autoComplete="email" />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Phone (optional)</span>
            <input className={styles.input} type="tel" name="Phone" autoComplete="tel" />
          </label>

          <fieldset className={styles.choiceField}>
            <legend className={styles.label}>{block.timelineLabel ?? DEFAULT_TIMELINE_LABEL}</legend>
            <div className={styles.pills}>
              {timelineOptions.map((option) => (
                <label key={option} className={styles.pill}>
                  <input className={styles.radio} type="radio" name="Timeline" value={option} required />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className={styles.field}>
            <span className={styles.label}>Your project</span>
            <textarea
              className={styles.textarea}
              name="message"
              rows={5}
              required
              placeholder={block.placeholder ?? 'What you do, what you need, and any links worth a look.'}
            />
          </label>

          <div className={styles.submitRow}>
            <button type="submit" className="jude-btn jude-btn--primary">
              <span>{block.submitLabel ?? 'Send it'}</span>
              <span aria-hidden className="jude-btn__arrow">→</span>
            </button>
            {block.note && <span className={styles.note}>{block.note}</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
