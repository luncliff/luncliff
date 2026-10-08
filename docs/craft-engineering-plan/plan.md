# Plan: craft-engineering-plan

Plan for the skill, rebuilt from the user's requirements. Execution state lives in [worknote.md](worknote.md); evidence lives in [research.md](research.md).

## Sources of intent

- User requirements, newest first. T1 to T9 are turns of session `4b38f125`; P is session `3fe8d453`.
  - T9: A plan is about alignment with the user, not approval. Re-read the whole session, evaluate whether a model could make a plan with a useful approach and a clear strategy, and ground the skill in what the prompting guides say together.
  - T8: Keep the plan artifact (`plan.md`) apart from the loop's execution record (`worknote.md`). Planning may lack write access, so its result is plan content, not a file. Drop the "Why:" lines. Give purpose-level directions so the model reasons and gathers basis for each plan section: planning reasons why from governance, guidance, requirements, and concerns, then scopes what; workers take context from the plan and decide how.
  - T7: Find every contradiction and every mismatch with the requirements and concerns, and fix them.
  - T6: Separate planning from the engineering loop that starts after approval. Follow the gathered prompting guides. Keep session knowledge and decisions in artifacts.
  - T5: Write a skill of instructions, not an article. Keep the stacked knowledge. Review harshly. Never be verbose.
  - T4: Too verbose. Organize with H3; prefer lists to tables; no exact paths; WHY and WHAT ahead of HOW.
  - T3: Eight concerns:
    1. Documents define the to-be state; code follows.
    2. List visible user-level governance and prior alignments to prevent over-engineering and waste.
    3. Create and maintain scripts (uv-launched Python, dotnet-launched C#), snippets, and documents during the session. Scripts are mostly programmatic; non-deterministic tasks such as artifact review may use an LLM agent on `gpt-6-luna` that inherits system configuration and permissions.
    4. Phase or iteration loop with regular reminders, like the Ralph loop, for any IDE or environment.
    5. Regular goal, plan, and alignment reminders for recovery.
    6. Worknotes for complex, team-based tasks.
    7. Coordinated parallel work with aggressive subagent delegation to prevent context mixing; worknotes for sharing, tracking, and handoff.
    8. Plans for maintenance, debugging, architecture review, requirements engineering, and docs-code-test mismatch removal.
  - T2: Remove `craft-plan` and `phased-plan`. Leave `references.md` unchanged.
  - T1: Merge the two skills into one reusable, developer-friendly planning skill. Compose 2026 AI-native engineering and model prompting guidance. No over-engineering. Concise, self-contained `SKILL.md`.
  - P: One concise, self-contained `SKILL.md`; only what matters for the shared concerns.
- Governance, from the project `AGENTS.md` and user-level instructions: proceed by default; ask only blocking questions; no backward compatibility; done means an observed result; failing test first; real dependencies; verify each phase; a written artifact carries state; one purpose per document; history stays in version control.
- Guidance: the sources in [research.md](research.md).

## Purpose

- Give agents one skill that turns intent into an approved plan covering why and what, and lets workers execute it in a recoverable loop that decides how, in any host.

## Constraints

- One self-contained `SKILL.md`, with no bundled files.
- Concise instructions: H3 sections, lists, no tables, no exact paths, no "Why:" lines.
- Planning output is plan content, saved as `plan.md` once alignment holds. `worknote.md` is only the execution record.
- The plan aligns with the user; it is not an approval gate. It must carry a strategy a worker can follow.
- Keep the knowledge listed below.
- Over-engineering here means adding files, sections, or HOW-level detail that no requirement asks for.

## Knowledge to keep

- From `craft-plan`: purposes split with the one that yields; sourced, labeled findings and checks for unverified claims; facts settled by the agent and decisions left to the user; success and exit conditions; acceptor; priority with its criterion; options including doing nothing at equal depth; per-phase evidence and failure signal; re-read point; gap mapping for an existing plan; writing register.
- From `phased-plan`: smallest verifiable phase; one at a time; cleanup; failing test first; verification against the objective; fresh-context review; commit when authorized; push only on request; report; tracker update; an unrunnable check keeps the phase open.
- From [research.md](research.md): user instructions override the skill; approval follows a concrete plan; the approved plan sets the scope; workers continue without asking within it; one phase per iteration from a fixed starting point; a plan complete enough for a fresh context; subagent briefs with boundaries.

## Current state

- `craft-plan` and `phased-plan` are removed and staged. `SKILL.md` exists. Evidence and tool checks are in [research.md](research.md).

## Scope

- In: `.github/skills/craft-engineering-plan/SKILL.md`, this plan, [worknote.md](worknote.md), and [research.md](research.md).
- Out: other skills, `references.md`, commits, and pushes.

## Done

- Success: every requirement and knowledge item above passes a strict review with quoted evidence; the plugin validator and markdownlint pass; the user accepts.
- Exit: the user stops or redirects the work.
- Acceptor: the user.

## Decisions

- D1: One file at `.github/skills/craft-engineering-plan/SKILL.md` (T1, P).
- D2: Two modes joined by alignment with the user; `plan.md` holds the plan and `worknote.md` the execution record (T6, T8, T9).
- D3: Documents that define the to-be state change before code (T3 item 1).
- D4: `gpt-6-luna` is the named model (T3 item 3), although `~/.codex/AGENTS.md` names GPT 5.6 Luna.
- D5: Workers continue between phases and stop only for a hard-to-reverse step, a requested review, or a user-owned decision; scope changes return to planning.
- D6: Output from LLM-assisted scripts is evidence, not approval (T3 item 3 with the user retrospectives).
- D7: Task artifacts stay in `docs/craft-engineering-plan/`, which `docs/.gitignore` keeps local.
- Open, user-owned: does "Confirm and review each phase" in `AGENTS.md` mean user confirmation? Default: verification plus review.

## Phases

- P1: Merge the two skills with the researched guidance. Evidence: validator and markdownlint pass.
- P2: Cover the eight concerns. Evidence: each concern can be quoted from the skill.
- P3: Apply the form constraints from T4 and T5. Evidence: no tables or paths, and a clean strict review.
- P4: Separate planning from the engineering loop (T6). Evidence: an explicit approval gate.
- P5: Separate `plan.md` from `worknote.md`, remove the "Why:" lines, and write purpose-level plan directions (T7, T8). Evidence: a strict review against this plan, and validator and markdownlint passes.
- P6: Reframe the plan as alignment, and add a strategy that a model can form from the guides (T9). Evidence: a Strategy and an Alignment section traceable to [research.md](research.md); strict review clean.
