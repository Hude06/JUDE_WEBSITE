---
name: deploy-init
description: First-time deployment wizard for a client website. Sets up Docker, Nginx, SSL, admin auth, and deploy key on a remote server. Run once per site after building locally with /website-init.
---

# Deploy Init

First-time deployment of a client website to a production server. This is a guided wizard that provisions everything needed to serve the site over HTTPS with an authenticated admin panel.

## When to Activate

- Developer types `/deploy-init`
- Developer says "deploy this site", "set up production", "first deploy", "push to server"
- Developer types `/deploy-init --dry-run` for a preview of all commands without executing

## Security Rules — READ FIRST

These rules are non-negotiable. Violating any of them is a critical failure.

1. **NEVER read, display, log, or transmit SSH private keys.** Only read `.pub` files.
2. **NEVER store passwords in any file, variable, or output.** Passwords are piped to `htpasswd` via stdin and immediately forgotten.
3. **NEVER commit secrets** to git — no keys, passwords, tokens in deploy.json or any other file.
4. **NEVER run destructive commands** that affect other sites — no `docker rm -f` on other containers, no overwriting other Nginx configs, no `rm -rf` on shared directories.
5. **Always run `nginx -t` before `systemctl reload nginx`** — a bad config can break ALL sites on the server.
6. **Every server-modifying command requires developer confirmation** before executing. Show what will happen, wait for "yes".
7. **Scan all command output before displaying** — redact anything matching: `-----BEGIN`, `ssh-ed25519 AAAA` (private key format), password strings. Public keys (`.pub` content) are safe to display.
8. **All SSH commands use `-o BatchMode=yes`** to prevent password prompts from hanging.
9. **deploy.json contains ZERO secrets** — only hostnames, paths, ports, and aliases.

## Dry-Run Mode

If the developer says `/deploy-init --dry-run` or "dry run":
- Walk through every step
- Show every command that WOULD be executed
- Show the Nginx config that WOULD be created
- Show the port that WOULD be assigned
- Execute NOTHING on the server
- End with: "Run `/deploy-init` to execute these steps for real."

## Preflight Checks

Run ALL of these before asking questions. If any fail, show the error and STOP.

1. **deploy.json exists and is valid:**
   ```bash
   cat deploy.json
   ```
   Must have `site.name`, `site.domain`, and `site.repo` populated. If `site.domain` is empty, STOP: "No domain set in deploy.json. Update it with the production domain first."

2. **Check deployment status:**
   Read `deploy.json` → `status` field.
   - If `"deployed"`: "This site is already deployed. Did you mean to run `/deploy` instead?" Ask to confirm before proceeding (will re-provision).
   - If `"deploying:*"`: "Previous deploy-init didn't complete (stopped at {step}). Resuming from there."
   - If `"not-deployed"`: proceed normally.

3. **Check tools:**
   ```bash
   which ssh && which gh && which git
   ```
   If any missing, tell the developer which tool to install and STOP.

4. **Check GitHub auth:**
   ```bash
   gh auth status
   ```
   If not authenticated: "Run `! gh auth login` and try again." STOP.

5. **Check local repo is pushed:**
   ```bash
   git status && git log origin/main..HEAD --oneline
   ```
   If unpushed commits: warn "You have unpushed commits. Push first so the server gets the latest code."

## Information Gathering

Ask ALL of these in a single message. Read existing values from `deploy.json` and offer them as defaults.

| Field | Description | Default |
|-------|-------------|---------|
| **SSH alias or host** | SSH config alias or IP address | `deploy.json` → `server.sshAlias` or empty |
| **SSH user** | Username for SSH | `root` |
| **Sites directory** | Where sites live on the server | `/opt/sites` |
| **Admin username** | For Nginx basic auth on `/admin` | `admin` |
| **Admin password** | For Nginx basic auth. Will be hashed, never stored. | (required, no default) |
| **Email for SSL** | For Certbot certificate notices | (required) |

After gathering, update `deploy.json` locally with the non-secret values:
```json
{
  "server": {
    "sshAlias": "{alias_or_host}",
    "user": "{user}",
    "sitesDir": "{sites_directory}",
    "port": 22
  }
}
```

Store the admin password in a local variable only. It gets used once for the htpasswd command and is never written to any file.

## Execution Steps

Execute in order. Show progress for each step. Update `deploy.json` → `status` as each phase completes.

