# Work Management

## Entries

### Use frontier interviews for coupled decisions

When a design has several interdependent choices, present the current decidable frontier with recommended answers, wait for correction, then recompute. This converges faster than one open-ended question and keeps each round tied to a settled goal.

### Ask only material questions

Read available code, docs, and tool-owned sources before asking. Limit a round to the few questions that unblock the current goal, show each question's observed conflict, and proceed with stated defaults when the answer would not change the work.

### Keep scope as an execution gate

Turn ordered objectives and explicit exclusions into the gate before editing. A failed acceptance item does not authorize work in an excluded file or module; report the scoped blocker and wait for the user to expand scope.

### Separate investigation from implementation

When the user asks for investigation, return verified facts, open choices, and proposal status without mutating documents or code. Implementation, document rewrite, and fresh validation runs are separate authorization boundaries unless the request includes them.

### Maintain a live constraint ledger

For artifacts refined across turns, carry forward every accepted format, content, scope, and language constraint. After deduplication was requested, copying 12 skills into a plugin with a parity check restored the rejected duplication. Test each later design against the ledger; a refinement changes only its named constraint.

### State verification before done

Define what observed result will close the task before claiming it works. Artifact inspection, syntax checks, runtime checks, and remote verification close different claims; report the exact claim each check supports.

### Validate before documenting behavior

Do not document an unverified dependency as the repository’s installation behavior. First run the real command in an isolated root, distinguish a successful sub-operation from an overall failure, then update configuration or documentation. This prevents a dry-run or source inspection from being reported as end-to-end support.

### Delegate only separable work

Use subagents for bounded slices with a complete prompt, owned output, and review boundary. Keep whole-session synthesis, quick status checks, plan reminders, and local repository inspection in the parent thread.

### Review each phase before opening the next

Multi-phase implementation should close each phase with cleanup, focused verification, and review before the next phase starts. When review finds a correctness gap, reopen the phase, add one regression case, repair, rerun, and re-review.

### Resume by restating state and next step

After interruption, compaction, or model switch, restate the active objective, repository state, known agent lifecycle state when relevant, and next concrete step before spending more execution capacity.

### Preserve unrelated workspace changes

Do not commit, discard, or manipulate edits outside the requested scope. If unrelated changes are present, verify the intended work independently and report preserved paths rather than cleaning the workspace for cosmetic neatness.

### Report blocked follow-up separately

When one correction is complete but the intended follow-up remains blocked, report both states separately. Removing an incorrect dependency can be finished while adding the correct one waits on unavailable tooling or unverified syntax.

### Update retrospective notes by merging

Before creating a new retrospective artifact, read the relevant purpose files, merge overlapping lessons, and rewrite them as the current best version. This keeps accumulated guidance compact enough to review and continue maintaining.

### Restate the goal before restructuring

An unrequested maintenance skill was added, and APM workspace setup was treated as plugin scope, requiring two `/align-again` corrections. Before structural edits, restate the goal, included artifacts, and exclusions, then check every planned file against them.

### Evaluate challenges against the goal

When the user challenged `plugins/`, the response defended format legality instead of checking the goal of one maintained source. Treat a challenge as a hypothesis: test it against the goal and evidence, then change or explain without reflexive agreement or defense.

### Resolve recoverable blockers before reporting

A main-profile cache error produced a partial report instead of an immediate isolated-profile retry. When an in-scope blocker has a local, reversible workaround, apply it and finish the stated verification before reporting.

### Match the requested change size

The README update was too verbose, and a `temp` ignore request produced a redundant `plugins/**/temp/` rule although `temp` already matched every depth. Check existing coverage first, then make the smallest edit that satisfies the request.
