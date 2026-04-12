# Website Framework — TODO

## How to Use This File

When picking up a task:
1. Write your agent name in the **Assigned** column
2. Change status to **In Progress**
3. When done, change status to **Complete** and note the commit hash

Do NOT work on a task that another agent has claimed.

---

## Skills

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Build `/deploy` skill | Complete | Opus-Alpha | Deploy skill at `.claude/skills/deploy/SKILL.md`. Pre-deploy pull, uncommitted changes check, container rebuild, health checks with auto-rollback on failure. Dry-run mode supported. |
| Test `/website-init` skill end-to-end | Not Started | | Scaffold a real test site in a temp directory, verify everything works, delete after. |
| Test `/deploy-init` skill end-to-end | Not Started | | Requires a real server. Test all 14 steps including dry-run mode and resume after failure. |
| Test `/deploy` skill end-to-end | Not Started | | Depends on `/deploy` being built first. |

## Dockerfile & Docker

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Verify Dockerfile builds and runs locally | Not Started | | `docker build -t test . && docker run -p 8080:3000 test` — verify site serves, admin works. |
| Test volume mounts for content and deploy key | Not Started | | Verify content persists across container restarts. Verify deploy key volume works. |

## Admin Panel

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Resizable admin panel dividers | Complete | Opus-Beta | Draggable `ResizeHandle` between sidebar/editor and editor/preview. Widths clamp and persist to localStorage. |
| Add block drag-and-drop reordering | Not Started | | Currently uses up/down arrows. Could use a drag library for better UX. Low priority. |
| Add page title editing | Not Started | | Client can't change a page's title from the admin panel yet. Need a title field at the top of the editor. |
| Add site settings editor | Not Started | | Edit site name, fonts, colors from admin panel. Currently only nav is editable. The API route `/api/admin/site` already supports PUT. |
| Mobile responsive admin panel | Not Started | | Admin panel is desktop-only. Sidebar collapses, editor stacks above preview on mobile. |
| Better loading/saving states | Not Started | | Show skeleton loaders while fetching pages. Show progress during rebuild (can take 5-15s). |
| Error handling polish | Not Started | | Better error messages, toast notifications instead of red banner, retry buttons. |

## Content System

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Add rich text editing for paragraphs | Not Started | | Currently plain textarea. Could use a simple markdown editor or basic formatting (bold, italic, links). |
| Add more block types | Not Started | | Ideas: video embed, gallery, testimonial, FAQ accordion, contact form, social links, spacer with custom height. |
| Content validation on save | Not Started | | `validatePageContent` exists but could be more thorough. Validate block-specific fields (e.g., image src is a valid path). |

## Testing

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| API route tests | Not Started | | Test all CRUD endpoints with mock requests. See plan in SESSION_SUMMARY.md Phase 3. |
| Admin component tests | Not Started | | BlockEditor, PageSidebar, NavEditor rendering and interaction tests. |
| E2E tests with Playwright | Not Started | | Full admin flow: select page, edit block, save, verify preview updates. Behind basic auth which complicates setup. |
| Increase coverage to 80%+ | Not Started | | Currently 64% overall. Need tests for admin helpers (writePage, deletePage) and new block components. |

## Documentation

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Add contributing guide | Not Started | | How to add block types, how to modify the admin panel, how to customize templates. |
| Add deployment troubleshooting guide | Not Started | | Common issues: DNS propagation, Certbot failures, Docker build errors, port conflicts. |

## Future (Not Urgent)

| Task | Status | Assigned | Notes |
|------|--------|----------|-------|
| Template system | Not Started | | Multiple starter templates beyond the portfolio (business, restaurant, landing page). Template picker in `/website-init`. |
| Theme switching | Not Started | | Dark mode support. Client can toggle in admin panel. |
| Content versioning / undo | Not Started | | Git history exists but no UI to browse or revert. Could show recent changes in admin panel. |
| Multi-user admin | Not Started | | Currently one password per site. Could support multiple users with different permissions. Probably overkill. |
| Object storage migration | Not Started | | For image-heavy sites, move uploads to Linode Object Storage / S3 instead of git. Per-site decision. |
| Analytics integration | Not Started | | Simple page view tracking. No third-party scripts. Could use a lightweight self-hosted option. |
| Contact form handler | Not Started | | Block type for contact forms. Needs an API route to handle submissions. Email via SendGrid/Resend or store in JSON. |
