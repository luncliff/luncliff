---
name: create-github-pr
description: Push the current Git branch and open a Korean-language draft GitHub pull request, including confirmed Jira, Confluence, and prior GitHub work links. Use when a user asks to publish the current branch as a draft PR.
---

# Create GitHub PR

Create a draft PR from the current worktree's checked-out branch. Use the GitHub CLI for GitHub operations and the available Jira/Confluence MCP tools for Atlassian links.

## Required context

- Confirm the current branch, worktree, remote, tracking branch, and working-tree status before any mutation.
- The user must specify the target (base) branch. If it is absent, ask for it; do not infer a default branch.
- Do not create a commit for uncommitted changes. Explain that `git push` publishes commits only and report the exact state.
- Do not push a branch other than the current branch or include unrelated existing working-tree changes.

## Workflow

1. Inspect `git branch --show-current`, `git status --short --branch`, the remote, and commits pending against the upstream branch. Confirm GitHub CLI authentication before publishing.
2. Find a PR template in the working directory with `rg --files`, including `.github/PULL_REQUEST_TEMPLATE.md`, `.github/PULL_REQUEST_TEMPLATE/`, and repository-specific template paths. Read the selected template before drafting the body.
3. Push the current branch. Reuse its configured upstream when present; otherwise create an upstream only for this current branch. Stop and report a rejected or failed push rather than retrying implicitly.
4. Create the PR with `gh pr create --draft`, the user-provided base branch, and the current branch as head. Write the title and every prose field in Korean. Preserve and complete a found template; without one, use a concise H1-H3 Markdown structure covering summary, changes, verification, and related links.
5. For Jira issues and Confluence pages identified by the user or repository context, use the relevant MCP server to confirm the exact records and create the requested reciprocal links when supported. Include their verified URLs in the PR body. Link confirmed prior GitHub PRs or issues in the body using `gh`; do not guess relationships or fabricate references.
6. Verify with `gh pr view` that the PR is draft, its base and head branches are correct, the stored body is Korean and retains the template structure, and all linked URLs resolve to the intended records.

Report the branch, PR URL, base branch, and verification result. State separately any link that could not be created because its source or MCP capability was unavailable.
