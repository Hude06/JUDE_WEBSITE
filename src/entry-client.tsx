import { createRoot, hydrateRoot } from 'react-dom/client';
import { loadPage } from '@/lib/content';
import { App } from './App';

const GA_ID = 'G-5S85L38R1M';

const root = document.getElementById('root')!;

if (root.firstElementChild) {
  // Built page: the HTML is already there, React just attaches to it.
  const slug = root.dataset.page;
  hydrateRoot(root, <App page={slug ? loadPage(slug) : null} />);
} else {
  // `npm run dev`: no prebuilt HTML, so render from the URL.
  const slug = window.location.pathname.replace(/^\/|\/$/g, '') || 'home';
  createRoot(root).render(<App page={loadPage(slug)} />);
}

/* Google Analytics waits until the page has finished loading: gtag is
   ~180 KB, more than all of the site's own JS. Superview (in index.html)
   still records every visit immediately. */
function loadAnalytics() {
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // gtag.js expects the real `arguments` object, not an array.
  const gtag = function () { w.dataLayer!.push(arguments); } as (...args: unknown[]) => void;
  gtag('js', new Date());
  gtag('config', GA_ID);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

if (import.meta.env.PROD) {
  if (document.readyState === 'complete') loadAnalytics();
  else window.addEventListener('load', loadAnalytics, { once: true });
}
