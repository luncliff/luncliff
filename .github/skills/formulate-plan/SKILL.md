---
name: formulate-plan
description: 'Refine or build a general plan through five stages: purpose, situation, task definition, strategy, and options. Produces an agent-ready plan with evidence, success and exit conditions, verification, alternatives, and a re-read point for long-running work. Use to align details with a user, strengthen an existing plan, or frame work in any domain. For verified coding phases, use phased-plan.'
---

# Formulate Plan

A plan fails at the slots nobody filled, not at the steps someone wrote down. The five stages run in order because each consumes the previous one: an unstated purpose makes the situation unreadable, an unread situation makes the tasks arbitrary, undefined tasks make the strategy unfalsifiable.

The output is a written plan, and its reader is an agent that will act on it without asking. Anything left implicit gets filled in by whoever runs it. The user decides. This skill supplies the material the decision is made from, and states no preference the user did not ask for.

## Entry modes

| Mode | Where to start | What changes |
| --- | --- | --- |
| New plan | Stage 1 | Run all five stages |
| Existing plan to refine | Stage 1, reading the plan as a claim rather than a given | Map the plan's contents onto the five stages, and treat every stage with nothing mapped to it as a gap |
| Long-running task | Stage 1 | Carry the re-read point in stage 4, since the situation the plan rests on will move before the work ends |

Refining is not editing prose. A plan that states five actions and no purpose has one filled stage and four gaps; report it that way before changing a word.

## Stages

| # | Stage | Question it closes | Output | Gate to the next stage |
| --- | --- | --- | --- | --- |
| 1 | Purpose | What is this for, and is it one thing? | Purpose table, decomposed | Each purpose has one beneficiary and one measure |
| 2 | Situation | What is currently true, and what does each claim rest on? | Findings with sources, classed problem or opportunity | Each finding carries a source or the label `unverified` |
| 3 | Task definition | What has to change, and what counts as done? | Task statements with success and exit conditions | The question frontier is empty and the user confirms the alignment |
| 4 | Strategy | What happens in what order, and what proves it worked? | Action paired with verification, per task | Each action has a named observable and a stop condition |
| 5 | Options | What else could be done, and at what cost? | Recommendation plus alternatives, filled to the same fields | The do-nothing option is priced and the open decision is stated |

Do not run stages in parallel. Do not pass a gate with an unfilled slot; record the slot as a gap and say what would fill it.

## 1. Purpose

State the purpose as one sentence: who it changes, what changes for them, by when.

Decompose when the sentence needs a conjunction to stay true, or the beneficiaries differ, or the measures differ, or the horizons differ. Each fragment becomes its own purpose with its own row.

Keep three things apart. Purpose is the state that should hold. Objective is the measure that reads it. Deliverable is the artifact produced. A deliverable written in the purpose slot leaves the objective undefined for the rest of the plan.

Record the relation between decomposed purposes: independent, prerequisite, or in tension. A pair in tension needs a stated trade rate — which one yields, and by how much — or it gets resolved silently during execution by whoever hits the conflict first.

Record what is explicitly not a purpose here.

| ID | Purpose | Beneficiary | Measure | Horizon | Relation |
| --- | --- | --- | --- | --- | --- |

## 2. Situation

Establish the documented ground truth before treating existing artifacts as evidence.

Each finding carries: the statement, its source, its class, and the purpose ID it bears on. A source is a file and line, a command output, a document, a metric, or a quoted stakeholder. A class is either problem — a gap between the current state and a stage-1 purpose — or opportunity — available leverage the current state does not use.

Tag every statement as observation, inference, or assumption. An inference names the observations it derives from.

A finding with no source stays in the list under the label `unverified`, together with the check that would settle it. Do not drop it and do not promote it.

Do not rank findings here. Ranking depends on answers that do not exist until stage 3.

## 3. Task definition

Run the `grilling` skill. Ask the whole frontier in one round — every question whose prerequisites are already settled — numbered, each with a recommended answer. Wait for the answers, then recompute the frontier.

First round, in priority order, because everything else hangs off these:

1. Which stage-1 purpose ranks first when two of them conflict.
2. The success condition: the observable that states a purpose is met.
3. The exit condition: the observable that ends the work whether or not it succeeded.
4. What is out of scope.

