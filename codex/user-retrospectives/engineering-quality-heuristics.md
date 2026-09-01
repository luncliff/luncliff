---
surface_id: engineering-quality
title: Engineering Quality Heuristics
purpose: Judge implementation quality across trusted boundaries, typed contracts, testing evidence, dependencies, models, and maintainability.
keywords:
  - architecture
  - types
  - security
  - testing
  - provenance
  - dependencies
  - maintainability
  - prompt boundaries
---

# Engineering Quality Heuristics

## Trusted Inputs and Prompt Boundaries

- Takeaway: Keep one authoritative typed policy registry and derive public allowlists from it. Do not duplicate identifiers or reconstruct trusted directives in a harness.
  Evidence: Repeated policy IDs and a parallel harness directive created drift and bypassed the production safety boundary.
  Apply when: Building allowlists, persona registries, feature flags, prompt controls, or evaluation harnesses.

- Takeaway: Treat user-facing tone and persona fields as untrusted selectors. Resolve them to closed, typed directives before prompt assembly and keep raw selector text out of model input.
  Evidence: A typed editorial directive preserved supported concepts while preventing raw request values from becoming instructions.
  Apply when: Building service prompts, persona controls, topic generators, or model workflows.

- Takeaway: Rebuild a prompt migration from current official model guidance rather than carrying legacy rubric structure forward. Insert source text only inside explicit escaped structural boundaries.
  Evidence: A newer-model prompt replaced retired scoring rules and used escaped tagged article sections to prevent delimiter collisions.
  Apply when: Migrating prompts, revising evaluation rubrics, or assembling source-backed model input.

## Evidence, Tests, and Determinism

- Takeaway: In no-fake external suites, preserve test isolation and evidence provenance: missing credentials must skip explicitly, usable real credentials must gate live acceptance, and dummy credentials must never be injected globally.
  Evidence: Removing collection-time token pollution restored explicit skips and prevented unauthorized external calls.
  Apply when: Testing authenticated, regional, rate-limited, or live-only integrations.

- Takeaway: Match source-backed tests to the declared evidence policy. Use documented live-captured fixtures when they are permitted; when the policy requires always-live inputs, remove stored payloads and gate runtime fetches explicitly with measured coverage.
  Evidence: Source tests moved from synthetic samples to proven upstream evidence, then to always-live fetches when the policy tightened.
  Apply when: Curating parser or integration tests under no-mock or no-fake rules.

- Takeaway: For geographically constrained sources, preserve observed URL seeds, prove parser behavior from a capable region, and separately prove target-region block behavior.
  Evidence: JP acceptance and KR geo-block handling required distinct evidence paths.
  Apply when: Designing source-backed APIs over region-bound third-party HTML.

- Takeaway: Align missing CI version-file inputs with the repository's established source of truth, such as `requires-python` and existing workflow inputs, rather than changing the source of truth without evidence.
  Evidence: A missing `.python-version` was correctly derived from existing Python metadata.
  Apply when: CI setup and project version metadata disagree.

- Takeaway: Make latest-artifact selection deterministic when timestamps tie by adding a stable secondary ordering rule.
  Evidence: Equal filesystem timestamps selected the wrong artifact until filename ordering broke the tie.
  Apply when: Selecting newest files across local and CI filesystems.

## Lean Models, Configuration, and Service Shape

- Takeaway: Attach shared media metadata to the source item that owns it and reuse an existing composite identity before adding another reference field or index.
  Evidence: Many reactions shared one parent video or article, so source-owned thumbnail metadata avoided duplicate child records.
  Apply when: Modeling shared comments, citations, attachments, thumbnails, or other source metadata.

- Takeaway: Persist canonical workflow evidence only. Derive representative or grouped projections through a small non-mutating strategy instead of adding duplicate result fields, policy metadata, or arrays.
  Evidence: Dynamic thumbnail views replaced a heavier persisted representative type.
  Apply when: Designing ranking, clustering, projections, or replaceable read behavior.

- Takeaway: Reuse existing configuration and credential paths when adapting local development behavior; do not introduce a parallel connection surface unless the boundary change is requested.
  Evidence: Existing username and password configuration preserved host and database behavior without a new URI path.
  Apply when: Adapting encrypted configuration or database access locally.

- Takeaway: Treat package layout as a maintainability choice. When a package wrapper adds no deployment boundary, flatten it and update imports, packaging metadata, tests, and documentation together.
  Evidence: A flat `src/` layout removed wrapper indirection while preserving a verified package build.
  Apply when: Simplifying a recent refactor or package structure.

- Takeaway: Keep skills, runtime dependencies, and services lean: add skill automation only for deterministic lifecycle value, put installation-heavy tools in development tiers, and implement the narrowest service that meets the current goal.
  Evidence: An archive generator and unnecessary runtime tools were removed, while service scope was narrowed to the required relay behavior.
  Apply when: Shaping skills, dependency groups, container images, APIs, or PoC architecture.

## Typed Workflow and Source Boundaries

- Takeaway: Convert untyped external data into typed domain objects at the adapter boundary, and use shared schema types across workflow execution, persistence, and API output.
  Evidence: Typed source and workflow schemas replaced nested dictionaries and stabilized service contracts.
  Apply when: Adding source clients, workflow outputs, database documents, or API payloads.

- Takeaway: Remove configuration wrappers that merely mirror constructor arguments, and collapse duplicated or derivable fields before they spread through source integrations.
  Evidence: Direct class-owned configuration and lean typed objects replaced `Dict[str, Any]` plumbing and thin wrappers.
  Apply when: Designing crawlers, search adapters, source clients, or integration payloads.

- Takeaway: Keep workflow orchestration shallow and explicit: the entry method shows lifecycle order, while private methods own one state transition or external boundary each.
  Evidence: Splitting an oversized `execute` method exposed lifecycle and persistence failure paths to review and tests.
  Apply when: Refactoring async services, jobs, or multi-stage workflows.

## Specification Role

- Takeaway: Identify whether a repository document is requirements, architecture/design, or verification/reporting before editing it. A design spec owns scope, boundaries, structure, representative flow, and rationale, not test evidence or implementation history.
  Evidence: A spec cleanup retained runtime diagrams and boundaries while moving session and QA narrative elsewhere.
  Apply when: Revising specs, ADR-like documents, API design notes, or implementation documentation.
