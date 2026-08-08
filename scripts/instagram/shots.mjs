/**
 * Shared capture plan and page-preparation helpers.
 *
 * Selectors use class substrings because CSS-module class names carry a build
 * hash; `#work` and `.steps-block` are stable and used directly.
 *
 * `bias: 'top'` marks hero-like shots that should anchor to the top of the
 * page rather than centre on the element.
 */
export const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
export const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';

/**
 * `prefer: 'mobile'` pins a shot to the phone layout for every ratio (these are
 * the deliberately responsive deliverables). Everything else starts on desktop
 * and falls back to mobile per-ratio when the desktop page is too short to
 * supply the aspect ratio at full width — narrowing a desktop layout to fit
 * 9:16 slices the text, so the phone layout is used instead.
 */
export const PLANS = {
  judemakes: [
    {
      page: '/',
      shots: [
        { name: 'hero', selector: '[class*="JudeHeroBlock"][class*="root"]', bias: 'top' },
        { name: 'work-grid', selector: '#work' },
        { name: 'how-it-works', selector: '.steps-block' },
        { name: 'off-hours', selector: '[class*="PhotoStripBlock"][class*="root"]' },
        { name: 'home-full', fullPage: true, bias: 'top' },
        {
          name: 'hero-mobile',
          selector: '[class*="JudeHeroBlock"][class*="root"]',
          bias: 'top',
          prefer: 'mobile',
        },
        { name: 'work-grid-mobile', selector: '#work', prefer: 'mobile' },
      ],
    },
    {
      page: '/projects',
      shots: [{ name: 'projects-list', selector: '[class*="CardGridBlock"][class*="listRoot"]' }],
    },
    {
      page: '/about',
      shots: [
        { name: 'about-steps', selector: '.steps-block' },
        { name: 'about-photos', selector: '[class*="PhotoStripBlock"][class*="root"]' },
      ],
    },
    {
      page: '/contact',
      shots: [
        { name: 'contact', selector: '[class*="ContactFormBlock"][class*="root"]' },
        {
          name: 'contact-mobile',
          selector: '[class*="ContactFormBlock"][class*="root"]',
          prefer: 'mobile',
        },
      ],
    },
  ],
};

/**
 * Applied only to region captures.
 *
 * A `position: sticky` header follows the viewport, so in a full-page
 * screenshot it gets painted partway down the image, on top of whatever
 * section is being shot. `static` keeps it in the document flow at the very
 * top — visible on top-anchored shots, absent from mid-page ones. (`absolute`
 * would also un-stick it, but pulling it out of flow lets the hero slide up
 * underneath and collide with it on the phone layout.)
 *
 * The film-grain and aurora layers are `position: fixed` and only cover one
 * viewport, which bands a tall capture. They are decorative at 3% opacity, so
 * drop them.
 */
export const REGION_CSS = `
  .site-header { position: static !important; }
  body::after, body::before { display: none !important; }
`;

export const FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  /* Reveal-on-scroll wrappers start transparent; force their settled state so
     nothing is captured mid-fade. */
  .scroll-reveal, [class*="reveal"], [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
    clip-path: none !important;
  }
`;

const CONSENT_PATTERNS = [
  /^(accept|allow|agree|got it|ok|okay|i agree|accept all|allow all)/i,
  /^(close|dismiss|no thanks|continue)/i,
];

export async function dismissOverlays(page) {
  const buttons = await page.$$('button, a[role="button"], [role="dialog"] button');
  for (const btn of buttons) {
    const label = ((await btn.textContent().catch(() => '')) || '').trim();
    if (!label || label.length > 30) continue;
    if (CONSENT_PATTERNS.some((re) => re.test(label))) {
      await btn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(300);
    }
  }
  await page.keyboard.press('Escape').catch(() => {});
}

/**
 * Wait for the network, dismiss consent UI, freeze animations, scroll the full
 * page to trigger lazy images, return to the top and let fonts settle.
 */
export async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await dismissOverlays(page);
  await page.addStyleTag({ content: `${FREEZE_CSS}\n${REGION_CSS}` }).catch(() => {});

  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    const height = () => document.body.scrollHeight;
    for (let y = 0; y < height(); y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, height());
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  await page
    .evaluate(async () => {
      const imgs = Array.from(document.images).filter((i) => i.currentSrc || i.src);
      await Promise.all(
        imgs.map((i) => (i.complete && i.naturalWidth > 0 ? Promise.resolve() : i.decode().catch(() => {}))),
      );
    })
    .catch(() => {});

  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(1000);
}
