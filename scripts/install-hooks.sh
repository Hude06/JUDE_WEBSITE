#!/usr/bin/env bash
# install-hooks.sh — installs the git pre-commit hook to enforce zone boundaries.
# Called automatically by the `prepare` npm script after `npm install`.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$REPO_ROOT" ]]; then
  # not a git repo (e.g. fresh clone before init); skip silently
  exit 0
fi

HOOK_DIR="$REPO_ROOT/.git/hooks"
HOOK="$HOOK_DIR/pre-commit"

mkdir -p "$HOOK_DIR"

cat > "$HOOK" <<'EOF'
#!/usr/bin/env bash
exec "$(git rev-parse --show-toplevel)/scripts/check-zones.sh"
EOF

chmod +x "$HOOK"
chmod +x "$REPO_ROOT/scripts/check-zones.sh" 2>/dev/null || true

echo "✓ pre-commit hook installed"
