---
name: craft-engineering-plan
description: 'Create, review, resume, or execute an evidence-based engineering plan. Planning turns session alignment, workspace evidence, and research into a traceable case for change, as-is and to-be views of the affected system, objectives, and acceptance criteria that converge on one task direction; execution runs a fresh-context, Ralph-style loop until every criterion has observed evidence. Use for multi-step features, bugs, refactors, migrations, architecture, requirements, docs-code-test drift, and broad cross-cutting changes; for work with meaningful scope, dependencies, risks, open questions, or acceptance decisions; and for work that spans sessions, agents, or parallel lanes.'
---

# Craft Engineering Plan

Produce a plan that converges on one clear task direction and lets a user,
reviewer, or returning agent reconstruct the reasons for the work, the target
state, and the evidence that proves it. Planning builds this context with the
user; workers own the approach to each objective within the plan's
constraints and their environment's permissions. Expect complex, long-running,
broad work, and keep its state in durable records that any context, session,
or agent can resume from.

## Choose the operating mode

Infer the mode from the request, and ask when the choice changes the
deliverable.

- **Plan:** run the planning workflow and deliver the plan as the response.
  Implementation starts when the user requests it.
- **Review:** map an existing plan onto the planning workflow, report its gaps
  and contradicted claims with evidence, and revise it on request.
- **Execute:** establish or reuse an aligned plan, persist it, and run the
  execution loop.
- **Resume:** re-ground from the durable records, verify recorded progress
  against the workspace, and continue the loop.

Scale the depth to the work. A change that one sentence and one known check
fully describe proceeds directly with that check, and an explicit request for a
plan or a loop always receives one.

## Register

Apply this register to everything the skill produces: plans, records,
guardrails, questions, and reports.

- Write affirmatively. State the condition to reach or keep, the action to
  take, and its trigger. Turn each exclusion into the boundary that holds,
  each prohibition into the required behavior, each refuted claim into the
  observed fact, and each absence into an observed count or state, such as
  zero matches. Name tool options by the mode they select, such as check
  mode.
- Restate each binding direction affirmatively beside its source location,
  and keep its exact wording in the cited source or research record.
- Stay neutral. Hold the user's premises, the existing design, and your own
  conclusions to one evidence standard, and place contradicting evidence
  beside the claim it affects. Prefer counts, units, and sources to evaluative
  words.
- State a recommendation once, with the criterion it optimizes and the fact
  that would change it. The user makes the value judgments.
- Name things outright and state each rule once, so every text reads correctly
  in a fresh context.
- Draft first, then revise the whole draft in a separate pass: read every
  sentence, including summaries, status lines, table cells, criteria, and
  guardrails, and rewrite each one that holds a negating word or failure
  framing in its affirmative form.

## Planning workflow

Each step builds on the steps before it, and the plan presents the results in
the same order, so a reader follows the reasoning from the session to the
direction. Widen the evidence first, then narrow to decisions.

### 1. Establish the governing basis

Gather the sources that shape the work:

1. the user's directives, requirements, reasoning, concerns, decisions, and
   corrections across the whole session;
2. prior alignments from earlier sessions and durable task records;
3. applicable user-level, repository, and environment instructions;
4. specifications, requirements, and architecture decisions;
5. current-state documentation, code, tests, configuration, history, and
   runtime behavior.

Record each binding direction with its source. Resolve conflicts by authority,
then specificity, then recency, and carry each conflict that belongs to the
user into the alignment step. This record is the spine of the plan: later
sections reuse its vocabulary and trace back to its entries.

Classify each material claim:

- **Fact:** supported by a cited source or an observed run.
- **Inference:** a conclusion drawn from facts, with its reasoning.
- **Assumption:** an open premise, paired with the check or decision that
  settles it.

### 2. Research beyond the current context

Treat the session context as the starting point of the investigation, and
expand it in rounds aimed at the decisions and assumptions still open:

- Widen the sources: project records, upstream documentation and issue
  trackers, standards, published research, and prior art from comparable
  systems. Run independent research lanes in parallel where the questions
  separate cleanly.
- Hold competing hypotheses: the user's framing, the existing design, and each
  alternative you form. Seek the evidence that would refute each one, and
  verify claims at their source by fetching, running, measuring, or
  reproducing them.
- Close each round with settled facts, sharper questions, or decisions, and
  start the next round from them.

