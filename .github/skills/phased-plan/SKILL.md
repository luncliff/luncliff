---
name: phased-plan
description: 'Execute multi-step SDLC work as ordered coding phases. Each phase closes with cleanup against over-engineering, tests, verification against its objective, a review checkpoint, and a Git commit. Use for implementation, refactoring, migration, or upgrade work that spans several changes or has a checklist. Scope is codebase execution; use formulate-plan first to frame the objective or plan non-engineering work.'
---

# Phased Plan

Ordered phases keep each step verifiable on its own and keep failures local. This skill covers execution against a codebase: the objective is already settled, and the question is how the change lands.

When the objective is not settled — or the work is not code — run `formulate-plan` first and bring its task statements here.

## Procedure

1. Restate the objective and the definition of done.
2. Split the work into phases. A phase that cannot be verified without the next one is not a phase; merge it or move the boundary.
3. Run one phase at a time. Do not batch phases.
4. Close the phase with the four steps below, in order.
5. Review the closed phase before opening the next one. Delegate the review to a subagent and resolve its findings first.
6. Report what changed, what was verified, and what is still open.

## Closing a phase

| Step | What it does | What it leaves behind |
| --- | --- | --- |
| Cleanup | Take out what this phase added and no longer needs: dead paths, unused abstractions, fallbacks, scaffolding, commented-out code, configuration nothing reads. Anything the phase objective does not require comes out before the commit. | A diff carrying only the change the objective asked for |
| Validation | Run the tests. A new behavior arrives with a test that failed before the change and passes after it. Real behavior and real dependencies. | The command and its result |
| Verification | Put the observed result next to the phase objective and the definition of done, and state which parts each one closes. Inspection is not verification. | The objective restated beside the observation that settles it |
| Commit | Commit the phase as one unit. The message names the objective and the verification. Nothing from this phase stays uncommitted when the next one opens. | One commit per phase |

Pushing is a separate act and needs the user to ask for it.

## Completion

A phase is closed only when all four steps are done. When the task also names tracker, report, or worklog updates, close those before calling the work complete. Report a blocked check as a gap with its evidence, and do not advance past it silently.
