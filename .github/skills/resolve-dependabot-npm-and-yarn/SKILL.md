---
name: resolve-dependabot-npm-and-yarn
description: Resolve an active npm or Yarn Dependabot merge conflict by combining the dependency manifest safely, regenerating the lockfile, and verifying the resulting dependency tree. Use when a dependency-update branch is being merged with its base branch; do not use for ordinary dependency upgrades without a merge conflict.
---

# Resolve Dependabot Npm And Yarn

Resolve the conflict in the dependency-update branch, keep unrelated user changes intact, and leave the resolved manifest and lockfile staged for the eventual merge commit. Do not commit unless the user explicitly asks.

## 1. Establish the merge state

Confirm the current branch, worktree, and merge metadata before editing:

```text
git status --short --branch
git rev-parse -q --verify MERGE_HEAD
git ls-files -u
```

Identify the target branch and the branch being merged. If the requested target is not checked out, do not switch branches over a dirty worktree; inspect the state and ask for direction when switching would risk user changes. Do not use `git reset --hard`, `git checkout --`, broad deletion, or broad cleanup.

Limit ownership to the conflicted dependency manifest and its lockfile. Preserve unrelated staged and unstaged changes.

## 2. Inspect both sides and the package manager

Find the affected package directory and package manager from the nearest manifest, lockfile, and `packageManager` field:

- npm: `package.json` with `package-lock.json`
- Yarn: `package.json` with `yarn.lock`

For each conflicted file, inspect the combined diff and both index stages:

```text
git diff -- path/to/package.json
git diff --cc path/to/package-lock.json
git show :2:path/to/package.json   # target branch / ours
git show :3:path/to/package.json   # merged branch / theirs
```

During a merge, stage 2 is the checked-out target branch and stage 3 is the branch being merged. Compare dependency keys and versions, not only the conflict markers. Preserve the Dependabot update while incorporating independent base-branch changes. Resolve each manifest key once; do not blindly take one whole side.

Use the manifest as the source of truth. Never hand-merge generated lockfile entries.

## 3. Resolve the manifest

Edit only the minimum conflicted manifest entries. Remove every conflict marker and keep valid JSON/YAML syntax.

Choose a coherent dependency family based on declared peer requirements and the existing project, not on the highest version:

- Keep related tools on compatible majors (for example, a test runner and its UI/coverage packages).
- Keep runtime-coupled packages on the same required version when the framework requires it (for example, `react` and `react-dom`).
- Do not add unrelated upgrades, compatibility shims, or new configuration.
- Do not use `--force` or `--legacy-peer-deps` to hide an invalid dependency tree. If installation exposes a peer or engine conflict, make the smallest manifest correction supported by the error and re-run installation.

Validate the manifest before touching the lockfile. For npm, `npm pkg get name` or a JSON parser is sufficient; use the equivalent Yarn/project command when applicable.

## 4. Recreate the lockfile

Delete only the affected lockfile after confirming its exact path. Run the package manager from the package directory (or use its explicit prefix/workspace option); a failed command from the repository root must not create a stray root lockfile.

```text
# npm
Remove-Item -LiteralPath path/to/package-lock.json
npm install

# Yarn
Remove-Item -LiteralPath path/to/yarn.lock
yarn install
```

On shells without `Remove-Item`, use the native equivalent with the same exact path. If an internal audit endpoint is unavailable but dependency installation succeeds, `npm install --no-audit` is an acceptable retry; report the audit limitation. Do not manually copy lockfile sections from either merge side.

If installation fails, classify the failure before changing anything else:

- dependency/peer resolution: align the manifest's related package versions;
- engine mismatch: verify the available Node/Yarn runtime and report a real environment blocker;
- registry/network/authentication: retry only when safe and report the external blocker;
- install script or test failure: investigate the actual package/runtime error rather than weakening resolution.

## 5. Verify the result

Run the smallest relevant checks, then the repository-prescribed checks:

```text
# npm
npm ls --depth=0
npm ci --dry-run --ignore-scripts --no-audit

# both package managers
rg -n '<<<<<<<|=======|>>>>>>>' path/to/package.json path/to/package-lock.json path/to/yarn.lock
git diff --check
git ls-files -u
```

Run the package's real build and test scripts, such as `npm run build` and `npm test` or their Yarn equivalents. Do not substitute mock-only UI mode for backend, collector, or integration evidence. Treat unrelated pre-existing failures as separate evidence, not as a reason to alter dependency resolution.

The dependency phase is complete only when the manifest parses, the lockfile is reproducible, the dependency tree has no reported invalid peers, conflict markers are absent, `git ls-files -u` is empty, and relevant build/tests pass or a concrete blocker is recorded.

## 6. Stage and report

Stage only the resolved manifest and regenerated lockfile so Git considers the merge conflicts resolved:

```text
git add -- path/to/package.json path/to/package-lock.json
git status --short --branch
```

Before reporting completion, confirm no accidental root lockfile or unrelated generated artifact exists. Report the target branch, files changed, dependency decisions that were necessary, verification commands/results, and whether a commit was intentionally left for the user.
