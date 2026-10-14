---
name: create-github-pr
description: Push the current Git branch and open a Korean-language draft GitHub pull request, including confirmed Jira, Confluence, and prior GitHub work links. Use when a user asks to publish the current branch as a draft PR.
---

# Create GitHub PR

Create a draft PR from the current branch. Use the GitHub CLI for GitHub operations and the available Jira/Confluence MCP tools for Atlassian links.

## Required context

- Confirm the current branch, worktree, remote, tracking branch, and working-tree status before any mutation.
- The user must specify the target (base) branch. If it is absent, ask for it; do not infer a default branch.
- Do not create a commit for uncommitted changes. Explain that `git push` publishes commits only and report the exact state.
- Do not push a branch other than the current branch or include unrelated existing working-tree changes.

## Workflow

1. Inspect `git rev-parse --show-toplevel`, `git branch --show-current`, `git status --short --branch`, the remote, and commits pending against the upstream branch. Confirm GitHub CLI authentication before publishing (`gh auth status`).
2. Find a PR template in repository-specific template paths. `.github/PULL_REQUEST_TEMPLATE.md`, `.github/PULL_REQUEST_TEMPLATE/`, and other common locations. Read the selected template before drafting the body.
3. Push the current branch. Reuse its configured upstream when present; otherwise set an upstream for the current branch. Stop and report a rejected or failed push rather than retrying implicitly.
4. Create the PR with `gh pr create --draft`, the user-provided base branch, and the current branch as head. Write the title and every prose field in Korean. Preserve and complete a found template; without one, use a concise H1-H3 Markdown structure.
5. For Jira issues and Confluence pages identified by the user or repository context, use the relevant MCP server to confirm the exact records and create the requested reciprocal links when supported. Include their verified URLs in the PR body. Link confirmed prior GitHub PRs or issues in the body using `gh`; do not guess relationships or fabricate references. Order the links with relevance.
6. Verify with `gh pr view` that the PR is draft, its base and head branches are correct, the stored body is Korean and retains the template structure, and all linked URLs resolve to the intended records.
7. Evaluate whether description provides sufficient context and information. Append supplementary details as needed.

Report the branch, PR URL, base branch, and verification result. State separately any link that could not be created because its source or MCP capability was unavailable.

## Composing

### General Guidelines

- Use concise, readable language.
- Structure the information for reviewers and make it easy to scan.
  - Use tables only with necessary columns.
  - Indent nested lists consistently; NO flat, single-level lists.
  - Use UML diagrams, not flowcharts.
  - Keep code examples short and add comments where helpful.
- Exclude any metadata of the PR itself. Which can be queried using `gh pr ...` commands.

### PR Description

If the template includes a description section, use its headings.

Write a concise narrative. Let the reason for the PR come through briefly from context. Spend most of the description on the changes and the requirements, instructions, background, or project alignment behind them. Exclude verification and reproduction details by default. Weave these points rather than presenting them as explicit "Why," "What," and "How" sections.
