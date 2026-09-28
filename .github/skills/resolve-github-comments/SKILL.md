---
name: resolve-github-comments
description: "Address actionable review comments on the current GitHub pull request: implement safe fixes, verify them, commit, push, and resolve the addressed threads."
---

# Resolve GitHub Comments

Use when the user asks to apply or resolve code-review comments on the current branch's open PR.

## Workflow

1. Invoke and follow the `$gh-address-comments` skill to authenticate and discover the current PR's review comments. For this workflow, proceed autonomously after discovery instead of asking the user to select threads; this skill's triage rules override that clarification step. Use `gh api graphql` when thread-resolution state is needed.
2. Classify suggestions: implement the majority that are actionable, correct, and within the requested scope. Ignore summary/LGTM noise and decline suggestions that would introduce a regression, unnecessary complexity, or unsupported behavior. Do not ask the user to select comments unless their intent or a proposed change is materially ambiguous.
3. Before editing, trace the affected function and callers. Apply the smallest root-cause fix, reuse existing patterns, and add a focused regression test when the change has non-trivial logic.
4. Verify with the smallest relevant test command. On Windows, read and write text explicitly as UTF-8 and prefer `uv run` for project Python commands; use a direct virtual-environment interpreter only to diagnose a runner or interpreter mismatch. Do not alter source encoding or line endings unnecessarily.
5. Stage only the files changed for the review fixes, create a concise conventional commit, and push the current branch.
6. Resolve only the threads actually addressed. With GitHub CLI, obtain each `PullRequestReviewThread` node ID and call GraphQL `resolveReviewThread`; then verify the PR head points to the pushed commit and the addressed threads are resolved.

If authentication, tests, or a required external dependency blocks completion, report the exact blocker and leave unaddressed threads open.
