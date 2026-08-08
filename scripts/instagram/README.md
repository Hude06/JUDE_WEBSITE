# Instagram post kit

Generates Instagram-ready crops of judemakes.com and the client sites listed in
its "Selected work" grid.

## Run it

```bash
npm install
npm run dev                                  # serve the portfolio locally

node scripts/instagram/discover.mjs          # read the work list from the page
node scripts/instagram/probe.mjs             # check which sites are reachable
node scripts/instagram/shoot.mjs             # render instagram/<slug>/*.png
node scripts/instagram/verify.mjs            # exact sizes + duplicate check
node scripts/instagram/contact-sheet.mjs 4x5 # review sheet for one ratio
```

`discover.mjs` and `shoot.mjs` take an optional base URL; both default to
`http://127.0.0.1:3000`. Point them at `https://judemakes.com` to shoot the
deployed site instead of a local dev server.

`capture.mjs` is a separate archival pass — it writes untrimmed full-page and
tight element PNGs to `instagram/_raw/` at desktop @2x and mobile @3x. Useful
source material, not part of the delivered kit.

## What each script does

| Script | Role |
| --- | --- |
| `discover.mjs` | Parses `#work` in the live DOM for name, year, tagline, domain, status. Nothing about the client list is hardcoded, so it stays current as work is added. |
| `probe.mjs` | Loads each site in real Chromium with a desktop user-agent and reports HTTP status. Some hosts refuse obvious bot traffic. |
| `shoot.mjs` | The production pass. Derives a page *region* per shot and ratio, screenshots it, downsamples to 1080px wide. |
| `verify.mjs` | Asserts exact output dimensions and finds byte-identical files. |
| `contact-sheet.mjs` | Tiles one ratio into a single sheet for eyeballing crops. |
| `browser.mjs` | Resolves the pre-installed Chromium so Playwright never downloads one. |
| `shots.mjs` | The shot plan, plus the page-settling and animation-freezing helpers. |

## Why regions instead of cropping a screenshot

Cropping a tight element shot down to 9:16 leaves a narrow sliver: it upscales
(soft text) and it composes badly, slicing through a row of cards. Instead each
shot starts from the element's bounding box, expands it to the exact target
aspect ratio, clamps it to the page, and screenshots that. Regions only ever
grow *vertically* — narrowing a desktop layout to reach 9:16 cuts through the
text — so when a page is too short to supply the height, the shot falls back to
the phone layout, which reflows tall and narrow naturally.

Three rules keep the output honest, all enforced by `verify.mjs` and the
`upscaled` / `narrowed` flags in `instagram/_render.json`:

- **Never upscale.** The captured region is always at least 1080px wide.
- **Never stretch or letterbox.** The region already has the target aspect
  ratio, so the resize is a pure downsample.
- **Never slice a heading.** Frames anchor to the top of the section, absorbing
  a short preceding heading block when there is one.

## Gotchas worth knowing

- `.site-header` is `position: sticky`. In a full-page screenshot it paints
  partway down the image, over whatever is being shot, so it is forced to
  `static` during capture. (`absolute` also un-sticks it, but pulling it out of
  flow lets the hero slide up underneath and collide with it on mobile.)
- The film-grain and aurora layers on `body::before` / `body::after` are
  `position: fixed` and only cover one viewport, banding a tall capture. They
  are hidden during capture.
- Scroll-reveal wrappers start transparent. Animations are frozen and reveal
  state is forced so nothing is captured mid-fade.
- CSS-module class names carry a build hash, so selectors match on class
  substrings. `#work` and `.steps-block` are stable and used directly.