Later rounds: constraints (deadline, budget, people, dependency, compliance), who accepts the result, sequencing, and anything unlocked by a stage-1 or stage-2 answer.

Facts are the agent's job. Dispatch a subagent for anything readable from the filesystem, the history, or a document, and ask the rest of the frontier while it runs. Decisions are the user's. Put each decision to the user and wait.

A task statement carries: the finding it answers, the change it makes, the success condition, the exit condition, what is out of scope, and its priority with the criterion that produced that priority.

Stage 3 closes when the frontier is empty and the user states that the alignment holds.

## 4. Strategy

For each task, pair an action with the verification that closes it. Write the verification first; an action written first tends to arrive with a check shaped to pass.

- **Action** — what changes, in what order, and what it depends on. When the actions are code changes, hand execution to [`phased-plan`](../phased-plan/SKILL.md) and stop describing the steps here.
- **Verification** — the observable that shows the action landed: a run, a measurement, a driven flow, a countersigned artifact. Real behavior and real dependencies. A check that cannot be run is reported as a gap, not replaced by a substitute.
- **Leading signal** — what reads early, before the success condition can read at all.
- **Re-read point** — for work spanning more than one session, the date, milestone, or observation at which this plan is checked against what has actually happened, and what would trigger rewriting it.
- **Stop condition** — the observation that ends this strategy.
- **Rationale** — the stage-2 findings it rests on, what it optimizes, and what it gives up.

A strategy whose failure produces no distinct observation is not falsifiable. Rewrite it, or record that it is unfalsifiable and carry that forward into stage 5.

## 5. Options

Present the recommendation together with at least two alternatives, one of which is do-nothing or defer. Fill every option to the same fields at the same level of detail; asymmetric detail is an argument wearing the shape of a comparison.

Per option: what it does; its cost in effort, money, calendar, and people; what it advances, against which purpose ID; what it forfeits; how reversible it is; the evidence supporting it; each risk it carries with the signal that detects the risk and the response to it; and the condition under which this option becomes the better one.

Then, once: the recommendation, the single criterion it optimizes, and the fact that would change it.

Close by naming the decision that only the user can make. Do not make it.

## Frequently omitted slots

| Slot | Stage | Why it goes missing | What fills it |
| --- | --- | --- | --- |
| Trade rate between purposes | 1 | Both purposes are wanted, so neither is ranked | Which one yields, and by how much |
| Source of a claim | 2 | The claim is familiar | A file and line, a command output, a document, or a quote |
| Exit condition | 3 | The success condition feels like enough | An observable that ends the work when it is not succeeding |
| Out of scope | 3 | Absence reads as exclusion | An explicit list |
| Who accepts the result | 3 | The doer is known, so acceptance is assumed | The person who says it is done |
| Leading signal | 4 | The final measure is already defined | Something that reads before the outcome does |
| Re-read point | 4 | The plan is treated as fixed once it is written | A date, milestone, or observation that triggers re-reading it |
| Stop condition | 4 | Failure is treated as delay | The observation that ends the strategy |
| Cost of doing nothing | 5 | The plan exists, so acting is assumed | The same fields every other option gets |

## Register

The plan is read to make a decision and then handed to an agent to act on, so the writing carries information and not pressure, and leaves nothing to be inferred at execution time.

- Use counts, magnitudes, dates, and units with a reference point. Drop evaluative adjectives — obvious, clear, simple, best, critical, huge — and superlatives.
- One claim, one source. Anything unsourced carries `unverified` and the check that would settle it.
- Mark observation, inference, and assumption in the sentence that makes the claim.
- Name files, systems, people, and dates outright. A referent that only the current conversation supplies does not survive the handoff.
- Write each task so it can be handed to a subagent on its own, without the surrounding plan.
- Give an option's cost the same space as its benefit.
- Rank only by a stated criterion. Do not steer with ordering, emphasis, or repetition.
- State the recommendation once, labeled, with its criterion, rather than threading it through the prose.
- Describe observed behavior. Do not attribute motive or intent to a person.
- Report a gap as a gap. Do not fill it with a plausible narrative.