Return to research whenever a later step rests on an open assumption. Research
reaches saturation when independent rounds across different source types leave
the findings stable and each material competing hypothesis has been tested
against source evidence. Cite each source beside the claim it supports, and
move bulky evidence into a linked research record.

### 3. Build the case for change

From the evidence, establish the need for the work:

- the current state of each affected subject, with as-is decision views and
  measured baselines;
- the change surface: every component, interface, file group, and consumer
  involved, with counts;
- the problem or opportunity: the people and systems it affects, its symptoms,
  its measured impact, and the trajectory of the current state;
- the root causes or driving forces, each stated as a hypothesis with its test
  and the observed result;
- the needs, each with an ID that cites its sources and findings.

When purposes pull apart, split them and state which one yields.

### 4. Define the target

Derive the target from the needs:

- objectives, each naming the observable change it delivers and citing its
  need IDs;
- to-be decision views paired with the as-is views from step 3;
- boundaries: the surfaces that stay as they are, and the place deferred work
  goes;
- constraints that every approach honors, each tied to its source, including
  the additions that would count as over-engineering here;
- the documents that define the to-be state; when intended behavior changes,
  these documents update first, and code and tests follow them.

Use the vocabulary of the source system and the repository for every name.

### 5. Define done

Turn each objective into acceptance criteria. Each criterion states:

- the behavior, artifact, property, or measure to observe, as a condition that
  holds;
- the check that observes it, with the expected result;
- the boundary or edge case it covers;
- the objective and need it proves, so its purpose survives every handoff.

Match the evidence to the work:

- **Feature:** acceptance behavior passes and affected contracts agree.
- **Bug:** a real reproduction shows the defect before the fix and the
  expected behavior after it, and the root cause explains both observations.
- **Refactor:** behavior-defining checks pass as written, and the named
  structural property is present.
- **Migration or upgrade:** the new path works, required data and interfaces
  are verified, and obsolete paths are removed.
- **Architecture or requirements:** decisions and requirements are sourced,
  consistent, testable where applicable, and ready for the named approver.
- **Documentation drift:** documentation, code, and tests agree with the
  accepted contract.

Acceptance evidence observes outcomes; activity such as edited files belongs
in progress records. For subjective criteria, define a binary rubric that a
fresh-context reviewer or model judge applies, and treat the verdict as
evidence for the acceptor. For broad work, define the inventory rule that
enumerates every target and the coverage invariant: a target counts as covered
when every applicable criterion passes for it. Name the success condition, the
exit condition, and the acceptor.

### 6. Choose the direction

Generate candidate directions widely, starting from incremental change,
structural redesign toward the long-term state, adoption of an existing library
or standard, and the current state as the baseline, and adding the options the
evidence suggests. Give each candidate its to-be view, and compare the
candidates at equal depth on benefit per need, cost, risk, reversibility, and
evidence.

Select the simplest direction that fully meets the needs for the long term,
and record:

- the key decisions with their reasons, alternatives, and accepted costs;
- watch conditions: run a pre-mortem in your reasoning by imagining the work
  has ended in a setback and listing the most plausible causes, then record
  each cause as an observable signal, its threshold, and the response, such
  as a check, an experiment, or an early phase;
- the experiment that retires the largest open assumption, scheduled first,
  with the results that keep or change the direction.

State the conclusion as one task direction in a few sentences. The approach to
each objective stays with the workers.

### 7. Phase the work

Group the objectives into the fewest ordered phases that each leave the system
coherent and verifiable on its own. Order them by dependency and risk, then by
a stated priority criterion. Give each phase:

- **Goal:** the observable state the phase reaches.
- **Criteria:** the acceptance criteria it advances.
- **Prerequisites:** the decisions, evidence, or phases it depends on.
- **Evidence:** the checks that close it.
- **Drift signal:** the observation that calls for correction or replanning.
- **Lanes:** parallel slices with their ownership boundaries, shared
  interfaces, and integration check.

### 8. Align with the user

Settle facts through investigation. Bring the user the decisions that the
sources leave open and that change the plan: intent, edge cases, trade-offs,
priorities, and hard-to-reverse steps. Ask in rounds: every open question whose
prerequisites are settled, each with its context, a recommended answer,
alternatives at comparable depth, and the effect of each answer. Fold each
answer into the plan: recompute the affected target, criteria, direction, and
phases, recompute the open questions, and rerun the quality gate. Record an
explicit assumption for each point the plan tolerates either way, and mark a
direction that rests on an open decision as contingent on it. Alignment holds
when the user confirms that the plan states their intent; in an autonomous
session, the recommended answers stand as visible assumptions.

