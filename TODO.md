# Website Framework — TODO

## How to Use This File

When picking up a task:
1. Write your agent name in the **Assigned** column
2. Change status to **In Progress**
3. When done, change status to **Complete** and note the commit hash or brief summary
4. Only commit files related to your task — don't step on other agents

Do NOT work on a task that another agent has claimed. Pick tasks from the top of each section first (higher priority).

Read `SESSION_SUMMARY.md` first for full project context.

---

## Priority 1 — Core Validation (do these first)

Before polishing anything, we need proof that what we built actually works.

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Verify Dockerfile builds locally | Not Started | | `docker build -t test . && docker run -p 8080:3000 test` — verify site serves at localhost:8080, admin works. Biggest risk: single-stage Dockerfile with full source — need to confirm size and startup time are acceptable. |
| Test volume mounts for content and deploy key | Not Started | | Create `/tmp/test-content` and `/tmp/test-key` dirs, mount them with `-v`, verify content persists across `docker restart`. Verify a generated SSH key in the deploy-key volume persists. |
| Test `/website-init` skill end-to-end | Not Started | | Run in a temp directory like `/tmp/test-site`. Verify: clone works (if not from framework), content customization applied, deploy.json created with zero secrets, git init + push to test repo. Delete test repo after. |
| Test `/deploy-init` dry-run mode | Not Started | | `/deploy-init --dry-run` should show all commands without executing. Verify the output is readable and accurate. No server needed. |
| Test `/deploy` dry-run mode | Not Started | | `/deploy --dry-run` should show all commands without executing. No server needed. |
| Test `/deploy-init` against a real Linode server | Not Started | | Requires real server. Test all 14 steps. Test resume after simulated failure (kill SSH mid-deploy). Verify SSL, admin auth, deploy key all work. |
| Test `/deploy` against the deployed test site | Not Started | | Depends on `/deploy-init` test. Make a code change locally, run `/deploy`, verify site updates and rollback works on intentional failure. |
| Verify admin panel rebuild works in production container | Not Started | | SSH into container, edit content via admin panel, verify `npm run build` succeeds inside container, verify auto-commit+push via deploy key. |

## Priority 2 — Known Gaps

Stuff we explicitly discussed and meant to do but haven't.

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Add page title editing to admin panel | Not Started | | Client can't change a page's title from admin yet. Add a title input at the top of the BlockEditor view. Wire it into `handleBlocksChange`-style state. |
| Add site settings editor (name, fonts, colors) | Not Started | | Add a "Settings" button in the PageSidebar alongside "Navigation". New `SiteSettingsEditor` component that edits `siteName`, `fonts.heading`, `fonts.body`, `colors.*`. API route `/api/admin/site` already supports PUT. |
| Build `/deploy-status` skill | Not Started | | Mentioned early in planning but never built. SSH to server, report: container running? which version? SSL cert expiry date? disk/memory usage? last commit timestamp? Useful for checking on sites you haven't touched in months. |
| Delete `content/pages/test.json` from framework repo | Not Started | | Leftover from development. `/website-init` already deletes it during scaffold, but it shouldn't exist in the framework repo itself. |
| Audit and remove unused files | Not Started | | `nginx.conf` at repo root — was for old Docker setup, likely unused now. Check if any other dev artifacts remain. |

## Priority 3 — Admin Panel Polish

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Resizable admin panel dividers | Complete | Opus-Beta | Draggable `ResizeHandle` between sidebar/editor and editor/preview. Widths clamp and persist to localStorage. |
| Better loading/saving states | Not Started | | Show skeleton loaders while fetching pages. Show progress during rebuild (can take 5-15s). Disable save button while saving. Currently just shows "Saving..." text. |
| Error handling polish | Not Started | | Better error messages, toast notifications instead of red banner, retry buttons. Use shadcn toast/sonner if available. |
| Mobile responsive admin panel | Not Started | | Admin panel is desktop-only. Sidebar collapses, editor stacks above preview on mobile. Low priority — clients usually edit on desktop. |
| Add block drag-and-drop reordering | Not Started | | Currently uses up/down arrows. Could use `@dnd-kit/core` for drag-and-drop. Nice-to-have. |
| Block type switching | Not Started | | Right now if you want to change a heading to a paragraph, you delete + re-add. Could add a "Change type" dropdown per block. |
| Confirm dialog before deleting a block | Not Started | | Currently deletes instantly with no undo. Add a confirm dialog or a "deleted" banner with undo. |
| Show page URL preview in editor | Not Started | | When editing `about`, show `https://{domain}/about` at the top. Helps client understand URL structure. |
| Keyboard shortcuts | Not Started | | `Cmd+S` to save, `Esc` to close dialogs, arrow keys to navigate blocks. Low priority. |

