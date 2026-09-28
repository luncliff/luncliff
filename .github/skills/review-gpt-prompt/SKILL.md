---
name: review-gpt-prompt
description: Evaluate prompt files intended for GPT-5.6 Sol, Terra, or Luna, using GPT-5.5 only as reference; do not rewrite or optimize prompts.
---

# Review GPT Prompt

Use this skill to evaluate a prompt file, not to improve it. Treat user claims
about the prompt as hypotheses until checked against the prompt text, nearby
repository guidance, or current official OpenAI documentation.

Do not apply guidance for models earlier than GPT-5.5. GPT-5.5 guidance may be
used only as migration or comparison context. Keep GPT-5.6 common criteria
separate from Sol-, Terra-, and Luna-specific criteria.

## Workflow

1. Inspect the requested prompt file and any explicitly referenced local
   guidance before judging it.
2. If the review depends on current OpenAI model behavior, verify it with
   official OpenAI documentation. Prefer official model, reasoning, prompting,
   and evaluation guidance over examples or third-party commentary.
3. Apply the criteria below in order. Do not skip earlier blockers because a
   later quality issue is easier to discuss.
4. Output only the evaluation list and summary. Do not rewrite the prompt,
   propose next steps, or offer to continue.

## Source Priority

1. User's explicit requirements for the prompt being reviewed.
2. The prompt file and repository-local instructions.
3. Current official OpenAI GPT-5.6, reasoning, prompting, agent, and evaluation
   documentation.
4. OpenAI Cookbook examples, used as examples of evaluation practice rather
   than binding product behavior.
5. Harness or agentic engineering material, used only to identify what cannot
   be assessed from the prompt alone.

## Evaluation Order

### 1. Source Check

- Confirm the actual prompt file and applicable local guidance were inspected.
- Flag unsupported assumptions as `unverified claim`.

### 2. Scope Gate

- Check that the prompt's requested behavior is clear enough to evaluate.
- Keep this review evaluative only. Never include rewrites, optimization plans,
  implementation plans, or follow-up suggestions.

### 3. Model Eligibility

- Pass only when the prompt targets GPT-5.6 Sol, Terra, Luna, the `gpt-5.6`
  alias, or GPT-5.5 reference/migration.
- Ignore recommendations or criteria specific to GPT-5.4, GPT-5.3, GPT-5.2,
  GPT-4.x, or older models.

### 4. Task Contract

- Evaluate whether the prompt states the goal, input assumptions, output
  contract, success conditions, failure conditions, and when to ask a question.
- Treat missing success or failure criteria as a high-severity issue.

### 5. Evaluation Contract

- Evaluate whether the prompt can be tested with representative cases, expected
  outcomes, pass/fail criteria, and regression checks.
- Prefer deterministic checks where possible. Model judges are acceptable only
  when the rubric is explicit and grounded.

### 6. Authority Boundary

- Check whether the prompt defines boundaries for local reads/writes, external
  calls, destructive actions, paid or costly operations, and approval points.
- Flag unclear side-effect authority as a blocker for agentic prompts.

### 7. Model Fit

- Common: lean instructions, clear constraints, explicit evidence needs,
  suitable reasoning effort, and no duplicated or conflicting rules.
- Sol: suitable for complex, ambiguous, high-value, or polished work; prompt
  should include context, tradeoff criteria, and evidence requirements.
- Terra: suitable for everyday tool-using work; prompt should balance action,
  verification, latency, and cost without Sol-level over-analysis.
- Luna: suitable for clear, repeatable, high-volume tasks; prompt should have a
  tight input/output contract and avoid open-ended judgment.

### 8. Context Economy

- Look for repeated instructions, obsolete model notes, excessive examples,
  overlong always-loaded context, and tool descriptions that do not affect the
  task.
- Do not call something redundant unless the same requirement is stated more
  than once without adding precision.

### 9. Harness Fit

- For agentic prompts, evaluate whether tool use, state, traceability,
  permissions, retries, handoff, and stop conditions are specified.
- If those details live outside the prompt and are not available, mark the item
  `not assessable from prompt alone` instead of guessing.

### 10. Output Discipline

- Check whether the prompt defines the expected response format, evidence
  format, verbosity, and stop condition.
- A prompt intended for evaluation workflows should make failures easy to
  localize to a line, rule, or missing contract.

## Finding Axes

- Severity: `P0 blocker`, `P1 material`, `P2 quality`
- Status: `pass`, `concern`, `blocker`, `not assessable from prompt alone`
- Scope: `common`, `sol`, `terra`, `luna`, `gpt-5.5-reference`
- Evidence: `line/path`, `quoted fragment`, `official criterion`,
  `runtime evidence required`
- Risk: `unverified claim`, `ambiguity`, `conflict`, `missing eval`,
  `authority gap`, `model mismatch`, `context overload`, `harness gap`

## Output Format

```markdown
### Evaluation Result

1. [<Severity>] <Finding title>
   - Status: <pass | concern | blocker | not assessable from prompt alone>
   - Scope: <common | sol | terra | luna | gpt-5.5-reference>
   - Evidence: <file path and line, quoted fragment, or official criterion>
   - Criterion: <applied criterion>
   - Rationale: <why this matters for evaluating the prompt>
   - Confidence: <high | medium | low>

### Summary

- P0: <count>
- P1: <count>
- P2: <count>
- Not assessable: <count>
```

Stop after the summary.
