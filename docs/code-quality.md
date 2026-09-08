# Code Quality

## Entries

### Keep trusted selectors out of prompts

Secrets, tenant state, trusted routing, and raw user-facing selectors stay in local context or typed policy registries. Resolve them to closed directives before prompt assembly, and validate tool-output shape, semantics, and redaction in application code.

### Put structure in code and meaning in prompts

Use prompts for semantic and operational intent, then use schema and deterministic code for structural guarantees. Do not claim a schema proves factuality, locale relevance, or citation behavior, and do not make prompts responsible for mechanical shape checks.

### Prefer typed registries over duplicated allowlists

Keep one authoritative typed registry for policies, personas, feature flags, or prompt controls. Derive public allowlists from it; parallel identifiers or harness directives drift and can bypass the production safety boundary.

### Keep source integrations to real boundaries

A first provider integration usually needs a transport client and a collector or adapter, not a factory, registry, or service hierarchy. Add abstraction only when a second implementation or proven duplication creates a real ownership problem.

### Centralize shared function-tool mechanics

Public function-tool wrappers should stay thin. Put shared provider work, lifecycle logging, correlation, exception propagation, and redaction in one private helper when direct and workflow-scoped entry points call the same operation.

### Replace brittle style gates with evaluation criteria

Tone, register, naturalness, and house style belong in evaluator instructions or human review, not deterministic lexical marker modules. Substring bans, sentence-ending checks, and clause-shape scores become unmaintainable when agent types or editorial direction change.

### Measure mechanics where objects cross boundaries

Counts, coverage, deduplication, schema shape, and IDs should be computed from runtime objects at the handoff boundary. Do not ask an LLM to report mechanical facts already available to deterministic code.

### Delete scaffolding tests with scaffolding code

A suite that imports removed harness or experiment modules by file path should be deleted with that code. Sibling suites that cover production contracts stay, because their meaning survives the scaffold removal.

### Keep reusable helpers narrow

Reusable scripts and skills should own deterministic mechanics only. Data collection, model evaluation, uploads, publication, and one-off artifact variants stay explicit higher-level actions unless the helper's public contract is intentionally expanded.

### Flatten wrappers that add no boundary

When a package wrapper only mirrors constructor arguments or adds no deployment boundary, simplify it and update imports, packaging metadata, tests, and documentation together. Thin indirection is maintenance cost unless it protects a real contract.
