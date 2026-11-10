/*
  Dev-only "Edit text" mode. `npm run dev` gets a floating button: turn it on,
  type over any wording on the page, press Save. Each save records
  { before, after } pairs per page in text-edits/<page>.json, which are then
  copied into content/pages/*.json (or the component) by hand.

  `apply: 'serve'` keeps all of this out of `npm run build`.
*/
import fs from 'node:fs';
import path from 'node:path';

const CLIENT = String.raw`
(() => {
  if (window.__textEditor) return;
  window.__textEditor = true;
  const SKIP = 'script,style,noscript,canvas,svg,pre,[aria-hidden="true"],[data-te-ui]';
  let on = false;
  let originals = new Map();

  const ui = document.createElement('div');
  ui.dataset.teUi = '';
  ui.innerHTML = '<button data-te-toggle>Edit text</button><button data-te-save hidden>Save</button><span data-te-msg></span>';
  ui.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;gap:8px;align-items:center;font:600 13px/1 -apple-system,system-ui,sans-serif;background:#141a2a;color:#fff;padding:8px;border-radius:12px;box-shadow:0 12px 32px -8px rgba(0,0,0,.4)';
  for (const b of ui.querySelectorAll('button')) b.style.cssText = 'all:unset;cursor:pointer;padding:8px 12px;border-radius:8px;background:#ffffff1f';
  ui.querySelector('[data-te-save]').style.background = '#c81f65';
  ui.querySelector('[data-te-msg]').style.cssText = 'font-weight:500;opacity:.8;padding:0 4px';
  document.body.appendChild(ui);
  const style = document.createElement('style');
  style.textContent = 'html.te-on [data-te-block]{outline:1px dashed #c81f6566;outline-offset:3px;cursor:text}html.te-on [data-te-block]:focus{outline:2px solid #c81f65;background:#fff8}html.te-on [data-te-block][data-te-changed]{outline:2px solid #c81f65}';
  document.head.appendChild(style);
  const msg = (t) => { ui.querySelector('[data-te-msg]').textContent = t; };

  // Every element that directly holds visible text becomes one editable block.
  const blocks = () => {
    const out = new Set();
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (!n.nodeValue.trim()) continue;
      const el = n.parentElement;
      if (!el || el.closest(SKIP)) continue;
      out.add(el.closest('h1,h2,h3,h4,h5,h6,p,li,dt,dd,a,button,label,figcaption,blockquote,summary,span') || el);
    }
    // keep the outermost so a heading with an inner <em> edits as one piece
    return [...out].filter((el) => ![...out].some((o) => o !== el && o.contains(el)));
  };

  const enable = () => {
    originals = new Map();
    for (const el of blocks()) {
      el.dataset.teBlock = '';
      el.contentEditable = 'plaintext-only';
      originals.set(el, el.innerText);
    }
    document.documentElement.classList.add('te-on');
    msg(originals.size + ' text blocks editable');
  };
  const disable = () => {
    for (const el of originals.keys()) { el.removeAttribute('contenteditable'); delete el.dataset.teBlock; }
    document.documentElement.classList.remove('te-on');
  };
  const changes = () => [...originals].filter(([el, before]) => el.isConnected && el.innerText !== before)
    .map(([el, before]) => ({ before, after: el.innerText, tag: el.tagName.toLowerCase() }));

  // While editing, links and buttons must not navigate or submit.
  document.addEventListener('click', (e) => {
    if (!on || e.target.closest('[data-te-ui]')) return;
    if (e.target.closest('a,button')) e.preventDefault();
  }, true);
  document.addEventListener('input', (e) => {
    const el = e.target.closest && e.target.closest('[data-te-block]');
    if (el) el.toggleAttribute('data-te-changed', el.innerText !== originals.get(el));
  });
  addEventListener('beforeunload', (e) => { if (on && changes().length) e.preventDefault(); });

  ui.querySelector('[data-te-toggle]').onclick = () => {
    on = !on;
    on ? enable() : disable();
    ui.querySelector('[data-te-toggle]').textContent = on ? 'Stop editing' : 'Edit text';
    ui.querySelector('[data-te-save]').hidden = !on;
    if (!on) msg('');
  };
  ui.querySelector('[data-te-save]').onclick = async () => {
    const list = changes();
    if (!list.length) return msg('No changes yet');
    const res = await fetch('/__text-edits', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ page: location.pathname, changes: list }),
    });
    msg(res.ok ? 'Saved ' + list.length + ' change' + (list.length === 1 ? '' : 's') : 'Save failed');
  };
})();
`;

export function devTextEditor() {
  return {
    name: 'dev-text-editor',
    apply: 'serve',
    configureServer(server) {
      const dir = path.join(server.config.root, 'text-edits');
      server.middlewares.use('/__text-edits.js', (_req, res) => {
        res.setHeader('content-type', 'text/javascript');
        res.end(CLIENT);
      });
      server.middlewares.use('/__text-edits', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', () => {
          try {
            const { page, changes } = JSON.parse(body);
            const slug = String(page).replace(/^\/|\/$/g, '').replace(/[^a-z0-9-]/gi, '-') || 'home';
            fs.mkdirSync(dir, { recursive: true });
            const file = path.join(dir, `${slug}.json`);
            const saved = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { page, changes: [] };
            // one entry per original text; a later save of the same block wins
            const byBefore = new Map(saved.changes.map((c) => [c.before, c]));
            for (const c of changes) byBefore.set(c.before, { ...c, savedAt: new Date().toISOString() });
            saved.changes = [...byBefore.values()];
            fs.writeFileSync(file, JSON.stringify(saved, null, 2) + '\n');
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ ok: true, count: saved.changes.length }));
          } catch (err) {
            res.statusCode = 400;
            res.end(String(err));
          }
        });
      });
    },
    transformIndexHtml() {
      return [{ tag: 'script', attrs: { src: '/__text-edits.js', defer: true }, injectTo: 'body' }];
    },
  };
}
