---
name: check-session-status
description: Use when an active or interrupted chat needs an evidence-backed status report before alignment correction, resume, or another chained workflow.
---

# Check Session Status

Recover and report the current session state. This is a read-only check. The caller and any later workflow do not change how the status is recovered. During the check, do not change the plan, correct alignment, or resume work.

## Inspect

1. Find the current user-visible plan. Prefer an active plan or goal record, then an accepted task record or handoff, then the latest user-approved plan in the thread. An unapproved assistant proposal is not the current plan.
2. Read the plan in full. Read the latest user corrections and only the workspace or tool evidence needed to verify its state.
3. Record the context available to the model now: model name when exposed, full or compacted history, current work role, working location, plan source, and relevant instruction sources. Mark unavailable facts `unknown`; do not infer them or expose hidden reasoning.
4. Classify each plan item as `Done`, `Doing`, or `To Do` from observed evidence. `Done` requires an observed result, not an earlier completion claim.

## Report

Use short, plain engineering words and the user's language. Use emoji labels for readability. The items below define what the report explains, not a fixed template or required order:

- 🗺️ **Plan** — Show the current plan in full and in the same order. Do not summarize, paraphrase, or omit it. When no user-visible plan is available, state the evidence gap plainly.
- 🧠 **Model context** — State what the model knows now and any context gap that could change the status.
- 🎯 **Goals** — List each work goal and its finish condition.
- 🧭 **Alignment** — List user-set direction, scope, constraints, exclusions, and corrections. Report conflicts; do not resolve them.
- 🛠️ **Strategy** — List the active approach and ordered steps.
- 🧪 **Verification** — List evaluation rules, checks, and required evidence.
- 📚 **References** — List only sources currently used by the work and state what each supplies.
- 📊 **Progress** — Report verified completed work, current work, and ordered leftovers. Use the `resume-session` status labels where they apply: ✅ **Done**, 🔄 **Doing**, 📌 **To Do**, and ⚠️ **Blocker** only when a real blocker exists. Quantify progress only when the plan provides countable units.
- 🔎 **Basis** — Give the basis for material claims with a locatable user message or quote, file path and section, task record, command result, or tool result. Shared evidence may support a group of claims when the link is clear. Mark inference and unverified gaps explicitly.
- ▶️ **Next** — When more user instruction remains, identify the next directed action or handoff without changing that instruction.

## Continue

After the report, preserve the remaining user instructions that accompanied the invocation. When they name more work, skills, or a destination, forward or hand them off unchanged and continue in the given order. Do not rewrite, summarize, or add status-derived direction to the forwarded instructions. If there is no remaining instruction, end after the report.

