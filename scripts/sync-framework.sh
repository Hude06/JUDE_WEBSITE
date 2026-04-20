#!/usr/bin/env bash
# sync-framework.sh — pull upstream framework updates into a client site.
#
# Usage:
#   npm run sync-framework            # merge framework/main
#   FRAMEWORK_REF=v1.2.3 npm run sync-framework   # merge a specific tag/branch
#
# Safety:
#   - Refuses to run if working tree is dirty.
#   - Refuses to run if there is no 'framework' remote.
#   - Aborts on merge conflict with a clear message.
#   - Runs 'npm install' + 'npm run build' after a clean merge to catch breakage early.

set -euo pipefail

REMOTE_NAME="framework"
REMOTE_REF="${FRAMEWORK_REF:-${REMOTE_NAME}/main}"

# Style
BOLD="\033[1m"
DIM="\033[2m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
RESET="\033[0m"

info()  { printf "${DIM}→${RESET} %s\n" "$*"; }
ok()    { printf "${GREEN}✓${RESET} %s\n" "$*"; }
warn()  { printf "${YELLOW}!${RESET} %s\n" "$*"; }
fail()  { printf "${RED}✗${RESET} %s\n" "$*" >&2; exit 1; }

# 1. Verify we're in a git repo
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[[ -z "$REPO_ROOT" ]] && fail "not a git repository"
cd "$REPO_ROOT"

# 2. Verify remote exists
if ! git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  fail "no '$REMOTE_NAME' remote configured. Add it with:
    git remote add $REMOTE_NAME https://github.com/Hude06/website-framework.git"
fi

# 3. Verify clean working tree
if ! git diff --quiet || ! git diff --cached --quiet; then
  fail "working tree has uncommitted changes. Commit or stash them before syncing."
fi

# 4. Fetch
info "fetching $REMOTE_NAME..."
git fetch "$REMOTE_NAME" --tags

# 5. Show what's about to change
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
printf "${BOLD}Incoming commits from %s${RESET}\n" "$REMOTE_REF"
git log --oneline --no-decorate "HEAD..$REMOTE_REF" 2>/dev/null | head -20 || true
INCOMING_COUNT=$(git rev-list --count "HEAD..$REMOTE_REF" 2>/dev/null || echo 0)

if [[ "$INCOMING_COUNT" -eq 0 ]]; then
  ok "already up to date with $REMOTE_REF"
  exit 0
fi

printf "\n${BOLD}Merging %s into %s...${RESET}\n" "$REMOTE_REF" "$CURRENT_BRANCH"

# 6. Merge
if ! git merge --no-edit "$REMOTE_REF"; then
  printf "\n${RED}Merge conflict.${RESET} The following files have conflicts:\n" >&2
  git diff --name-only --diff-filter=U | sed 's/^/  - /' >&2
  printf "\nResolve them, then:\n" >&2
  printf "  git add <files>\n" >&2
  printf "  git commit\n" >&2
  printf "\nOr abort with: git merge --abort\n" >&2
  printf "\nSee docs/framework-update.md for conflict resolution guidance.\n" >&2
  exit 1
fi

ok "merge complete"

# 7. Install + build to catch breakage
info "running npm install (in case dependencies changed)..."
if ! npm install --no-audit --no-fund >/dev/null 2>&1; then
  warn "npm install reported issues — re-run manually to see output"
fi

info "running npm run build..."
if npm run build >/dev/null 2>&1; then
  ok "build passed"
else
  warn "build FAILED after merge. Investigate before pushing."
  warn "run 'npm run build' to see the errors."
  exit 1
fi

printf "\n${GREEN}${BOLD}Sync complete.${RESET} Review the new commits and push when ready:\n"
printf "  git log --oneline -%d\n" "$((INCOMING_COUNT + 1))"
printf "  git push\n"