### Step 1: Verify SSH Connection

```bash
ssh -o ConnectTimeout=5 -o BatchMode=yes {sshAlias} "echo CONNECTION_OK && uname -a"
```

- If fails: "SSH connection failed. Verify your SSH config or key setup and try again." STOP.
- If succeeds: show the server OS info, proceed.

Update status: `"deploying:ssh-verified"`

### Step 2: Verify DNS

Run locally:
```bash
dig +short {domain}
```

- If result matches server IP: proceed.
- If no result: "DNS not set up for {domain}. Create an A record pointing to {server_ip}." Ask to continue anyway or wait.
- If result is a different IP: "WARNING: {domain} points to {other_ip}, not your server. SSL will fail." Ask to continue or fix.

Update status: `"deploying:dns-verified"`

### Step 3: Install Server Dependencies

Check and install each (with developer confirmation before installing):

```bash
# Docker
ssh {sshAlias} "which docker || echo MISSING"
# If missing:
ssh {sshAlias} "apt-get update && apt-get install -y docker.io && systemctl enable docker && systemctl start docker"

# Nginx
ssh {sshAlias} "which nginx || echo MISSING"
# If missing:
ssh {sshAlias} "apt-get update && apt-get install -y nginx && systemctl enable nginx && systemctl start nginx"

# Certbot
ssh {sshAlias} "which certbot || echo MISSING"
# If missing:
ssh {sshAlias} "apt-get install -y certbot python3-certbot-nginx"

# htpasswd (from apache2-utils)
ssh {sshAlias} "which htpasswd || echo MISSING"
# If missing:
ssh {sshAlias} "apt-get install -y apache2-utils"
```

Update status: `"deploying:deps-installed"`

### Step 4: Assign Port

```bash
ssh {sshAlias} "docker ps --format '{{.Ports}}' 2>/dev/null; ss -tlnp 2>/dev/null"
```

Parse output to find all ports in use. Starting from 3001, pick the lowest unused port.

Show developer: "Assigning port {port} for this site's container."

Write to `deploy.json` → `docker.port`.

Update status: `"deploying:port-assigned"`

### Step 5: Clone Repo and Build Docker Image

CONFIRM with developer before running (build takes 2-3 minutes).

```bash
# Create site directory
ssh {sshAlias} "mkdir -p {sitesDir}/{clientName}"

# Clone the repo (using HTTPS — no deploy key yet)
ssh {sshAlias} "git clone https://github.com/{repo}.git {sitesDir}/{clientName}/repo"

# Build Docker image
ssh {sshAlias} "cd {sitesDir}/{clientName}/repo && docker build -t {clientName}-site ."
```

If the clone fails with auth issues, the repo might be private. Tell the developer to either make it public temporarily or set up a personal access token on the server. Alternatively, use `gh` to create a temporary clone URL.

Show build progress. If build fails, display the error output and STOP.

Update status: `"deploying:image-built"`

### Step 6: Start Container

```bash
# Create persistent directories
ssh {sshAlias} "mkdir -p {sitesDir}/{clientName}/content {sitesDir}/{clientName}/deploy-key"

# Copy initial content
ssh {sshAlias} "cp -r {sitesDir}/{clientName}/repo/content/* {sitesDir}/{clientName}/content/"

# Start container
ssh {sshAlias} "docker run -d \
  --name {clientName}-site \
  --restart unless-stopped \
  -p {port}:3000 \
  -v {sitesDir}/{clientName}/content:/app/content \
  -v {sitesDir}/{clientName}/deploy-key:/root/.ssh \
  {clientName}-site"
```

Verify container started:
```bash
ssh {sshAlias} "docker ps | grep {clientName}-site"
ssh {sshAlias} "docker logs {clientName}-site --tail 10"
```

Wait for Next.js to start (look for "Ready" in logs, retry up to 30 seconds):
```bash
ssh {sshAlias} "for i in $(seq 1 6); do curl -s -o /dev/null -w '%{http_code}' http://localhost:{port}/ && break; sleep 5; done"
```

If container won't start: show logs, STOP.

Update status: `"deploying:container-running"`

### Step 7: Generate Deploy Key

Generate a new SSH key pair on the server. The private key NEVER leaves the server.