## Plan output

Present the plan in this order:

1. **Summary:** the need, target, direction, status, and next action.
2. **Governing basis:** the user's directions and prior alignments, with
   sources.
3. **Evidence:** the current state with as-is views, and research findings.
4. **Case for change:** needs with IDs.
5. **Target:** objectives, to-be views, boundaries, and constraints.
6. **Done:** acceptance criteria, success and exit conditions, and acceptor.
7. **Direction:** candidates, decisions, watch conditions, and the first
   experiment.
8. **Phases.**
9. **Open decisions:** each with a recommended answer and its effect.
10. **Trace:** each user direction mapped to its needs, criteria, and phases.

Organize the content around the governing basis: keep the user's terms and the
order of their directions, and group needs, objectives, and criteria under the
directions they serve. Give needs, objectives, criteria, and phases stable IDs.
Keep evidence beside the claim it supports, and link files and sources where
the host renders links. Record each revision of an accepted plan in a decision
log with its reason. A plan-only request ends with the plan in the response.

### Decision views

Visualize the engineering subject at each point where the user decides:
structure, interfaces, data, runtime behavior, dependencies, deployment, and
measures. Keep the sequence of work in text.

- Pair each as-is view with its to-be view at the same scope, notation,
  units, and scales. Keep the names of stable elements, show each rename as
  old name → new name, and mark additions, removals, moves, and changes with
  a legend. Structure and placement differ exactly where they are the change.
- Match the view to the subject: paired directory trees for file
  organization, dependency graphs or matrices for modules, contract tables or
  class diagrams for interfaces, entity diagrams for data, sequence or state
  diagrams for behavior, deployment diagrams for topology, baseline and target
  tables or charts for measures, one to-be view per candidate beside a
  criteria matrix for options, and a trace matrix for coverage.
- Use the richest format the reader's host renders, such as Mermaid through
  the host's Markdown renderer or diagram tool, or an HTML chart, and text
  trees, tables, or diff blocks for plain-text hosts.
- Title each view with its subject and the decision it informs, and keep its
  scope readable at a glance; split a larger subject into several views.

## Execution loop

Execution runs as a loop in the style of the Ralph technique. The same
iteration brief runs repeatedly; each iteration starts from a fresh context,
completes one backlog item, and leaves its state in files and version control.
A driver, such as the parent agent, a host loop feature, or a shell loop around
an agent CLI, dispatches iterations until the task completes or a pause
condition arises. Prefer a fresh session or process for each iteration; where a
host repeats within one session, clear or compact the context at each boundary
and re-ground from the records. Work continues autonomously within the aligned
scope and pauses for a hard-to-reverse step, a requested review, or a decision
that belongs to the user.

### Durable records

- **Plan record:** the aligned plan, which serves with its defining documents
  as the specification of the loop. It changes through re-alignment, and each
  revision enters its decision log.
- **Loop record:** the execution state. Its backlog and inventory coverage are
  derived, and they regenerate from the plan record and the workspace. Its
  operating notes, guardrails, discoveries, blockers, approach decisions, and
  next item are durable knowledge that every regeneration carries forward.

Keep both records where the repository or host keeps task records, cite their
location in every report, and let version control hold the history. When the
user or the environment sets a read-only or dry-run boundary, present the
records and proposed changes in the response, run checks in read-only form,
and label each item simulated with its post-change verification pending. Each
record has one writer, and each lane keeps its own loop record, linked from
the main one.

### Set up

1. Persist the aligned plan as the plan record.
2. Run a gap-analysis iteration that compares the target and the acceptance
   criteria with the workspace, and write the backlog: items sized to finish
   and verify within one context window, each citing its criteria, in a stable
   order by dependency, risk, and the plan's priority criterion. Batch targets
   that share one transformation rule and verify together within one context
   window, and give every other target its own item.
3. Record the operating notes: the project's documented build, test, lint,
   type-check, and inventory commands. Inspect each command for side effects,
   and record a read-only form or an isolated target for checking; a command
   that writes persistent state runs as an authorized work step inside an
   item. Sort the checks into fast item checks and the full backpressure set.
4. Run the read-only and isolated checks once and record the results as the
   baseline; a check that needs an authorized work step records its baseline
   inside that item. A baseline finding enters the backlog when it blocks a
   criterion or lies on the change surface. Each other finding becomes a
   proposed exception with its result, scope, impact, reason, and review
   trigger, and it counts as accepted once the acceptor approves it or a
   standing policy covers it.
