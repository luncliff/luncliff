---
surface_id: planning-execution
title: Planning And Execution Model
purpose: Shape work through scope control, phases, validation gates, acceptance evidence, and completion closure.
keywords:
  - planning
  - phases
  - validation
  - acceptance
  - coverage gates
  - scope
  - research
  - completion
---

# Planning And Execution Model

## Evidence and Acceptance

- Takeaway: A live-only MLE harness must consume the production policy and production agent over same-run captured live evidence, not implement a parallel directive or synthetic generator. Harness readiness is not feature acceptance.
  Evidence: A parallel harness could run locally but could not establish behavior of the secured production flow.
  Apply when: Evaluating prompts, personas, guardrails, model variants, or source-grounded workflows.

- Takeaway: Distinguish replay-input validation from credential-gated live model validation. Validate replay payload contracts locally, then report the credential gate and missing live evidence explicitly.
  Evidence: Valid stored outputs proved input shape but could not substitute for an unavailable live LLM call.
  Apply when: Verifying LLM, external API, or credential-gated workflows.

- Takeaway: Report package, feature-core, and integration/source coverage gates independently. An aggregate floor does not complete a phase with an unmet required module gate unless the user accepts an explicit exception.
  Evidence: Strong aggregate coverage concealed credential-gated source modules below their required thresholds.
  Apply when: A plan defines multiple coverage thresholds or live dependencies leave branches unexercised.

- Takeaway: When a user-owned artifact is missing outside the approved scope, report an evidence-backed verification gap rather than fabricating a replacement to make tests pass.
  Evidence: A missing prototype fixture predated the work and remained out of scope despite causing existing test errors.
  Apply when: Missing fixtures, prototypes, or documents affect validation outside the requested change.

## Scope, Research, and Decisions

- Takeaway: For research that may shape a future specification, mark domain additions as proposals, compare As-Is and To-Be explicitly, and do not promote them into the public schema before review.
  Evidence: A proposed source-item model exposed the contract delta without changing the formal result schema.
  Apply when: Researching schema evolution, workflow redesign, or public-contract changes.

- Takeaway: For investigation work, confirm documentary ground truth and the user's research intent before treating repository code as relevant evidence.
  Evidence: Existing exploratory code was intentionally set aside while endpoint documentation and specifications defined the investigation.
  Apply when: Researching APIs, systems, policies, dependencies, or external integrations.

- Takeaway: Keep prompt work scoped to the prompt and immediate assembly code. If human-review workflow is excluded, do not reintroduce its rules indirectly through prompt criteria.
  Evidence: A model migration removed operational review heuristics that were outside the requested prompt scope.
  Apply when: Editing prompts in systems that also contain manual QA or review workflows.

- Takeaway: Derive clarification questions from the current task goal, not broader product concerns; read applicable instructions, batch the highest-priority unanswered decisions, and show progress through the set.
  Evidence: A question set was corrected after it mixed roadmap concerns with the current task.
  Apply when: Planning clarification rounds, design interviews, or goal hardening.

## Phased Delivery and Closure

- Takeaway: Use phased implementation with an independent review and verification checkpoint at each phase, then add coverage for review findings before declaring completion.
  Evidence: Phase review exposed lifecycle gaps that required additional tests and failure logging.
  Apply when: Implementing or refactoring multi-stage workflows, especially with TDD or subagent collaboration.

- Takeaway: Under explicit user authorization, treat CI repair as an autonomous loop: inspect current checks, make and validate each fix, push it, then continue through newly exposed failures until the current commit passes.
  Evidence: Successive verified CI fixes exposed later failures before the final commit passed all checks.
  Apply when: The user authorizes CI repair, pushes, and continued remediation.

- Takeaway: Preserve the evidence-to-tracker chain: validate first, summarize measurable outcomes, then update current-state tracker content and synchronize time from the actual implementation window when requested.
  Evidence: Tracker closure followed live validation and used the observed implementation window rather than an arbitrary duration.
  Apply when: Closing investigations, MVP validations, spikes, or issue-driven implementation work.

- Takeaway: Do not call a checklist-driven task complete until its code, required verification artifacts, and requested tracker updates are closed.
  Evidence: A workflow remained incomplete until live checks, specification closure, and worklog synchronization were all complete.
  Apply when: Working from issue plans, specifications, QA gates, or acceptance checklists.

## Durable Artifacts and Documentation

- Takeaway: Update, merge, and compact retrospective guidance before creating new dated artifacts.
  Evidence: Mechanical generation encouraged record growth without review or consolidation.
  Apply when: Capturing session lessons, preferences, or heuristics.

- Takeaway: Keep durable specifications current-state-only; put implementation history, session narration, and completion logs in version control or session responses.
  Evidence: Progress records were removed from a specification while its current contract remained.
  Apply when: Writing or cleaning repository documentation, architecture specs, or implementation notes.

- Takeaway: Split repository documentation by reader need: README for entry and commands, API spec for public contract, research for source evidence, architecture for code and runtime boundaries, and test documentation for test-asset provenance.
  Evidence: Separating these responsibilities removed overlap while preserving links between the documents.
  Apply when: A project accumulates design diagrams, source observations, API details, and run instructions together.

- Takeaway: Keep README architecture notes concise and as-is. Remove migration history, future-work markers, and duplicate file responsibilities already owned by co-located documentation.
  Evidence: Concise workflow notes replaced distracting history and repeated inventories.
  Apply when: Simplifying architecture maps, package READMEs, onboarding guides, or workflow documentation.
