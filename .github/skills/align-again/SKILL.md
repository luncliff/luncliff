---
name: align-again
description: Recover after the user identifies a serious alignment failure, ignored instruction, forbidden action, or wrong result. Reconstruct the requested contract, locate the exact divergence, invalidate stale assumptions, and resume the smallest authorized correction. Accepts optional corrective context. Use align-with-user for ordinary alignment.
---

# Align Again

The user has identified an out-of-alignment result. Stop the current trajectory.
Do not make the user repeat prior instructions, defend the work, or continue from
the plan that produced the failure.

Treat content supplied with the invocation as the latest correction. The
reported failure is evidence that alignment broke, not proof of its exact cause.

## Establish What Failed

1. Record the user's reported mismatch without confirming its cause. Avoid
   generic praise, reassurance, or a performative apology.
2. Review all available thread history before deciding what is relevant. If
   compaction made earlier messages unavailable, reconstruct them from durable
   task records and source artifacts, and mark what remains unverified.
3. Recover the original request, latest user correction, authorized scope,
   exclusions, and any explicit deferred decisions. Choose exactly one active
   role from `conversation | investigation | design | implementation | review |
   delegation`; the roles are mutually exclusive for this turn. Do not cross
   the chosen boundary. Choose the role from the user's requested work, not
   from the recovery or evidence-gathering steps.
4. Inspect the task-relevant effects of active service and developer
   instructions, user-level guidance and retrospectives, project instructions,
   accepted task records, durable task notes, and the actual workspace or
   produced output. Do not claim to expose hidden instruction text.
5. Compare what was requested, what the agent did, and what the evidence now
   shows. Separate:
   - instruction conflict or a genuinely blocking gap;
   - agent divergence from an available instruction;
   - stale task state or compacted context;
   - changed environment evidence;
   - an unsupported assistant assumption or proposal.
6. State the exact divergence, its evidence, and its effect on the user's work.
   Do not infer motive.

Thread summaries, memories, handoffs, and prior assistant plans are recovery
clues. They cannot override a current user correction or their original source.
Resolve conflicts by instruction authority, then by specificity and the latest
explicit correction. A task note carries its source's authority; it does not
gain authority by recording it.

## Restore the Working Contract

- Mark the failed trajectory and incompatible assistant assumptions as
  superseded.
- Preserve decisions the user intentionally left open or dependent on an
  experiment.
- Detect and verify environment facts instead of asking the user for them.
- Restore the smallest direction and scope that satisfy the original request
  plus the latest correction.
- Apply a correction across the full affected surface when the user's feedback
  states a general rule, not only one example.
- Do not classify, fill, or report a missing field unless it can change the
  immediate correction.

If a durable task note exists, correct its current state when authorized. Keep
the original source and decision status visible. Do not turn assistant inference
into a settled decision or append a conversation log.

## Correct Without Expanding

Take the smallest reversible corrective action already authorized by the
restored task. Do not add features, redesign adjacent work, create replacement
artifacts, delete or revert user work, make external writes, or incur new cost
unless the restored instructions authorize it.

Ask one concise question only when a user-only value or authorization decision
blocks the immediate correction and neither evidence nor a safe experiment can
resolve it. Explain what the answer changes. Otherwise, ask nothing.

## Report and Resume

Lead with the recovery outcome. Include only:

- the specific failure and supporting evidence;
- `Role: <one active role>`, followed by the restored objective, scope, and
  exclusions; never combine roles;
- assumptions, plans, or state now invalidated;
- the correction taken or the immediate corrective action;
- remaining uncertainty only when it changes the work;
- a blocker only when one exists.

Attach a source path, user quote, or workspace observation to each material
failure or correction whose provenance is not obvious.

Before resuming, verify that the failed trajectory is superseded, no assistant
inference became a user decision, deferred and experiment-dependent choices
remain open, the correction fits the role and authorization, agent-resolvable
facts were investigated, unrelated user work is untouched, and no non-blocking
question was asked. If any check fails, repair the contract first. Use the same
checks as the pass/fail rubric when forward-testing both invocation modes.
Cover a stale summary that widens authority, a claimed bad edit absent from a
dirty workspace, and a genuine user-only blocker. Expect, respectively, restored
authority without mutation, separation of the claim from unrelated observed
work, and one scoped question with no blocked correction.

Once the restored contract supports a safe next action, resume the original
work in the same turn. Do not stop merely to request confirmation that alignment
has been restored.
