# Framework Update Runbook

How to pull framework updates into a client site.

## Prerequisites

- The client repo was created by `website-init` (has a `framework` remote and `.client-site` marker).
- Working tree is clean (`git status` shows no uncommitted changes).

If the `framework` remote is missing:

```bash
git remote add framework https://github.com/Hude06/website-framework.git
git fetch framework
```

## Pulling updates

From the client repo root:

```bash
npm run sync-framework
```

That script (`scripts/sync-framework.sh`):

1. Verifies the `framework` remote exists.
2. Checks the working tree is clean.
3. Fetches the latest framework commits.
4. Merges `framework/main` into your current branch.
5. If the merge succeeds: runs `npm install` (in case deps changed) and `npm run build` (to verify nothing broke).
6. If the merge fails (conflicts): aborts and prints the conflicting files.

## Resolving conflicts

Because the zone guard prevents framework-zone edits in client sites, conflicts should only occur in **shared files**. In practice this is almost always `package.json` (and maybe `CLAUDE.md` if you've customized it).

### `package.json` conflict

Typical cause: framework added a dependency while you changed `name`/`description`.

1. Open `package.json`. You'll see `<<<<<<<` / `=======` / `>>>>>>>` markers.
2. Keep your `name`/`description`/`version` at the top of the file.
3. Keep the framework's updated `dependencies` block.
4. Remove the markers.
5. Run `npm install` to regenerate `package-lock.json`.
6. Commit: `git add package.json package-lock.json && git commit`.

### Client-zone files appearing in the merge

If framework files in `client/` were updated by the framework (shouldn't happen, but might if someone used `FRAMEWORK_EDIT=1`), keep the **client's** version — those files are client-owned. Accept yours:

```bash
git checkout --ours client/registry.ts
git add client/registry.ts
```

### I edited a framework-zone file with `FRAMEWORK_EDIT=1`

You opted into conflict resolution when you did that. Decide: either keep your patched version (accept yours) or accept the framework update (accept theirs, re-apply your patch). Usually the right move is to send your patch upstream as a PR to the framework repo, then delete your local version.

## Verifying the update

After a clean merge:

```bash
npm run build   # should pass
npm test        # should pass
npm run dev     # visually confirm the site still looks right
```

## Reverting

If the update broke something and you want to bail:

```bash
git merge --abort   # if the merge is still in progress
# OR
git reset --hard ORIG_HEAD   # if the merge completed but something is wrong
```

## Notes

- The sync script does NOT auto-push to your client repo's `origin`. After a successful merge, review the commits and push manually when ready.
- Framework updates are published on the `main` branch of https://github.com/Hude06/website-framework. Pin to a specific tag by passing `FRAMEWORK_REF=v1.2.3 npm run sync-framework` (see script source).
