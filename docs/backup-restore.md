# Backup and Restore Runbook

This framework stores client-editable state in files, so backup is straightforward and should be automated.

## What to Back Up

- `content/` (page JSON, site config, themes/placeholders as used)
- `public/uploads/` (uploaded media)
- Optional: `.rebuild.state.json` (rebuild cooldown state)

## Backup Command (Server)

```bash
TS="$(date -u +%Y%m%dT%H%M%SZ)"
tar -czf "site-backup-${TS}.tar.gz" content public/uploads
```

## Verify Backup Archive

```bash
tar -tzf "site-backup-${TS}.tar.gz" | head -n 30
```

## Restore Procedure

1. Stop app process/container.
2. Restore files from backup archive.
3. Start app process/container.
4. Run post-deploy health checks (`docs/post-deploy-healthcheck.md`).

### Restore Command

```bash
tar -xzf site-backup-YYYYMMDDTHHMMSSZ.tar.gz -C /path/to/site/root
```

## Recommended Schedule

- Daily full backup
- Pre-deploy backup before each production deploy
- Keep at least:
  - 7 daily backups
  - 4 weekly backups
  - 3 monthly backups
