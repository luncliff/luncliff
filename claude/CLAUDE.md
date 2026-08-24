# User-level Coding Agent Instructions

Applies to the main thread and all spawned subagents. Project files override specific points.

## Conduct
- List the objectives and tack it. No scope expansion, no unrequested features, refactors, or commentary.
- Choose the simplest implementation that fully meets the current requirements. Avoid speculative abstractions, configuration, and indirections. Continuously apply KISS, YAGNI.
- Prefer small, verifiable changes.
- Act when info suffices; ask only when a gap blocks progress. Questions: concise, targeted. Clarification insufficient → AskUserQuestion tool, not a guess.

## Design & architecture
- Make architectural decisions for the long term. Do not accept a stopgap that only works for now and is meant to be replaced later.
- Do not preserve backward compatibility. Remove obsolete paths instead of adding compatibility layers, fallbacks, or migrations.
- Grow systems through reusable components and layers. Add new capability on top of a product that already works. Never trade a working product for unfinished complexity.
- Keep components modular and concerns clearly separated. Apply SOLID. Design for debuggability.
- Prefer established, maintained libraries when they reduce overall complexity and improve reliability. Do not reimplement common functionality without a clear reason.
- Lean on dependencies already in the project before writing your own implementation or adding new packages. Do not assume a library lacks a capability without checking its documentation and types.

## Verify (unprompted, continuous)
- Every claim is a hypothesis until checked against code, tests, or a source — including the user's claims.
- Re-check prior responses; contradiction → surface it plainly.
- Back claims with reasoning, data, source, or a run.
- Hunt complexity to cut on every change. Simplifications small, verifiable, separate from behavior changes.

## TDD / evidence
- Default: failing test → pass → refactor. Non-trivial impl → `tdd` skill.
- "Done" requires an observed reproducible result (test run, driven flow, command output), not inspection. Use `verify`.
- No fake implementations, no mocks, no stubs. Real behavior, real deps, live tests.
- Dependency truly unexercisable (paid API, destructive) → stop and ask. Never substitute a fake.

## Session
- Main thread: discuss scope/assumptions/design whenever unclear; refine, split, order tasks, define goals and definition-of-done checklists.
- While grilling/asking → report progress.
- Execute work via subagents, not the main thread.

## Subagents & model
- Default Haiku / Sonnet. Haiku: mechanical, low-ambiguity. Sonnet: standard impl/analysis/review. Opus: hardest reasoning only.
- State chosen model when delegating.

## Phased plans
- Ordered phases, each independently verifiable. No batching.
- Phase end → confirm its requirements and instructions met before the next phase.
- After each phase → `/codex:review` (`/codex:adversarial-review` for high stakes). Resolve findings before advancing.

## Handoff (session↔session, subagent↔subagent)
- State passes through a markdown artifact, never implicit context. Use `handoff`.
- Doc is the source of truth: state, decisions, open questions, next actions.
- Reference existing PRDs/plans/ADRs/diffs by path. Redact secrets and PII.

## UI / UX / visual
- Design through an HTML mockup (`prototype` / `frontend-design`).
- Pair every mockup with a markdown spec to reproduce it: layout, components, states, interactions, tokens (color/spacing/type), data assumptions, rationale. Mockup and spec travel together.

## Documents
- Distribute documents by purpose and content. Separate requirements, specifications, research, plans, tasks. Follow any existing template.
- Documents define the expected state (To-be for specifications, As-is for the others). Do not contain document history and change notes unless they are necessary.
