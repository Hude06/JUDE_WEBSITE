---
name: deploy
description: Deploy code updates to a live client site. Pulls latest content from GitHub, merges with local changes, pushes, then triggers rebuild on the server with automatic rollback on failure. Requires /deploy-init to have been run first.
---

# Deploy

Push code updates to a production client site. This is the repeatable deploy command — run it every time you want to ship changes. For first-time server setup, use `/deploy-init` instead.

## When to Activate

- Developer types `/deploy`
- Developer says "ship it", "deploy this", "push to production", "update the live site"
- Developer types `/deploy --dry-run` for a preview without executing

## Security Rules — READ FIRST

1. **NEVER read, display, or transmit SSH private keys or deploy key files**
2. **NEVER store or display passwords** — htpasswd was set during `/deploy-init`, nothing to change here
3. **NEVER commit secrets** — deploy.json stays secret-free
4. **Scan all command output before displaying** — redact anything matching `-----BEGIN`, `ssh-ed25519 AAAA` (private format), password patterns. Public keys are safe.
5. **Use `-o BatchMode=yes`** on all SSH commands to prevent password prompts from hanging
6. **Confirm destructive operations** — specifically, confirm before running git commands that could overwrite work (force push, reset --hard on shared branches)
7. **Never skip the pre-deploy pull** — always merge remote changes before pushing. Client content edits live in the remote repo and must not be overwritten.

## Dry-Run Mode

If the developer says `/deploy --dry-run` or "dry run":
- Walk through every step
- Show every command that WOULD be executed
- Execute NOTHING
- End with: "Run `/deploy` to execute these steps for real."

## Preflight Checks

Run ALL of these before doing anything. If any fail, STOP.

1. **deploy.json exists and is valid:**
   ```bash
   cat deploy.json
   ```
   Must have `status: "deployed"`. If `"not-deployed"` or `"deploying:*"`: "This site hasn't been fully deployed yet. Run `/deploy-init` first."

2. **Required fields:**
   `site.domain`, `site.repo`, `server.sshAlias`, `server.sitesDir`, `docker.containerName` must all be populated.

3. **Tools exist:**
   ```bash
   which git && which ssh
   ```

4. **Local repo is a git repo and has a remote:**
   ```bash
   git remote get-url origin
   ```
   Must match `deploy.json` → `site.repo`. If not: "Local repo doesn't match the deployment repo. Aborting."

5. **SSH connection works:**
   ```bash
   ssh -o ConnectTimeout=5 -o BatchMode=yes {sshAlias} "echo OK"
   ```
   If fails: "SSH connection failed. Check your SSH config." STOP.

6. **Server state is healthy:**
   ```bash
   ssh {sshAlias} "docker ps --filter name={containerName} --format '{{.Status}}'"
   ```
   Must show container running. If missing: "Container not running on server. Run `/deploy-init` or investigate." STOP.

## Execution Steps

Execute in order. Show progress for each step.

### Step 1: Pull Latest from Remote

**This is critical — never skip.** The client may have edited content via the admin panel, which auto-commits and pushes to GitHub. Your local repo could be behind.

```bash
git fetch origin
```

Check if there are commits on remote that aren't local:
```bash
git log HEAD..origin/main --oneline
```

If there are remote commits:
- Show the developer what commits are coming in (likely content edits from the client)
- Run: `git pull --no-rebase origin main`
- If merge conflict: STOP. "Merge conflict. Resolve manually, then run `/deploy` again." Show the conflicted files.
- If clean merge: proceed.

If no remote commits: proceed.

### Step 2: Check for Uncommitted Changes

```bash
git status --porcelain
```

If there are uncommitted changes:
- STOP. "You have uncommitted changes. Commit them first, then run `/deploy` again."
- Show what's uncommitted
- DO NOT auto-commit. The developer should write real commit messages.

### Step 3: Check for Unpushed Commits

```bash
git log origin/main..HEAD --oneline
```

If there are unpushed commits:
- Show them to the developer
- Ask for confirmation: "Push {N} commits to GitHub and deploy?"
- On yes: continue
- On no: STOP