## Priority 4 — Content System

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Add rich text editing for paragraphs | Not Started | | Currently plain textarea. Could use a simple markdown editor or basic formatting (bold, italic, links). Tiptap or Lexical. |
| Add video embed block | Not Started | | YouTube/Vimeo embeds. Paste URL → extract ID → render iframe. Editable fields: url, autoplay, loop. |
| Add gallery block | Not Started | | Grid of images. Reuses image upload. Editable: images array, columns (2/3/4), gap. |
| Add testimonial block | Not Started | | Quote, author name, author title, optional photo. |
| Add FAQ accordion block | Not Started | | Array of question/answer pairs. Uses shadcn Accordion. |
| Add contact form block | Not Started | | Form with name, email, message. Needs API route `/api/admin/contact-submit` + email sending (Resend or store in JSON). |
| Add social links block | Not Started | | Row of icons linking to social profiles. Editable: platform, URL per item. |
| Add spacer block with custom height | Not Started | | Simple vertical spacer. Editable: height in pixels or rem. |
| Add hero block | Not Started | | Large heading + subtitle + background image + CTA button. Common landing page pattern. |
| Add two-column layout block | Not Started | | Side-by-side content. Each column can contain other blocks (nested). Complex but powerful. |
| Content validation on save | Not Started | | `validatePageContent` in `lib/admin.ts` could be more thorough. Validate block-specific fields (image src is valid path, button href is URL format, card grid has at least 1 card). |
| Content migration script | Not Started | | When block schemas change, existing content may need updating. Write a script that reads all JSON files and upgrades them to the new format. |

## Priority 5 — Testing

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| API route tests | Not Started | | Test all CRUD endpoints with mock requests. Pages list + create, pages GET/PUT/DELETE, upload (MIME validation), rebuild (concurrent lock, git failure handling). Use temp directory for `CONTENT_DIR`. |
| Admin helper tests — writePage/deletePage | Not Started | | Test file I/O helpers with temp directories. Atomic write verification. |
| Admin component tests — BlockEditor reorder | Not Started | | Test that moveBlock up/down produces correct new arrays. Test delete removes correct index. |
| Admin component tests — PageSidebar dialogs | Not Started | | Test add page dialog, delete confirmation. |
| Admin component tests — NavEditor | Not Started | | Test reorder, add, remove, add from pages. |
| E2E tests with Playwright | Not Started | | Full admin flow: visit /admin (add test auth bypass), select page, edit block, save, verify preview iframe updates. |
| Test rebuild lock (concurrent rebuilds) | Not Started | | Kick off two rebuilds simultaneously, verify second returns 409. |
| Test slug validation | Not Started | | Reject path traversal attempts (`../etc/passwd`), uppercase, special chars. |
| Test image upload MIME validation | Not Started | | Upload text file with `.jpg` extension → should reject. Upload real image → should accept. Upload 6MB file → should reject. |
| Increase coverage to 80%+ | Not Started | | Currently 64% overall. Primary gaps: `lib/admin.ts` git/rebuild functions, new block components. |

## Priority 6 — Documentation

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Add CONTRIBUTING.md | Not Started | | How to add block types, how to modify the admin panel, how to customize templates. How to submit PRs. |
| Add deployment troubleshooting guide | Not Started | | Common issues: DNS propagation, Certbot failures, Docker build errors, port conflicts, deploy key registration. Should be readable by a developer who's never deployed before. |
| Add LICENSE file | Not Started | | README mentions MIT but no LICENSE file exists. Add the standard MIT text. |
| Add a demo video or GIF to README | Not Started | | Show the admin panel in action. Optional but helpful for adoption. |
| Document each skill file structure | Not Started | | The SKILL.md files have specific format. Document this for anyone writing new skills. |
| Add code comments for the BlockRenderer contract | Not Started | | Explain the registry pattern and why adding a new block type requires updating 6+ files. |

## Priority 7 — Framework Polish

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Add `npm run preview` script | Not Started | | Builds Docker image locally and runs it on localhost:4000. Lets developer test the production container without touching prod. Mentioned early in planning. |
| Add health check endpoint | Not Started | | `/api/health` returns `{ok: true, version: "..."}`. Used by Docker HEALTHCHECK and external monitoring. |
| Add Dockerfile HEALTHCHECK directive | Not Started | | `HEALTHCHECK CMD curl -f http://localhost:3000/api/health || exit 1`. Makes Docker restart crashed containers. |
| Add container logs rotation | Not Started | | By default Docker logs grow unbounded. Configure log rotation in Dockerfile or docker run flags. |
| Add SSL auto-renewal verification | Not Started | | Certbot sets up auto-renewal, but we should verify it's working. Maybe a `/deploy-status` check. |
| Docker image cleanup on deploy | Not Started | | `/deploy-init` builds a new image for each site. Over time old images accumulate. Should clean up untagged images periodically. |
| Handle Nginx config conflicts | Not Started | | If two sites try to use the same domain, Nginx config conflicts. `/deploy-init` should detect and warn. |
| Support www → apex redirect | Not Started | | Many sites want `www.example.com` → `example.com`. Nginx config should handle this. `/deploy-init` could ask if both should point to the site. |
| Support multi-domain sites | Not Started | | Client has example.com AND myexample.com pointing to the same site. Deploy-init should allow multiple domains. |
| Rate limiting on admin API | Not Started | | Nginx basic auth is the primary defense, but adding rate limiting prevents brute force. |

