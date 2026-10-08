---
name: craft-engineering-plan
description: 'Craft user-aligned engineering plans and execute them in verified agent phases. Use for multi-step features, debugging, refactoring, migrations, architecture or requirements work, and docs-code-test drift. Planning settles purpose, scope, strategy, and evidence; workers choose the implementation and track progress separately.'
---

# Craft Engineering Plan

Two artifacts with separate roles:

- `plan.md`: the plan aligned with the user. It states why the work exists, what must be done, and the strategy to get there, and it changes only through re-alignment.
- `worknote.md`: the engineering loop's execution record. Workers record how each phase was done, the evidence, and what comes next.

Planning aligns the why, the what, and the strategy with the user; workers decide how. When the change can be described in one sentence and has a known check, skip both artifacts unless the user asks for a plan. The user's latest instruction overrides this skill; if a rule here blocks requested work, quote it.

## Planning

Planning aligns the agent with the user before any work starts, so the work solves the right problem. Reason through these sections in order; each builds on the basis of the one before. Write every section so a worker can act on it without asking: name things outright, use counts and units, give the reason behind each constraint, and state each rule once. Deliver the plan as the response, since planning may run without write access. For an existing plan, map it onto these sections and report the gaps first.

### Sources of intent

- Before forming a view, read what governs the work: user-level and project instructions, engineering and prompting guidance, the user's requirements and concerns, and prior alignments such as accepted decisions and corrections from this and earlier sessions.
- List what applies with its source. Resolve conflicts by authority, then specificity, then recency, and leave user-owned conflicts open.

### Purpose

- State why the work exists: the outcome the user needs, for whom, by when, what someone can do afterward that they cannot do now, and the problem it removes.
- Split purposes that pull apart and state which one yields. Every later section serves the purpose.

### Constraints

- From the sources, derive what must hold, what is excluded, and what would count as over-engineering for this work. Quote the wording that matters.

### Current state

- Establish what is true now: documented intent first, then code, tests, and runtime behavior.
- Label each finding observed, inferred, or assumed, with its source. Mark unverified claims with the check that settles them.

### Scope

- Define what changes between the current state and the to-be state, and what does not.
- Name the documents that define the to-be state. When intended behavior changes, plan their update before any code phase; code and tests follow them.

### Done

- Define the success condition, the exit condition, who accepts, and the evidence for each, phrased as behavior someone can observe. The task type sets the evidence:
  - Feature: the specification, acceptance tests, and current-state docs agree.
  - Bug or debugging: a failing reproduction passes, and the root cause is named.
  - Refactor: tests that pin behavior pass unchanged.
  - Maintenance, migration, or upgrade: checks pass on the new state, and obsolete paths are gone.
  - Docs, code, and test mismatch: the accepted contract decides, or the user when none exists; all sides then agree.
  - Architecture review: a sourced decision record is ready for acceptance.
  - Requirements engineering: testable requirements are ready for acceptance.

### Strategy

- State the approach that closes the gap between the current state and the to-be state, and why it should work: the findings it rests on, what it optimizes, and what it gives up.
- Resolve the key decisions in the plan with their reasons; leave incidental implementation choices to the workers.
- Name the unknowns and risks that could break the approach, and settle the largest first through a research or prototype phase whose result decides whether the approach stays.
- When a material trade-off belongs to the user, give the recommendation and its alternatives, including doing nothing, at equal depth.

### Phases

- Turn the strategy into the smallest phases that each deliver an observable step toward the goal and can be verified alone. Order them by dependency and risk, then by a priority whose criterion the plan states.
- For each phase, give its goal, why it is needed, the evidence that closes it, the signal that it is failing, and whether it can run as an independent lane. For parallel lanes, settle dependencies, shared interfaces, and ownership boundaries first. Leave how to the workers, and set a re-read point for long work.

### Alignment

- Settle facts yourself. Ask the user only about the hard parts that the sources do not answer and that change the plan: intent, edge cases, trade-offs, and concerns.
- Ask in rounds: every open question whose prerequisites are settled, each with a recommended answer and what it changes. Fold the answers into the plan, recompute the open questions, and state an assumption for anything left that does not change the plan.
- Alignment holds when the user confirms the plan states their intent. End a plan-only request with the plan; start the engineering loop only when the user has requested implementation, in the original request or later. The worker then saves the plan verbatim as `plan.md` where writing is allowed and starts `worknote.md`.

## Engineering loop

Workers execute `plan.md` one phase per iteration, like a Ralph loop, in any IDE, CLI, or agent host. Continue without asking within the aligned scope; stop for a hard-to-reverse step, a requested review, or a user-owned decision.

### Ground every iteration

- Start each iteration from `plan.md` and `worknote.md`, in a fresh context where possible, and restate the goal, the current phase, the binding constraints, and the next action.
- Do the same after compaction, interruption, handoff, a correction, or a model or host switch. To resume, first verify the done claims in `worknote.md` against the workspace.

### Decide how

- Turn the phase goal into concrete actions for this environment, such as files, tools, commands, and checks, within the constraints in `plan.md`. Work outside the phase becomes a follow-up.

### Prove the phase

- A phase is done only when the evidence named in `plan.md` is observed: for changed behavior, a test that failed first now passes; checks run against real dependencies; leftovers the phase does not need are removed; a fresh-context review finds nothing open. A check that cannot run keeps the phase open.
- Report what changed, what was verified, and what remains open. Commit only when authorized; push only on request.

### Keep the worknote

- Record, as current state: phase status with evidence, how-decisions with reasons, discoveries, reusable artifacts, blockers, handoff notes, and the next action. Version control keeps the history. Update any tracker the task names.
- Each worknote has one writer. A lane that spans runs or people keeps its own worknote, linked from the task's.

### Reuse through artifacts

- Create and maintain scripts (uv-launched Python or dotnet-launched C#), snippets, and documents for repeated work, and list them in `worknote.md`. Keep only what will be reused.
- Scripts are deterministic by default. For non-deterministic judgments such as artifact review, a script may call an LLM agent on `gpt-6-luna` only after checking that the installed CLI supports the model and uses the user's existing configuration and permissions. Do not add secrets, bypass permissions, or silently substitute models; its output is evidence, not approval.

### Coordinate

- Delegate bounded phases or lanes to subagents by default, giving each `plan.md`, its worknote, and its boundaries. Run lanes in parallel only when their dependencies and shared interfaces are settled and their writes do not overlap.
- The parent integrates lane results, verifies them against the phase goals and done criteria in `plan.md`, and keeps the task worknote. Record each model choice, preferring `gpt-6-luna` for bounded lanes.

### Re-align

- A correction updates the constraints first, then every affected phase and lane.
- When the objective, scope, or constraints change, a plan assumption fails, or a discovery breaks the strategy, stop the affected work and re-align with the user before continuing it.
