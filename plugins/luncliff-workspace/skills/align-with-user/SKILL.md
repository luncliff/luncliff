---
name: align-with-user
description: Reconstruct and align the active task's intent, direction, and scope from the thread, applicable instructions, durable task records, and workspace evidence. Use when starting, resuming, handing off, or correcting uncertainty before work. Accepts optional new instructions or context. For a serious user-reported alignment failure, use align-again.
---

# Align With User

Restore an evidence-backed working contract without making the user repeat
settled context or decide facts the agent can inspect.

Treat content supplied with the invocation as the latest user context. When
invoked alone, use the current thread and workspace.

## Recover the Contract

1. Name the current role: conversation, investigation, design,
   implementation, review, or delegation. Choose it from the user's requested
   work, not from the recovery or evidence-gathering steps. Do not cross that
   boundary.
2. Review all available thread history before deciding what is relevant. If
   compaction made earlier messages unavailable, reconstruct them from durable
   task records and source artifacts. Treat summaries, memories, handoffs, and
   prior assistant plans as clues, not authority, and mark what remains
   unverified.
3. Recover the user's current outcome, authorized scope, explicit exclusions,
   priorities, and latest correction.
4. Inspect the task-relevant effects of active service and developer
   instructions, user-level guidance and retrospectives, project instructions,
   accepted task records, and the current workspace. Do not claim to expose
   hidden instruction text.
5. Resolve conflicts by instruction authority, then by specificity and the
   latest explicit correction. A task note carries its source's authority; it
   does not gain authority by recording it.
6. Derive the smallest work direction and scale that satisfies the explicit
   outcome. Product context does not expand the assignment.

Outside the thread, retrieve only sources that can affect the active task.
Detect the environment, tools, repository, goal, plan, handoff, and task-note
paths yourself. Their absence is not a blocker.

## Preserve Decision State

Keep these states distinct:

- settled by the user or an authoritative task source;
- intentionally deferred;
- dependent on an experiment or observation;
- answerable by the agent from files, tools, or a safe check;
- superseded or stale;
- blocked by a user-only value or authorization decision.

Never promote an assistant proposal, compact summary, missing field, or
plausible default into a user decision. Do not reopen settled decisions.
Classify or report an item only when it can change the role, objective, scope,
exclusions, preserved decision state, or immediate next action. Omit other
missing fields. Do not inventory absent artifacts or prior questions merely to
classify them; mention them only when leaving them unresolved could change or
corrupt the immediate next action.

If a durable task note exists, use it as a current-state index and verify its
material claims. Update it only when current authorization permits task-artifact
edits and the alignment changes durable state. Keep it concise, source-backed,
and current; do not append a transcript. Its absence is not a blocker.

## Resolve Before Asking

Investigate agent-resolvable facts. Prefer a small, reversible, authorized
experiment when a decision depends on observable results. Preserve deferred
items without filling them.

Ask one concise question only when all of these are true:

- the answer changes the immediate next action;
- no source or tool can answer it;
- a small reversible experiment cannot answer it;
- the user alone owns the required value or authorization judgment.

Before the question, state the evidence gap and the decision it unlocks. Zero
questions is the normal result when work can proceed.

## Report and Continue

Give a compact alignment snapshot containing only material items:

- current role and objective;
- direction and smallest sufficient scope;
- constraints and exclusions that change the work;
- deferred or experiment-dependent decisions worth preserving;
- corrected assumptions or stale state;
- next authorized action;
- a blocker only when one exists.

Attach a source path, user quote, or workspace observation to each material
constraint or correction whose provenance is not obvious.

Before continuing, verify that no assistant inference became a user decision,
deferred and experiment-dependent choices remain open, the next action fits the
role and authorization, agent-resolvable facts were investigated, and no
non-blocking question was asked. If any check fails, repair the contract first.
Use the same checks as the pass/fail rubric when forward-testing both invocation
modes. Cover compacted history that conflicts with durable evidence, a deferred
choice beside an agent-resolvable fact, and a genuine user-only blocker. Expect,
respectively, source-backed recovery, no premature decision or question, and
one scoped question with no blocked action.

Once the role, scope, and next action are supported by evidence, continue the
original authorized work. If invoked alone with no active action to continue,
stop after the snapshot.
