# Worknote: craft-engineering-plan

Execution record for [plan.md](plan.md). Current state only; version control and the chat keep the history.

## Phase status

- P1 to P4: done. Later corrections reworked their output; see "Rejected approaches and guards".
- P5: done; awaiting user acceptance. Evidence: validator passes; markdownlint reports 0 issues on the skill and both artifacts; the skill has 0 "Why:" lines, tables, or paths; `references.md` is unchanged against HEAD. Strict review: 6 fixes applied. Not applied: H3-only headings (they break markdownlint heading increments), removing the ordered reasoning (T8 asks for it), limiting worknotes (single changes already skip them), and a general "trim" (no specific target).
- P6: done; awaiting user acceptance. Evidence: validator passes; markdownlint reports 0 issues; plan approval wording removed (the one remaining "approval" says LLM output is evidence); Strategy and Alignment sections added from the guidance in [research.md](research.md).

## How decisions

- Research ran in three parallel subagents; the two model prompting guides were fetched directly. Sources are in [research.md](research.md).
- Tool claims were checked by running uv, dotnet, codex, and copilot locally before the skill used them.
- Reviews run as fresh-context subagents on GPT-6 Luna, with [plan.md](plan.md) as the requirement source.
- Task artifacts live in `docs/`, where `docs/.gitignore` ignores `*.md`, so they stay local.

## Discoveries

- `~/.copilot/copilot-instructions.md` and the project `AGENTS.md` prefer GPT-6 Luna; `~/.codex/AGENTS.md` prefers GPT 5.6 Luna.
- The same files differ on pausing between phases: "Confirm and review each phase" against pausing only for a scope change, a hard-to-reverse step, or a requested review.
- Codex keeps its own plan per session and re-reads it after compaction through a user hook.
- One existing worknote grew to 187 lines of timestamped resume entries; a current-state record avoids that.

## Rejected approaches and guards

- Reference files and scripts in the skill folder (P). Guard: compress instead of adding files.
- A 117-line rule-dense skill and long reports with tables (T4). Guard: short instructions and short reports.
- Prose principles, with knowledge cut to save length (T5). Guard: check the knowledge list in [plan.md](plan.md) before cutting.
- Planning and execution mixed in one list (T6). Guard: an approval gate between the two modes.
- Plan and execution record mixed in one worknote, plus "Why:" lines (T8). Guard: `plan.md` for why and what; `worknote.md` for how and evidence.
- Lenient reviews reported as full coverage. Guard: quoted evidence for each requirement.
- GPT-5.6 Luna used once for subagents. Guard: re-read the model preference before dispatch.
- The plan framed as an approval gate, with no strategy (T9). Guard: the plan is the user alignment and carries the strategy; check it against the planning guidance in [research.md](research.md).

## Checks

- `node scripts/validate-plugins.mjs`
- `npx --yes markdownlint-cli2@0.23.3 --no-globs ".github/skills/craft-engineering-plan/SKILL.md"`

## Next

- User acceptance.
