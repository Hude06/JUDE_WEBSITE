import { renderToString } from 'react-dom/server';
import { loadPage } from '@/lib/content';
import { renderHead } from '@/site/metadata';
import { App } from './App';

export { listPages } from '@/lib/content';

/** HTML for one page at build time. slug null = the 404 page. */
export function render(slug: string | null) {
  const page = slug ? loadPage(slug) : null;
  return { head: renderHead(page), html: renderToString(<App page={page} />) };
}