If no unpushed commits AND no remote changes from Step 1:
- Tell the developer: "Nothing to deploy — local and remote are already in sync."
- Offer: "Force a rebuild anyway? (useful if server is out of sync)"
- If no: STOP
- If yes: skip to Step 5

### Step 4: Push to GitHub

```bash
git push origin main
```

If push fails:
- Show the error
- If it's a "non-fast-forward" error: remote got new commits between fetch and push. Run Step 1 again.
- Otherwise: STOP

### Step 5: Deploy on Server

This is where the actual deploy happens. The container does git pull + rebuild.

CONFIRM before executing.

Commands (executed via SSH in sequence, NOT parallel):

```bash
# Save current commit hash for rollback
OLD_COMMIT=$(ssh {sshAlias} "docker exec {containerName} sh -c 'cd /app && git rev-parse HEAD'")

# Pull latest
ssh {sshAlias} "docker exec {containerName} sh -c 'cd /app && git fetch origin && git reset --hard origin/main'"

# Rebuild
ssh {sshAlias} "docker exec -e SKIP_TYPE_CHECK=1 -e NODE_ENV=production {containerName} sh -c 'cd /app && npm run build'"
```

Show the build output as it happens. If the build fails, jump to Step 7 (rollback).

### Step 6: Health Check

```bash
# Container still running
ssh {sshAlias} "docker ps --filter name={containerName} --format '{{.Status}}'"

# Site responds over HTTPS
curl -s -o /dev/null -w '%{http_code}' https://{domain}/
# Expect 200

# Admin returns 401 (auth working)
curl -s -o /dev/null -w '%{http_code}' https://{domain}/admin
# Expect 401
```

If all pass: proceed to Step 8 (success).
If any fail: proceed to Step 7 (rollback).

### Step 7: Rollback (only on failure)

If rebuild or health check fails, roll back to the previous commit:

```bash
ssh {sshAlias} "docker exec {containerName} sh -c 'cd /app && git reset --hard {OLD_COMMIT}'"
ssh {sshAlias} "docker exec -e SKIP_TYPE_CHECK=1 -e NODE_ENV=production {containerName} sh -c 'cd /app && npm run build'"
```

Verify rollback worked:
```bash
curl -s -o /dev/null -w '%{http_code}' https://{domain}/
# Expect 200
```

Show the developer:
- What failed (build error or health check failure)
- That the site is back to the previous working version
- The error logs from the failed build

STOP. Do not update deploy.json. Do not declare success.

### Step 8: Print Summary (success only)

```
Deploy complete!

  Site:    https://{domain}
  Commit:  {git log -1 --oneline}
  Server:  {sshAlias}

Next steps:
  - Visit https://{domain} to verify
  - Check logs: ssh {sshAlias} "docker logs {containerName} --tail 20"
```

## Error Recovery

| Error | Action |
|-------|--------|
| SSH connection fails | Check SSH config, key permissions. STOP. |
| Merge conflict on pull | Show conflicted files. Developer resolves manually. STOP. |
| Push rejected (non-fast-forward) | Someone pushed to remote. Pull and retry. |
| Container not running on server | Investigate with `docker ps -a`. May need `/deploy-init` again. STOP. |
| Git pull fails inside container | Check deploy key on GitHub. Show error. STOP — no rollback needed (nothing changed). |
| Build fails | Automatic rollback via git reset + rebuild. Show error output. |
| Health check fails after rebuild | Automatic rollback. Show what failed. |
| Rollback itself fails | CRITICAL. Site may be broken. Show all errors, tell developer to SSH in and investigate. |

## What NOT to Do

- Do not auto-commit uncommitted changes — make developer do it
- Do not force push — ever
- Do not skip the pre-deploy pull — you'll overwrite client content
- Do not modify Nginx config — that's `/deploy-init` territory
- Do not modify the Dockerfile from here
- Do not restart the container — git pull + rebuild is enough
- Do not touch other sites on the server
- Do not display the admin password — you don't have it anymore
- Do not display the deploy key — only public keys are safe to show
- Do not update deploy.json unless the deploy fully succeeds
