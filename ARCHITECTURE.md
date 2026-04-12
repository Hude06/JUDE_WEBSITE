# Website Framework — Architecture

## System Overview

```mermaid
graph TB
    subgraph LOCAL["Developer Machine"]
        DEV[Developer + Claude]
        LOCAL_REPO[Local Git Repo]
        DEV -->|works on code| LOCAL_REPO
    end

    subgraph GH["GitHub (Private Repo)"]
        REMOTE_REPO[Remote Repository]
    end

    subgraph LINODE["Linode Ubuntu Server"]
        NGINX[Nginx Reverse Proxy + SSL + Admin Auth]
        subgraph DOCKER["Docker Container"]
            REPO[Git Repo Clone]
            NEXTJS[Next.js App]
            ADMIN[Admin Panel]
            CONTENT[/content/ files]
            STATIC[Static HTML Output]
        end
    end

    subgraph CLIENT["Client Browser"]
        SITE_VIEW[Views Website]
        ADMIN_VIEW[Admin Page Editor]
    end

    LOCAL_REPO -->|git push| REMOTE_REPO
    REMOTE_REPO -->|git pull| REPO
    REPO --> NEXTJS
    NEXTJS -->|npm run build| STATIC
    NGINX -->|reverse proxy| DOCKER
    NGINX -->|basic auth on admin subdomain| ADMIN
    CLIENT -->|clientsite.com| NGINX
    CLIENT -->|admin.clientsite.com| NGINX
    ADMIN -->|writes content files| CONTENT
    CONTENT -->|auto commit + push| REMOTE_REPO
```

---

## Project Setup Flow (`/website-init`)

```mermaid
flowchart TD
    A[Developer runs /website-init] --> B[Claude pulls framework from GitHub]
    B --> C[Claude creates new private GitHub repo]
    C --> D[Scaffold site from starter template]
    D --> E[Install dependencies]
    E --> F[Initialize git + push to GitHub]
    F --> G[Ready for local development]
    G --> H[npm run dev — hot reload on localhost:3000]
```

---

## First Deploy Flow (`/deploy-init`)

```mermaid
flowchart TD
    A[Developer runs /deploy-init] --> B{Is domain pointed to server IP?}
    B -->|No| B1[Claude shows DNS instructions, waits]
    B -->|Yes| C{Can Claude SSH into server?}
    C -->|No| C1[Setup SSH access]
    C -->|Yes| D{Is Docker installed?}
    D -->|No| D1[Install Docker]
    D -->|Yes| E{Nginx config exists for domain?}
    E -->|No| E1[Generate Nginx config + enable site]
    E -->|Yes| F{SSL cert exists?}
    F -->|No| F1[Run Certbot for HTTPS]
    F -->|Yes| G[Setup admin auth]

    B1 --> B
    C1 --> D
    D1 --> E
    E1 --> F
    F1 --> G

    G --> G1[Ask developer for admin password]
    G1 --> G2[Create .htpasswd file on server]
    G2 --> G3[Add basic auth to admin Nginx config]
    G3 --> H[Build Docker image from Dockerfile]
    H --> I[Start container with deploy key]
    I --> J[Clone repo inside container]
    J --> K[Run npm install + npm run build]
    K --> L[Verify site is live — health check]
    L --> M[Write deploy.json to repo]
    M --> N[Commit + push deploy.json]
    N --> O[First deploy complete]
```

---

## Developer Deploy Flow (`/deploy`)

```mermaid
flowchart TD
    A[Developer runs /deploy] --> B{Uncommitted changes?}
    B -->|Yes| B1[Commit + push to GitHub]
    B -->|No| C{Local repo up to date with remote?}
    C -->|No| C1[Git pull — merge client changes]
    C1 --> C2{Merge conflicts?}
    C2 -->|Yes| C3[Claude surfaces conflicts, developer resolves]
    C2 -->|No| D[Push to GitHub]
    C -->|Yes| D

    B1 --> C
    C3 --> D

    D --> E[SSH into Linode server]
    E --> F[Git pull inside container]
    F --> G[npm run build inside container]
    G --> H[Health check — verify site responds]
    H -->|Fail| I[Git checkout previous commit inside container]
    I --> I2[npm run build — restore last working version]
    I2 --> I3[Site stays live on previous version]
    I3 --> I4[Alert developer with error logs]
    H -->|Pass| J[Deploy complete]
```

---

## Client Edit Flow (Admin Panel)

```mermaid
flowchart TD
    A[Client visits admin.clientsite.com] --> B[Nginx basic auth prompt]
    B --> C[Client enters password]
    C --> D[Admin page editor loads]
    D --> E[Select page from dropdown]
    E --> F[Edit text / upload image / reorder blocks]
    F --> G[Clicks Save]
    G --> H[Admin API writes updated content files to /content/]
    H --> I[Trigger npm run build inside container]
    I --> J[New static HTML generated]
    J --> K[Changes live on site]
    K --> L[Auto git commit with message]
    L --> M[Git push to GitHub via deploy key]
    M --> N[Change tracked in repo history]
```

---

## Admin Panel — Page Editor Architecture

