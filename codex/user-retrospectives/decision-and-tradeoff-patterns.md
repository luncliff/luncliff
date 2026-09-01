---
surface_id: decision-tradeoffs
title: Decision And Tradeoff Patterns
purpose: Choose among design and operating alternatives using the user's recurring tradeoff principles.
keywords:
  - tradeoffs
  - design choice
  - simplicity
  - runtime configuration
  - API vocabulary
  - contract consistency
  - user correction
---

# Decision And Tradeoff Patterns

## Structure and Rules

- Takeaway: Prefer behavior-oriented surfaces over job-title-oriented or document-type-oriented organization.
  Evidence: The user accepted taxonomy organized around future behavior after rejecting loose document and position-heavy categories.
  Apply when: Creating taxonomies, archive structures, memory surfaces, or reusable guidance.

- Takeaway: Prefer a small set of positive, composable rules over negative constraints.
  Evidence: The user asked for alignment guidance that supports reasoning rather than constraining it.
  Apply when: Writing skills, policies, prompts, checklists, or durable guidance.

## Runtime and Public Contracts

- Takeaway: Prefer explicit runtime arguments over ambient environment variables for ordinary execution settings; reserve environment variables for secrets or deliberate tool and debug toggles.
  Evidence: CLI and container work favored command-line configuration over hidden environment-dependent behavior.
  Apply when: Designing CLIs, runbooks, container commands, or operational examples.

- Takeaway: Anchor public API vocabulary to observed source-system terminology before introducing cleaner abstractions.
  Evidence: URL-grounded names such as `book/detail` were preferred over abstract resource names in a source-backed REST API.
  Apply when: Naming REST resources, endpoint paths, OpenAPI schemas, adapter layers, or source-backed domain models.

## Corrections as Contract Rules

- Takeaway: When the user corrects one API design example, propagate its underlying rule across the whole contract instead of patching only the named instance.
  Evidence: A single naming correction was intended to apply consistently to envelopes, endpoints, and models.
  Apply when: Revising API specs, schema naming, response envelopes, validation rules, or documentation structure after feedback.