5. Record the initial guardrails, each phrased as the behavior to follow.

### Iteration

Every iteration follows the same brief:

1. **Orient:** read the plan record, the loop record, and recent history, then
   restate the goal, the current phase, the binding constraints, and the
   candidate item.
2. **Select:** take the most important ready item, and search the workspace to
   confirm it is still open.
3. **Work:** choose the approach within the plan's constraints and the
   environment's permissions. Fan out broad reading and search to subagents to
   keep the iteration's context focused, keep one writer per file area, and run
   builds and tests through one runner. Add each discovery outside the item to
   the backlog.
4. **Prove:** observe the item's check report the gap before the change and
   pass after it; for changed behavior, that check is a test or reproduction
   written first. Run the item checks against real dependencies, compare the
   results with the baseline, and attribute new findings to the item. Remove
   the scaffolding the item leaves behind. Each new test states the criterion
   it protects, so later iterations keep its purpose.
5. **Record:** update the item's status with evidence, along with discoveries,
   guardrails, and reusable artifacts, and name the next item. Commit validated
   work when commits are authorized.
6. **Hand back:** return a short status to the driver, which starts the next
   iteration from the updated records.

### Broad and parallel work

- Drive broad work from an inventory: the plan's inventory rule as a
  reproducible query, the targets it yields, one transformation rule per
  target class, and coverage counts in the loop record. Rerun the query every
  iteration, so the backlog tracks every target the query yields.
- Shape each item as a cohesive, testable slice that fits one context window,
  even when it spans several files. Record each exception to a transformation
  rule, and refine the rule.
- Split lanes along ownership boundaries once their shared interfaces are
  settled. Give each lane a scoped backlog, its own loop record and writer, and
  its own branch or worktree where available. The driver integrates lanes one
  at a time. Where the host runs a single worker, the lanes run in sequence
  under the same ownership rules.
- Run the full backpressure set at each integration, at each phase gate, and
  before completion.

### Steering

- Stay on the loop: watch the iterations, and when a failure repeats, add a
  guardrail phrased as the behavior to follow, refine the operating notes, or
  strengthen the backpressure. Propose durable guardrails for the project's
  agent instructions.
- Regenerate the backlog from the plan record and the workspace when it drifts
  from either.
- Give each item an attempt budget and each phase an iteration budget, set
  from the planned checks and the expected correction path. When a budget
  runs out, record the evidence, then split the item, run an experiment, or
  re-align.
- Treat a completion claim from a worker as the trigger for an audit; the
  evidence decides.
- After compaction, interruption, handoff, a correction, or a model or host
  switch, re-ground from the records and verify the recorded progress against
  the workspace before the next item.

## Replanning and completion

Re-align the affected work with the user when:

- evidence disproves a material assumption;
- the requested outcome, scope, or constraints change;
- a phase uses up its iteration budget before its criteria pass;
- a new dependency changes ordering or ownership;
- the next step requires a decision that belongs to the user or a
  hard-to-reverse action.

A correction updates the governing basis first, then every affected
objective, criterion, phase, lane, and item. Pause the affected items and
continue the independent ones. Incidental implementation choices stay with the
workers within the direction and constraints.

A phase closes when its required checks ran and passed against real behavior
and a fresh-context review against the plan record confirms each criterion it
advances; the next phase opens after that review. A blocked or substituted
check keeps its phase open as a reported gap with its cause and impact. The
task completes when every acceptance criterion has observed evidence, inventory
coverage is complete, and a final fresh-context audit confirms the target
state. Report the changes, the evidence, and the remaining work.

## Quality gate

Before presenting or executing the plan, confirm:

- the governing basis leads the plan, and every section traces to it;
- a reviewer can restate the reasons for the work from the case for change
  alone;
- every material claim carries its class and source, and research tested each
  main hypothesis against source evidence;
- each changed subject has comparable as-is and to-be views;
- objectives, boundaries, constraints, and acceptance criteria agree;
- every criterion traces to a need and maps to a phase, and every phase
  advances a criterion;
- verification observes behavior, properties, or measures;
- user-owned decisions, dependencies, and watch conditions each carry a check,
  a response, or an explicit acceptance;
- the revised text holds zero negating words and follows the register, and
  the plan stays within the requested outcome;
- the next action is clear, and a fresh agent can start the loop from the
  records.
