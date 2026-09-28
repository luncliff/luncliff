# Calibration

How to turn the two axes into defensible numbers, and what to do once a task lands in a box.

## X — detail demanded

Score the task, not the person. Start at 0.5 and move for each probe that answers hard.

| Probe | Pushes toward 0.0 | Pushes toward 1.0 |
| --- | --- | --- |
| Could a competent stranger produce an acceptable result from a written brief and acceptance criteria? | Yes | No, they would need the history |
| How is a bad result caught? | A check, a test, or a review catches it | It surfaces weeks later, in production or in a relationship |
| How many undocumented decisions per unit of work? | Few, and each is written down somewhere | Many, and the reasons live in someone's head |
| Why do the exceptions exist? | The rule covers them | Each one traces to a past incident nobody wrote up |
| What happens when the context shifts? | The instructions still hold | The instructions mislead |

High detail is not the same as hard, large, or important. A six-month migration with a clear runbook is low detail. A two-hour conversation with a customer who has been burned before is high detail.

Detail is not fixed. Writing the brief, adding the test, or building the tool is the act of lowering X — and that is how an Owning task becomes a Teaching task.

## Y — proficiency held

Anchor the number to a stage, then adjust. Stages follow the Dreyfus skill model.

| Stage | Observable | Y |
| --- | --- | --- |
| Novice | Follows steps; cannot tell a good result from a bad one | 0.10 |
| Advanced beginner | Recognizes recurring situations; still stalls on unfamiliar ones | 0.30 |
| Competent | Picks a plan and carries it out; needs review at the decision points | 0.50 |
| Proficient | Reads the situation immediately, deliberates the response | 0.70 |
| Expert | Acts fluidly, adapts mid-course, catches subtle errors in others' work | 0.90 |

Stage is per task, never per person. A proficient engineer facing an unfamiliar domain is a novice at that task, and the grid should say so.

Evidence that fixes a score: a delivery shipped unaided, a review this person caught something in, a prediction of a failure mode made before it happened, an explanation of the generalizing rule rather than the sequence of steps.

Evidence that does not: years of experience, job title, seniority, confidence, or the person's own estimate on its own.

## Will tiebreaker

The grid has no motivation axis, which is deliberate — but motivation decides between two moves that look identical on the board.

| Detail | Proficiency | Will | Route |
| --- | --- | --- | --- |
| High | Low | High | Learning bet. Assign a reviewer and a date for the first unaided run. |
| High | Low | Low | Delegating with support. Growth does not happen on work nobody wants. |
| Low | High | Low | Teaching, urgently. Handing it over is the fastest way to recover the motivation. |
| Low | High | High | Teaching, and check whether it is really low detail — enjoyment often disguises hoarding. |

This mirrors the skill/will matrix (Landsberg): direct, guide, excite, delegate. The difference is that this grid runs on detail rather than will, so will comes back as the tiebreaker instead of an axis.

## Delegation levels

Delegating is not binary. When a task lands in the Delegating box, pick a level and say it out loud. Levels follow Management 3.0 delegation poker.

1. **Tell** — I decide and announce.
2. **Sell** — I decide and explain why.
3. **Consult** — I ask first, then I decide.
4. **Agree** — we decide together.
5. **Advise** — I give my view, they decide.
6. **Inquire** — they decide, then tell me.
7. **Delegate** — they decide; I do not need to know.

Delegate as far as the evidence supports and one level further than feels comfortable, then raise the level as results come in. A task stuck at level 2 for months is not delegated; it is supervised.

## When leading someone else

Run the grid once per person, not once per task. Then match the support to the box: heavy direction in Learning, a light hand in Owning, structured handover in Teaching, explicit authority in Delegating. This is situational leadership applied to a concrete task rather than to a person in general — Hersey and Blanchard's central claim is that readiness is task-specific, and the same holds here.

## Sources

- [Dreyfus model of skill acquisition](https://en.wikipedia.org/wiki/Dreyfus_model_of_skill_acquisition) — the five stages anchoring the Y axis.
- [Situational leadership theory](https://en.wikipedia.org/wiki/Situational_leadership_theory) — readiness is task-specific, and style follows it.
- [The skill/will matrix](https://www.mindtools.com/a4uva7f/the-skillwill-matrix/) — Landsberg's direct / guide / excite / delegate, source of the will tiebreaker.
- [Delegation poker and delegation board](https://management30.com/practice/delegation-poker/) — the seven delegation levels.
- [Mermaid quadrant chart syntax](https://mermaid.js.org/syntax/quadrantChart.html) — axis, quadrant, and point notation.
