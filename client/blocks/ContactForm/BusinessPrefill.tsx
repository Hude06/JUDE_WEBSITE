import { useEffect, useRef } from 'react';

/** Picks up the name typed into the work grid's "Your site here" card
    (/contact?business=…) so the visitor doesn't type it twice. Read from
    window rather than useSearchParams so the page stays statically rendered;
    without JS the form simply starts empty. */
export function BusinessPrefill() {
  const fieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get('business')?.trim().slice(0, 40);
    const field = fieldRef.current;
    if (!name || !field) return;
    // Disabled until now so an empty "Business" line never reaches the inbox.
    field.value = name;
    field.disabled = false;
    const message = field.form?.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    if (message && !message.value) message.value = `A site for ${name}. `;
  }, []);

  return <input ref={fieldRef} type="hidden" name="Business" disabled />;
}
