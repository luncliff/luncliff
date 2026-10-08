---
name: resume-session
description: Resume an interrupted Codex task by restoring accessible session context, rebuilding the work plan from applicable AGENTS.md files and workspace evidence, reporting the current state, and continuing toward the original goal.
---

# Resume Session

Use this skill whenever it is invoked to resume an interrupted or incomplete task. The interruption cause, such as a 429, proxy failure, or aborted run, is supporting context rather than an invocation requirement.

Recover the existing task instead of restarting or expanding it. Use all accessible session history and context, but never claim access to unavailable history or state.

## Recover the work

1. Read the available conversation or summary, including the latest user corrections.
2. Read applicable user-level and project-level `AGENTS.md` files, task records, handoffs, plans, workspace changes, Git state, tool results, running processes, and agent state.
3. Recover the original objective, scope, constraints, authorization, completion condition, and last verified boundary.
4. Reclassify the work as `Done`, `Doing`, and `To Do`. Keep verified work done, preserve unrelated changes, and replace stale plans with the recovered plan.
5. Confirm that the recovered plan matches the latest user instructions before continuing.

## Report and continue

Give a concise status update in the user's language. Use these emoji labels for readability:

- 🎯 **Goal:** the recovered objective and completion condition.
- ✅ **Done:** verified completed work.
- 🔄 **Doing:** the interrupted or active work.
- 📌 **To Do:** the remaining ordered plan.
- ⚠️ **Blocker:** only when a real blocker exists.
- ▶️ **Next:** the action that starts immediately after the report.

Keep the report brief and evidence-based. Treat `To Do` as the active work plan. Assign its work to the main agent or subagents according to the applicable `AGENTS.md` instructions and the user's latest direction.

Do not end the turn after reporting. Start `Next` immediately, then continue through the remaining plan. Resume, reassign, or hand off subagent work when the recovered plan requires it; otherwise continue directly.

Ask the user only when a missing user-owned decision or authorization blocks the next action. Treat the interruption cause as diagnostic evidence only. Probe it only when necessary to continue, and do not repeat paid, rate-limited, or mutating work under unchanged failure conditions.

Continue until the original task is verified complete or a real blocker prevents further progress. Reporting or merely restarting work is not completion.
