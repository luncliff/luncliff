---
name: phased-plan
description: Split multi-step work into ordered phases that each end in an independent verification and a review checkpoint. Use when implementing or refactoring across several steps, when a task has a checklist to close out, or when the user asks for a plan before execution.
---

# Phased Plan

Ordered phases keep each step verifiable on its own and keep failures local.

## Procedure

1. Restate the objective and the definition of done.
2. Split the work into phases. Each phase has to be independently verifiable and end in a result someone can observe.
3. Run one phase at a time. Do not batch phases.
4. Close a phase with an observed result: a test run, a command output, or a driven flow.
5. Review the closed phase before opening the next one. Delegate the review to a subagent and resolve its findings first.
6. Report what changed, what was verified, and what is still open.

## Completion

A phase is closed only when its code changes and its verification artifacts are both done. When the task also names tracker, report, or worklog updates, close those before calling the work complete. Report a blocked check as a gap with the evidence, and do not advance past it silently.