```bash
# Generate key pair
ssh {sshAlias} "ssh-keygen -t ed25519 -f {sitesDir}/{clientName}/deploy-key/id_ed25519 -N '' -C 'deploy-{clientName}-site'"

# Set permissions
ssh {sshAlias} "chmod 600 {sitesDir}/{clientName}/deploy-key/id_ed25519"

# Create SSH config for GitHub
ssh {sshAlias} "cat > {sitesDir}/{clientName}/deploy-key/config << 'SSHEOF'
Host github.com
    StrictHostKeyChecking accept-new
    IdentityFile /root/.ssh/id_ed25519
SSHEOF"

# Read the PUBLIC key only
PUBLIC_KEY=$(ssh {sshAlias} "cat {sitesDir}/{clientName}/deploy-key/id_ed25519.pub")
```

Display the public key to the developer (this is safe — it's the public half).

Register the deploy key on GitHub using the local `gh` CLI:
```bash
echo "{public_key}" | gh repo deploy-key add - -R {repo} -t "deploy-{clientName}-site" -w
```

The `-w` flag grants write access (needed for pushing content changes from the admin panel).

CONFIRM with developer before registering the key.

Verify the key works from inside the container:
```bash
ssh {sshAlias} "docker exec {clientName}-site ssh -o StrictHostKeyChecking=accept-new -T git@github.com 2>&1 || true"
```
Should see "successfully authenticated" in the output.

Update status: `"deploying:key-registered"`

### Step 8: Set Up Git Inside Container

Initialize git inside the container so it can pull updates and push content changes:

```bash
ssh {sshAlias} "docker exec {clientName}-site sh -c 'cd /app && git init && git remote add origin git@github.com:{repo}.git && git fetch origin && git branch -M main && git reset --mixed origin/main'"
```

Verify:
```bash
ssh {sshAlias} "docker exec {clientName}-site sh -c 'cd /app && git status'"
```

Update status: `"deploying:git-configured"`

### Step 9: Set Up Admin Auth

Create the htpasswd file. The password is piped via stdin so it never appears in shell history or command output.

```bash
echo '{password}' | ssh {sshAlias} "htpasswd -ci /etc/nginx/.htpasswd-{clientName} {username}"
ssh {sshAlias} "chmod 640 /etc/nginx/.htpasswd-{clientName}"
```

**CRITICAL:** After this command, the password variable must be discarded. Never display it, never reference it again, never write it to any file.

Verify the file exists:
```bash
ssh {sshAlias} "test -f /etc/nginx/.htpasswd-{clientName} && echo OK"
```

Update status: `"deploying:auth-configured"`

### Step 10: Create Nginx Config

Write the Nginx server block with reverse proxy and admin auth. This is the HTTP-only version — Certbot will add SSL in the next step.

CONFIRM with developer before writing. Show the full config first.

```nginx
server {
    listen 80;
    server_name {domain};

    location / {
        proxy_pass http://127.0.0.1:{port};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin {
        auth_basic "Admin";
        auth_basic_user_file /etc/nginx/.htpasswd-{clientName};
        proxy_pass http://127.0.0.1:{port};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/admin {
        auth_basic "Admin";
        auth_basic_user_file /etc/nginx/.htpasswd-{clientName};
        proxy_pass http://127.0.0.1:{port};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Write and enable:
```bash
# Write config via heredoc
ssh {sshAlias} "cat > /etc/nginx/sites-available/{domain} << 'NGINXEOF'
{config content}
NGINXEOF"

# Enable site
ssh {sshAlias} "ln -sf /etc/nginx/sites-available/{domain} /etc/nginx/sites-enabled/{domain}"

# Test config — CRITICAL: must pass before reloading
ssh {sshAlias} "nginx -t"

# Reload only if test passes
ssh {sshAlias} "systemctl reload nginx"
```

If `nginx -t` fails: show the error, do NOT reload, STOP.

Verify HTTP works:
```bash
curl -s -o /dev/null -w '%{http_code}' http://{domain}/
```
Expect 200.

Update status: `"deploying:nginx-configured"`

### Step 11: Set Up SSL

Run Certbot to obtain an SSL certificate and modify the Nginx config:

CONFIRM with developer before running.

```bash
ssh {sshAlias} "certbot --nginx -d {domain} --non-interactive --agree-tos -m {email} --redirect"
```

- `--nginx` modifies the Nginx config to add SSL directives
- `--redirect` adds HTTP → HTTPS redirect
- `--non-interactive` prevents prompts

If Certbot fails:
- Most common cause: DNS not propagated yet
- Show full Certbot output
- Offer to skip SSL for now and set up later with: `ssh {sshAlias} "certbot --nginx -d {domain}"`
- Do NOT leave the site broken — HTTP still works without SSL

Verify HTTPS:
```bash
curl -s -o /dev/null -w '%{http_code}' https://{domain}/
```
Expect 200.

Update status: `"deploying:ssl-configured"`

### Step 12: Update deploy.json

Update `deploy.json` locally with final values:

```json
{
  "site": {
    "name": "{clientName}-site",
    "domain": "{domain}",
    "repo": "{repo}"
  },
  "server": {
    "sshAlias": "{sshAlias}",
    "user": "{user}",
    "sitesDir": "{sitesDir}",
    "port": 22
  },
  "docker": {
    "containerName": "{clientName}-site",
    "port": {assigned_port}
  },
  "status": "deployed"
}
```

Commit and push:
```bash
git add deploy.json
git commit -m "chore: deployment config for {domain}"
git push origin main
```

### Step 13: Final Verification

Run all health checks:

```bash
# Site loads over HTTPS
curl -s -o /dev/null -w '%{http_code}' https://{domain}/

# Admin returns 401 without auth
curl -s -o /dev/null -w '%{http_code}' https://{domain}/admin

# Admin returns 200 with auth (use the username, password is already forgotten — skip this check)
# Instead just verify the 401 proves auth is working

# Container is running
ssh {sshAlias} "docker ps --filter name={clientName}-site --format '{{.Status}}'"

# Container logs are clean
ssh {sshAlias} "docker logs {clientName}-site --tail 5 2>&1"
```

### Step 14: Print Summary

```
Deployment complete!

  Site:      https://{domain}
  Admin:     https://{domain}/admin
  Server:    {sshAlias} ({user}@{host})
  Container: {clientName}-site (port {port})
  Status:    deployed

Next steps:
  - Run /deploy to push code updates
  - Client can edit content at https://{domain}/admin
  - SSL auto-renews via Certbot

To check status later:
  ssh {sshAlias} "docker ps | grep {clientName}"
  ssh {sshAlias} "docker logs {clientName}-site --tail 20"
```

Do NOT include the admin password in the summary.

## Resuming After Failure

If `/deploy-init` is run again on a site with a `"deploying:*"` status, resume from the incomplete step:

| Status | Resume From |
|--------|------------|
| `deploying:ssh-verified` | Step 2 (DNS) |
| `deploying:dns-verified` | Step 3 (deps) |
| `deploying:deps-installed` | Step 4 (port) |
| `deploying:port-assigned` | Step 5 (build) |
| `deploying:image-built` | Step 6 (container) |
| `deploying:container-running` | Step 7 (deploy key) |
| `deploying:key-registered` | Step 8 (git) |
| `deploying:git-configured` | Step 9 (auth) |
| `deploying:auth-configured` | Step 10 (nginx) |
| `deploying:nginx-configured` | Step 11 (SSL) |
| `deploying:ssl-configured` | Step 12 (finalize) |

Each step checks if its work is already done before re-doing it (idempotent).

## Error Recovery

- **SSH fails:** Check SSH config alias, key permissions (600), server IP, firewall. STOP.
- **DNS wrong:** Show correct A record needed. Offer to continue without SSL or wait.
- **Docker build fails:** Show build output. Likely a code or dependency issue. STOP.
- **Container won't start:** Show `docker logs`. Common: port conflict (reassign), crash loop. STOP.
- **Nginx -t fails:** Show error. Do NOT reload. Fix config and retry.
- **Certbot fails:** Most common is DNS propagation. Show output. Offer to skip SSL for now.
- **Deploy key registration fails:** Check `gh repo deploy-key list -R {repo}`. Key may already exist.
- **htpasswd fails:** Ensure apache2-utils is installed.

## What NOT to Do

- Do not modify the Dockerfile — it's a framework file
- Do not create `.env` files — the app uses no env-based secrets
- Do not modify other sites' Nginx configs or containers
- Do not use `docker-compose` — single containers keep things simple
- Do not set up firewall rules — that's server admin territory
- Do not store any passwords, tokens, or private keys in deploy.json
- Do not display the admin password after the htpasswd step
- Do not read or display the deploy key private key — only the .pub file