```mermaid
graph TB
    subgraph EDITOR["Admin Page Editor"]
        PAGE_SELECT[Page Selector Dropdown]
        BLOCK_LIST[Block List — form fields]
        ADD_BLOCK[Add Block Button]
        SAVE_BTN[Save Button]
        PREVIEW[Live Preview — iframe]
    end

    subgraph CONTENT_FILES["/content/"]
        PAGES["pages/*.json"]
        UPLOADS["uploads/*"]
        SITE_CONFIG["site.json"]
    end

    subgraph TEMPLATE["Template Components"]
        BLOCK_RENDERER[BlockRenderer]
        HEADING[HeadingBlock]
        PARAGRAPH[ParagraphBlock]
        IMAGE[ImageBlock]
        CUSTOM[...custom blocks]
    end

    PAGE_SELECT -->|reads page list| PAGES
    BLOCK_LIST -->|reads block data| PAGES
    SAVE_BTN -->|writes updated data| PAGES
    ADD_BLOCK -->|appends new block| PAGES
    PREVIEW -->|iframe loads actual site| BLOCK_RENDERER
    BLOCK_RENDERER -->|reads content from| PAGES
    BLOCK_RENDERER --> HEADING
    BLOCK_RENDERER --> PARAGRAPH
    BLOCK_RENDERER --> IMAGE
    BLOCK_RENDERER --> CUSTOM
```

### The Contract

The admin panel and the template are decoupled. They only share `/content/` files.

- **Admin panel** reads and writes content files — doesn't know or care about CSS frameworks or styling
- **Template** reads content files and renders them — any framework, any styles
- **Preview** is an iframe of the actual site — always accurate regardless of template

### Content File Format

```json
{
  "title": "About",
  "slug": "about",
  "blocks": [
    { "id": "b1", "type": "heading", "text": "About Me" },
    { "id": "b2", "type": "paragraph", "text": "I design things..." },
    { "id": "b3", "type": "image", "src": "/uploads/portrait.jpg", "alt": "Portrait" }
  ]
}
```

### Template Contract (only requirement)

Every template must implement a `BlockRenderer` that handles content block types:

```
BlockRenderer reads block.type → renders with template-specific styling
```

This means the admin panel works with any CSS framework (Tailwind, Bootstrap, vanilla CSS, etc.) because it never touches the rendering — it only edits the data.

---

## Admin Authentication — Nginx Basic Auth

```mermaid
flowchart LR
    CLIENT[Client Browser] -->|admin.clientsite.com| NGINX[Nginx]
    NGINX -->|auth_basic| HTPASSWD[.htpasswd-clientsite]
    HTPASSWD -->|password valid| CONTAINER[Docker Container — Admin Panel]
    HTPASSWD -->|password invalid| DENIED[401 Unauthorized]
```

### Nginx Config for Admin Subdomain

```nginx
server {
    server_name admin.clientsite.com;

    auth_basic "Admin";
    auth_basic_user_file /etc/nginx/.htpasswd-clientsite;

    location / {
        proxy_pass http://localhost:3001;
    }

    # SSL managed by Certbot
}
```

### Why Nginx Basic Auth

- Zero auth code in the framework
- Zero auth bugs — battle-tested
- Password change is one command on the server
- HTTPS via Certbot encrypts credentials in transit
- One less thing to build per site
- Works with any template

---

## Developer Starts Working (Daily Flow)

```mermaid
flowchart TD
    A[Developer opens project in Claude] --> B[Auto git pull — includes any client changes]
    B --> D[Start working]
    D --> E[npm run dev — localhost:3000]
    E --> F[Develop with Claude]
    F --> G[Commit often to GitHub]
    G --> H{Ready to deploy?}
    H -->|No| F
    H -->|Yes| I[Run /deploy]
```

---

## Docker Image Rebuild (Rare)

```mermaid
flowchart TD
    A[Need to change environment] --> B{What changed?}
    B --> C[Node.js version upgrade]
    B --> D[New system dependency]
    B --> E[Dockerfile changes]
    B --> F[Major framework upgrade]
    C --> G[Run /deploy-init again]
    D --> G
    E --> G
    F --> G
    G --> H[Rebuild Docker image]
    H --> I[Replace container on server]
    I --> J[Pull latest code + content from GitHub]
    J --> K[npm run build]
    K --> L[Verify health check]
```

---

## Starter Template — 3 Page Portfolio

```
/content/pages/
  home.json       ← hero section, intro text, featured work
  about.json      ← bio, skills, portrait
  contact.json    ← contact info, form or links

/content/site.json ← site name, nav links, fonts, colors
```

---

## File Structure (Inside Each Site Repo)

```
site-repo/
├── app/                    # Next.js pages + routes
│   ├── layout.tsx
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── components/             # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BlockRenderer.tsx
│   └── blocks/
│       ├── TextBlock.tsx
│       ├── ImageBlock.tsx
│       ├── HeadingBlock.tsx
│       └── ...
├── admin/                  # Admin page editor
│   ├── app/
│   ├── components/
│   └── api/
├── content/                # Client-editable content
│   ├── pages/
│   │   ├── home.json
│   │   ├── about.json
│   │   └── contact.json
│   ├── uploads/            # Client-uploaded images
│   └── site.json           # Site-wide config (name, fonts, colors)
├── public/                 # Static assets
├── styles/                 # Global styles
├── deploy.json             # Deployment config (created by /deploy-init)
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── package.json
└── README.md
```

---

## Security Model

```mermaid
flowchart LR
    subgraph SERVER["Linode Server"]
        NGINX[Nginx]
        HTPASSWD[.htpasswd per site]
        subgraph CONTAINER["Docker Container"]
            KEY[GitHub Deploy Key]
        end
    end

    NGINX -->|HTTPS only via Certbot| INTERNET[Internet]
    NGINX -->|basic auth on admin.*| HTPASSWD
    HTPASSWD -->|authenticated requests only| CONTAINER
    KEY -->|push only, no delete, no force push| GH[GitHub Repo]
    KEY -->|scoped to single repo| GH
```
