---
name: 'Repository documents'
description: 'Role, ownership, and content rules for Markdown documents'
applyTo: '{*.md,.github/**/*.md}'
---

# Repository documents

## Ownership

Give each document one job, and link between documents instead of repeating
content.

- `README.md`: entry point and commands.
- `references.md`: external sources used by this repository.
- Specification: the contract a reader has to satisfy.
- Research: observed evidence and where it came from.
- Architecture: actual modules, boundaries, and runtime shape.
- Plan or task: ordered work and its definition of done.

Before editing a document named "spec", determine whether it acts as
requirements, design, or verification, and keep it in that single role.

## Content

- State the current situation. A specification states the intended state;
  every other document states what exists now.
- Keep change history in version control and session responses, so the
  document stays readable as a statement of state.
- Keep test evidence, execution checklists, and implementation narrative out
  of design documents.
- Record a claim together with the source or run that supports it.
