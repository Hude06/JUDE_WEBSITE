import styles from './Atmosphere.module.css';

/**
 * Full-viewport texture overlay for expressive themes.
 *
 * Renders a single fixed, non-interactive layer. All visual behavior is driven
 * purely by CSS keyed on the `data-atmosphere` attribute that app/layout.tsx
 * sets on <html> for expressive presets — so this renders nothing for classic
 * themes (which never set the attribute) and needs no client JS.
 *
 * Mounted from site/shell.tsx (client-owned zone) so client sites can remove or
 * customize it without touching framework route files.
 */
export function Atmosphere() {
  return <div className={styles.atmosphere} aria-hidden="true" />;
}
