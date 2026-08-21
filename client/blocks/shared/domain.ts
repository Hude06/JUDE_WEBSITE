/**
 * Display form of a project URL — no scheme, no trailing slash.
 * Shared by the blocks that show a client's domain (case study, work grid,
 * case-study header) so they can't drift apart.
 */
export function formatDomain(link: string): string {
  return link.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** Fallback domain guessed from a client name, e.g. "Bobby Salazar's" → "bobbysalazars.com". */
export function guessDomain(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z]/g, '')}.com`;
}
