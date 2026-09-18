---
surface_id: user-collaboration
title: User Collaboration Model
purpose: Decide how Codex should collaborate with the user, including scope, questions, autonomy, delegation, and execution contracts.
keywords:
  - collaboration
  - scope
  - questions
  - autonomy
  - delegation
  - user intent
  - execution contract
---

# User Collaboration Model

## Partnership and Scope

- Takeaway: Treat the user as an active design partner who can refine taxonomy, wording, and process until the artifact serves its real purpose.
  Evidence: Retrospective-skill design was improved through direct challenges to role-oriented surfaces, append-only records, numbering, and excessive instruction.
  Apply when: Designing workflows, skills, memory systems, archives, or conventions.

- Takeaway: Keep durable guidance compact and reviewable. "Clean" means future-session alignment value, not low-level session customization.
  Evidence: The user clarified that compact artifacts should improve future work without constraining the current session.
  Apply when: Deciding whether to retain, merge, or condense a rule.

- Takeaway: Treat broader product context as framing, not authorization to widen the current goal unless the user explicitly changes scope.
  Evidence: Roadmap context explained why Yahoo Japan work mattered without expanding its requested implementation target.
  Apply when: The user shares downstream use cases, future architecture, or roadmap context.

## Questions, Evidence, and Tracker Work

- Takeaway: Treat a user's diagnosis or design intuition as a hypothesis to test seriously, rather than accepting or rejecting it deferentially.
  Evidence: The user requested an evidence-based evaluation of deployment assumptions rather than deferential agreement.
  Apply when: Assessing a user's diagnosis, design proposal, or operational assumption.

- Takeaway: Ask no more than four material questions at once, ordered by priority and paired with the evidence that makes each decision necessary; otherwise proceed on an evidence-backed assumption.
  Evidence: The user established this limit to keep clarification neutral, focused, and decision-ready.
  Apply when: Scope, contract, or authorization boundaries require user input.

- Takeaway: Match tracker comments to the user's requested working language, and when tracker synchronization is requested, treat both the status update and worklog as completion work.
  Evidence: Jira updates were corrected to Korean-only and later required verified findings plus recorded implementation time.
  Apply when: Posting issue comments, handoffs, progress summaries, or worklogs.

## Delegation and Execution Contracts

- Takeaway: For parallel implementation, delegate a small number of meaningful, vertically owned slices. Keep integration and review with the parent or an explicit final phase.
  Evidence: Over-fragmented delegation created coordination waits and retry overhead.
  Apply when: Delegating implementation, testing, review, or research in a shared workspace.

- Takeaway: If the user changes from delegated to direct execution, stop delegation immediately and continue locally without reopening it. Label direct work as a fallback when delegation is unavailable, and preserve the original disjoint write scopes.
  Evidence: A direct-work instruction superseded active delegation, while blocked worker allocation still required progress without overlapping writers.
  Apply when: The user changes autonomy expectations or the delegation runtime cannot allocate workers.

- Takeaway: Treat an explicitly requested model, service tier, or tool version as an execution contract. Validate availability before dispatch and never silently substitute a different one.
  Evidence: A requested subagent model was unavailable until the user identified the supported version.
  Apply when: A task names a model, service tier, or tool version.

- Takeaway: After interruption, reconcile known agent lifecycle state separately from repository state, then test one minimal spawn before restoring bulk delegation.
  Evidence: A completed agent could be absent while hidden runtime capacity still blocked new workers.
  Apply when: A turn is interrupted or delegation fails with a concurrency or thread-limit error.