## Priority 8 — Additional Skills

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Build `/deploy-status` skill | Not Started | | Report: container status, last commit, SSL expiry, disk usage, memory, recent logs. Mentioned in Priority 2. |
| Build `/deploy-logs` skill | Not Started | | Tail the container logs. `ssh {alias} "docker logs {container} -f --tail 50"`. |
| Build `/deploy-rollback` skill | Not Started | | Manually roll back to a specific commit. Lists recent commits, lets developer pick one, reruns the rollback flow. |
| Build `/deploy-down` skill | Not Started | | Take a site offline (stop container, leave everything else). For maintenance or if client stops paying. |
| Build `/deploy-up` skill | Not Started | | Bring a stopped site back up. |
| Build `/deploy-destroy` skill | Not Started | | Nuclear option: stop container, remove image, delete Nginx config, delete htpasswd, delete SSL cert. Multiple confirmations required. |

## Priority 9 — Future / Nice-to-Have

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Template system | Not Started | | Multiple starter templates beyond portfolio (business, restaurant, landing page). Template picker in `/website-init`. |
| Dark mode support | Not Started | | Client toggles in admin panel. shadcn theme already supports dark mode — just needs a toggle and persistence. |
| Content versioning / undo UI | Not Started | | Git history exists but no UI to browse or revert. Could show recent changes in admin panel with "restore this version" button. |
| Multi-user admin | Not Started | | Currently one password per site. Could support multiple users with different permissions. Probably overkill. |
| Object storage migration | Not Started | | For image-heavy sites, move uploads to Linode Object Storage / S3 instead of git. Per-site decision. |
| Analytics integration | Not Started | | Simple page view tracking. No third-party scripts. Could use a lightweight self-hosted option like Plausible or Umami. |
| SEO meta editor | Not Started | | Admin panel section for page meta tags (title, description, OG image, Twitter card). Currently only `title` is set via page content. |
| Sitemap.xml generation | Not Started | | Auto-generate from `content/pages/*.json`. Needed for SEO. |
| robots.txt | Not Started | | Simple robots.txt at root. Should allow all by default. |
| Draft mode | Not Started | | Client can save changes without publishing. Requires a separate "published" vs "draft" state for each page. |
| Preview mode | Not Started | | Share a preview link with client before going live. Token-based URL that bypasses the rebuild requirement. |
| Scheduled publishing | Not Started | | Client sets a publish date for a page. Requires a cron job or scheduled task system. |
| Multi-language support | Not Started | | i18n for content. Each page has content per language. Client picks language in admin. |

## Priority 10 — Open Source Prep

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Add LICENSE file (MIT) | Not Started | | Standard MIT text. README claims MIT. |
| Add CODE_OF_CONDUCT.md | Not Started | | Standard Contributor Covenant. |
| Add issue templates | Not Started | | Bug report, feature request, deployment issue. |
| Add PR template | Not Started | | Checklist: tests pass, docs updated, block types registered in all files. |
| Set up GitHub Actions CI | Not Started | | Run tests on every push. Build check. Lint check. |
| Add security policy | Not Started | | How to report security issues. |
| Publish to npm | Not Started | | Make `/website-init` install via npx? Probably not needed if using the SKILL.md approach. |

---

## Completed

| Task | Completed By | Commit | Summary |
|------|--------------|--------|---------|
| Framework skeleton | | | Next.js + TypeScript + content system + block renderer |
| 7 block types (heading, paragraph, image, badge-group, card-grid, button, separator) | | | All typed, rendered, editable |
| Admin panel UI | | | Page editor, block gallery, nav editor, live preview iframe |
| API routes for content CRUD | | | pages, site, upload, rebuild endpoints |
| shadcn/ui integration | | | Button, Card, Badge, Separator, Dialog, Input, Textarea, Label, Select |
| Tailwind CSS v4 | | | Full migration from vanilla CSS |
| Route group structure | | | `(site)` for public, `/admin` bare layout |
| 40 unit tests passing | | | Jest + RTL, content loader + blocks + admin helpers |
| Dockerfile (single-stage with full source) | | | Supports in-container rebuilds |
| ARCHITECTURE.md with Mermaid diagrams | | | Full system + deploy flows |
| CLAUDE.md agent context | | | Framework conventions and skill list |
| `/website-init` skill | Opus-Alpha | | Scaffolds new client sites |
| `/deploy-init` skill | Opus-Alpha | | First-time server deployment wizard |
| `/deploy` skill | Opus-Alpha | 1359218 | Repeatable deploys with auto-rollback |
| SESSION_SUMMARY.md | Opus-Alpha | | Cross-agent context handoff |
| TODO.md | Opus-Alpha | | Multi-agent task tracking |
| Resizable admin panel dividers | Opus-Beta | | Draggable ResizeHandle, persists to localStorage |
