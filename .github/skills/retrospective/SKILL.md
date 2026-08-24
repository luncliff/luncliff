---
name: retrospective
description: 'Consolidate durable lessons from the full session into the repository retrospective notes. Classify each takeaway by purpose, read (or create if missing) the category file, and rewrite it as the current best statement rather than appending a history. Use when the user asks for a retrospective, lessons learned, alignment updates, or a record of verified practices for future work.'
---

# Retrospective

Digest the whole session — not only what the user explicitly calls out — and fold what's durable into this repository's retrospective notes, split by purpose so each file stays about one kind of thing and stays worth reading later.
Each file lives flat in `~/user-retrospectives` (for user) and `docs/` (for workspace). They are always rewritten as the current best version of itself: never a changelog, never an appended section.

## Categories

| File | Purpose |
| --- | --- |
| `tech-learning.md` | A concept or technique a person now understands, must teach, or must relearn |
| `business-value.md` | Which criteria decided a decision's worth, given the goal at hand |
| `code-quality.md` | A module too tangled or too scattered, and the resulting comment/refactor call |
| `testing-verification.md` | A claim actually checked against a test, a run, or a reproduction, and what it showed |
| `architecture-patterns.md` | A structural or pattern choice, its forces, and its consequences |
| `work-management.md` | How the work itself was planned, tracked, or delegated — process, not code |

A session's takeaway can land in several of these files at once: when it plausibly fits more than one category, write it into each, phrased in that file's own terms, rather than duplicating identical text. Infer the category from the session content; ask the user only when a takeaway doesn't clearly belong to any of the seven.

For the fields each category's entries use, see [CATEGORIES.md](./CATEGORIES.md).

## Procedure

1. Digest the full session transcript — not only sentences explicitly flagged as a lesson — before deciding which categories apply.
2. List every category from the table above that the session's content actually touches. For each one, read that category's file first if it already exists.
3. For each listed category, rewrite the whole file, merging the new material into the existing content as though authoring its latest version. Never append a section or keep a log of when something was added. Cap headings at H3.
4. Create a file only the first time a category has real content — don't pre-create empty files for categories with nothing to say yet.
5. Prefer positive, composable rules over prohibitions.
6. Remove or rewrite entries that later evidence contradicts.
7. Close by listing every file touched in this pass, so the user knows exactly what's ready to review.

This skill only writes inside `docs/`; it never touches `.wiki/`. Ingesting is a separate, human-initiated step: once you've reviewed a file, copy it into `.wiki/raw/` (or run **LLM Wiki: Add Source**), and clean up `docs/` yourself afterward — that housekeeping is yours, not this skill's.
