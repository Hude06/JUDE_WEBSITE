---
name: website-init
description: Scaffold a new client website from the website-framework repo. Creates a private GitHub repo, customizes starter content, installs dependencies, and pushes first commit. Run this in an empty directory to start a new client site.
---

# Website Init

Scaffold a new client website from the `Hude06/website-framework` GitHub repo.

## When to Activate

- Developer types `/website-init`
- Developer says "new site", "scaffold a site", "start a new client website", "init a website"

## Security Rules — READ FIRST

These rules are non-negotiable. Violating any of them is a critical failure.

1. **NEVER display, log, commit, or store** SSH keys, GitHub tokens, passwords, or any secrets
2. **NEVER use raw GitHub API calls with tokens** — always use the `gh` CLI
3. **NEVER SSH to any remote server** — this skill is LOCAL ONLY
4. **NEVER put secrets in deploy.json** — only file paths and non-secret config
5. **NEVER put secrets in any file that gets committed to git**
6. **Before displaying command output**, scan for token patterns (strings starting with `ghp_`, `gho_`, `ssh-`, `-----BEGIN`) and redact them
7. **deploy.json references key paths** (e.g., `~/.ssh/id_ed25519`), never contains the key itself

## Preflight Checks

Run these BEFORE asking any questions. If any fail, show the error and STOP.

1. **Check tools exist:**
   ```
   which gh && which npm && which git
   ```
   If any missing: "Required tool not found: {tool}. Install it and try again."

2. **Check GitHub auth:**
   ```
   gh auth status
   ```
   If not authenticated: "GitHub CLI is not authenticated. Run `! gh auth login` and try again."
   If authenticated: show which account is active, ask developer to confirm it's correct.

3. **Detect environment:**

   Check if the framework is already present by looking for `package.json` with `"name": "website-framework"`:
   
   - **Framework already here:** Skip the clone step entirely. The developer either cloned the repo manually or is running the skill from within the framework. Just sever the git link (`rm -rf .git`) and proceed to customization.
   - **Empty directory:** Will need to clone the framework first.
   - **Non-empty directory without framework:** Warn "This directory has files but doesn't look like the website-framework. /website-init works in either an empty directory or a freshly cloned framework. Proceed anyway?" If denied: STOP.

## Information Gathering

Ask ALL of these in a single message. Do not ask one at a time.

**Required:**
- **Site name** — the display name (e.g., "Jane's Photography")
- **Client name** — kebab-case identifier used for repo name and package name (e.g., "jane-photography"). Must match `^[a-z0-9-]+$`. Suggest one derived from the site name.

**Optional (provide defaults):**
- **Domain** — production domain if known (e.g., "janephotography.com"). Default: blank.
- **Contact email** — client's email for the contact page. Default: "hello@example.com"
- **Primary color** — hex color for the site's primary accent. Default: "#2563eb"
- **Description** — one-line site description. Default: derived from site name.

The GitHub repo will be named `{clientName}-site` (e.g., `jane-photography-site`). Mention this to the developer.

## Execution Steps

After gathering info, execute these steps in order. Show progress for each step.

### Step 1: Get Framework

**If the framework is already in the directory** (detected in preflight):
```bash
rm -rf .git
```
Just sever the git link. The code is already here.

**If the directory is empty** (skill installed globally):
```bash
gh repo clone Hude06/website-framework . -- --depth 1
rm -rf .git
```
Clone the latest framework and sever the link. If the clone fails, check network connectivity and repo access.

### Step 2: Customize Content Files

Edit these files with the developer's answers:

**`content/site.json`:**
- Set `siteName` to the provided site name
- Set `colors.primary` to the provided primary color
- Keep nav, fonts, and other colors as defaults

**`content/pages/home.json`:**
- Change the first heading block's `text` from "Welcome to My Portfolio" to "Welcome to {siteName}"

**`content/pages/contact.json`:**
- Replace `hello@example.com` with the provided contact email in the paragraph block

**Delete test fixtures:**
- Delete `content/pages/test.json` if it exists (test page from development)

**`package.json`:**
- Set `name` to the client name (kebab-case)
- Set `description` to the provided description
- Keep everything else unchanged

### Step 3: Create deploy.json

Write this file with the provided values. Leave server fields blank — they get filled by `/deploy-init` later.

```json
{
  "site": {
    "name": "{clientName}-site",
    "domain": "{domain or empty string}",
    "repo": "{gh-username}/{clientName}-site"
  },
  "server": {
    "host": "",
    "user": "",
    "sshKeyPath": "~/.ssh/id_ed25519",
    "port": 22
  },
  "docker": {
    "containerName": "{clientName}-site",
    "port": 3001
  },
  "status": "not-deployed"
}
```

Use the actual authenticated GitHub username from `gh auth status` for the `repo` field.

**SECURITY:** This file contains ZERO secrets. `sshKeyPath` is a file path reference, not the key.

### Step 4: Write Client README

Replace `README.md` with a simple client-specific version:

```markdown
# {siteName}

{description}

## Local Development

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 for the site, http://localhost:3000/admin for the admin panel.

## Deployment

Run `/deploy-init` in Claude for first-time server setup, then `/deploy` for updates.

## Content

Edit content through the admin panel or directly in these files:

- Pages: `content/pages/*.json`
- Site config: `content/site.json`
- Uploads: `content/uploads/`

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for full system diagrams.
```

### Step 5: Install Dependencies

```bash
npm install
```

If this fails, try:
```bash
rm -rf node_modules package-lock.json && npm install
```

### Step 6: Verify Build

```bash
npm run build
```

The build MUST pass before committing. If it fails:
1. Read the error output carefully
2. Attempt to fix the issue
3. Rebuild (max 2 retries)
4. If still failing, tell the developer — this may be a framework bug

### Step 7: Initialize Git and Create Repo

```bash
git init
git add -A
git commit -m "feat: initial site scaffold for {siteName}"
```

Then create the private GitHub repo:

```bash
gh repo create {clientName}-site --private --source=. --remote=origin --push
```

If the repo name is already taken:
- Tell the developer: "The repo name {clientName}-site already exists."
- Ask for an alternative name
- Retry with the new name

### Step 8: Print Summary

After everything succeeds, print:

```
Site scaffolded successfully!

  Repo:   https://github.com/{username}/{clientName}-site
  Local:  npm run dev → http://localhost:3000
  Admin:  http://localhost:3000/admin

Next steps:
  1. Run `npm run dev` to start developing
  2. Customize the site with Claude
  3. Run `/deploy-init` when ready to deploy to production
```

## Error Recovery

- **Clone fails:** Check internet, check repo exists (`gh repo view Hude06/website-framework`)
- **npm install fails:** Delete `node_modules` and `package-lock.json`, retry
- **Build fails:** Read error, attempt fix, retry up to 2 times
- **gh repo create fails (name taken):** Ask developer for alternative repo name
- **gh repo create fails (auth):** Run `gh auth status`, suggest `! gh auth login`
- **Any catastrophic failure:** Leave directory as-is so developer can inspect. Do not clean up.

## What NOT to Do

- Do not run `npm run dev` — just tell the developer to run it
- Do not open a browser
- Do not SSH to any server
- Do not create `.env` files (no secrets needed at this stage)
- Do not modify the framework's CLAUDE.md or AGENTS.md
- Do not modify ARCHITECTURE.md
- Do not add extra dependencies beyond what the framework includes
