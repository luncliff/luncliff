# Business Value

## Entries

### Consumer operations justify public fields

Add public response fields only when a concrete consumer operation needs them. Existing indexes, canonical arrays, and composite joins should serve first; identifiers, roles, policy snapshots, or persisted provenance are valuable only when they unlock actual navigation, tracking, mutation, or reproduction.

### Readiness proves the promised capability

A service that promises upstream retrieval needs a probe that exercises upstream retrieval, not only process liveness. The useful yardstick is the external capability sold to consumers, because a live process can still fail the product contract.

### Judge dependency changes by end-to-end installability

For an APM update, the useful outcome is a successful target installation, not merely a valid-looking manifest or a newer upstream source. The combined `apm install --target copilot` run failed on stale refs, so preserving existing entries had no value until their refs were proven valid or removed.

### Source-aligned contracts build trust

Public interfaces backed by external providers should use observed provider vocabulary, expose direct provider-resolved URLs when navigation is promised, and omit client-irrelevant provenance. This reduces invented abstractions and avoids making every client rebuild provider routes.

### Expensive work waits for the review schema

Lock headers, row set, image treatment, and decision fields before paid model calls, uploads, or publication. Cheap inspection artifacts are valuable because they let the user approve the review form before irreversible or costly evaluation begins.

### Judge-model results inform, not decide

When measurement depends on an evaluator model, report per-axis results and metric-gaming falsifiers, then leave the verdict with the user. The business value is decision support, not an automated pass/fail gate pretending to be product judgment.

### Artifact location follows audience and lifetime

Choose storage by who will reuse the artifact and for how long. Raw reproducible outputs belong with evaluation data; durable reviewer-facing reports belong with maintained documentation. Ambiguous cases should follow explicit user direction before commit.

### Research stays distinct from requirements

Capability, absence, migration cost, and unresolved validation are separate values in research. A plausible field, endpoint, or matching algorithm becomes specification only after the user accepts the requirement and the consumer need is demonstrated.

### Task-oriented guides beat background prose

API and review guides should give each consumer task a compact diagram, schema-valid example, and simple code in the requested language. Proposal-only fields and session reasoning stay out of the current-use guide.

### Corrections apply as contract rules

When the user corrects one API or document example, apply the underlying rule across the relevant surface. The value is consistency in the contract, not a local patch that leaves sibling fields or sections with the same flaw.
