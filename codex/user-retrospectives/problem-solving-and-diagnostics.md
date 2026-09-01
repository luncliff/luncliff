---
surface_id: problem-solving-diagnostics
title: Problem Solving And Diagnostics
purpose: Investigate failures through reproduction, evidence comparison, environment checks, and explicit failure classification.
keywords:
  - diagnosis
  - reproduction
  - environment
  - live evidence
  - logs
  - TLS
  - encoding
  - failure classification
---

# Problem Solving And Diagnostics

## Environment and Reproduction

- Takeaway: Treat module-level environment mutation as cross-suite contamination. Do not inject credentials at collection time; prove absent and present states in an isolated current-interpreter process without exposing credential values.
  Evidence: Collection-time dummy-token injection turned credential-missing skips into unauthorized live calls.
  Apply when: External tests differ by collection order or mutate process-wide environment variables.

- Takeaway: Determine the actual `.env` loading path separately for server/runtime execution and direct test or CLI execution. Where the repository supports it, use a shell-independent runner such as `uv run --env-file .env ...`; report non-blocking parser warnings as evidence rather than hiding them.
  Evidence: Local startup auto-loaded `.env`, while direct `pytest` did not; `uv --env-file` passed the required variables but emitted a parser warning.
  Apply when: Diagnosing or documenting local server, test, or CLI behavior.

- Takeaway: Reproduce a suspected managed-environment failure under matching runtime constraints before changing code.
  Evidence: A container `uv` permission failure was reproduced with its managed user and HOME settings before the runtime command changed.
  Apply when: Investigating startup failures, permissions, managed-platform differences, or environment-specific regressions.

- Takeaway: If `uv run python` selects a different interpreter from the one holding project dependencies, prove the mismatch and pin `uv` to the working interpreter instead of silently switching tools.
  Evidence: `uv` selected a fresh Python without `pytest` while dependencies were installed under another interpreter.
  Apply when: A `uv` command loses packages or multiple runtimes are installed.

## Live and Cross-Path Evidence

- Takeaway: For a live-only edge case, use a fixed observed upstream identity and assert identity, availability, and the exact edge-state signal before accepting it as evidence.
  Evidence: A fixed comments-disabled video seed was stable where candidate discovery was flaky.
  Apply when: Covering rare live states such as disabled comments, geo-blocks, or missing media.

- Takeaway: When MongoDB MCP succeeds but the local application appears empty, compare MCP collection evidence, application API output, and application logs before changing query logic. Scope any TLS trust bypass to local development and preserve production verification.
  Evidence: MCP showed documents while local logs exposed a missing CA-path trust failure.
  Apply when: Diagnosing MCP-backed database discrepancies, internal CA failures, or local VPN environments.

- Takeaway: For PR analysis, resolve PR metadata and compare against the actual base branch before attributing files or changes.
  Evidence: Comparing a stacked PR with `develop` included unrelated predecessor work.
  Apply when: Reviewing stacked feature branches or GitHub Enterprise PRs.

- Takeaway: Distinguish the orchestration tool from the external transport. An MCP-free CLI may still call an external service through a direct client or REST API.
  Evidence: A CLI published to Confluence through its REST client without using MCP.
  Apply when: Explaining tool constraints, plugins, browser automation, or direct API integrations.

## Failure Classification and Explanation

- Takeaway: When a user's mental model is incorrect, explain the exact incorrect assumption and observed behavior, not only the repair.
  Evidence: The user requested a direct account of why a deployment assumption failed.
  Apply when: Closing investigations or correcting deployment assumptions.

- Takeaway: Treat Windows output-decoding failures separately from application-stage failures. Re-run CLI and GitHub CLI log inspection with UTF-8 output before classifying a workflow or CI run as failed.
  Evidence: A CP949 failure occurred after application work completed, and UTF-8 `gh` log output exposed the real CI failure when a helper itself raised `UnicodeDecodeError`.
  Apply when: Non-ASCII CLI or GitHub Actions logs fail to render under Windows system encoding.
