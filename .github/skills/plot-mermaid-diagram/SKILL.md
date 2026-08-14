---
name: plot-mermaid-diagram
description: 'Autonomously select, write, insert, and validate Mermaid diagrams for software engineering requirements, design, code, architecture, data, behavior, traceability, delivery, and verification. Use when prose obscures a system relationship. Preserve the native model instead of defaulting to a flowchart.'
argument-hint: 'Describe the artifact, audience, facts to visualize, and where to insert it'
---

# Plot Mermaid Diagram

A diagram is a model. Select its native form and prove it renders.

## When To Use

Use for requirements, design, architecture, code structure, behavior, data,
deployment, delivery, and verification. Skip lists and repeated prose.

## Diagram Selection

Model one decision per diagram. Split mixed concerns.

| Decision | Mermaid |
| --- | --- |
| Requirement derivation, satisfaction, or verification | `requirementDiagram` |
| Type, interface, ownership, composition, or dependency | `classDiagram`; `namespace` for modules |
| Message order, actor, condition, or parallelism | `sequenceDiagram` |
| Legal lifecycle, event, guard, or transition | `stateDiagram-v2` |
| Persisted records, keys, cardinality, or optionality | `erDiagram` |
| System boundary, container, component, or deployment | `C4*`; `architecture-beta` for cloud or CI/CD resources |
| Procedure, branch, or merge | `flowchart` |
| Commit history, schedule, hierarchy, user path, frame, or metric | `gitGraph`, `gantt`/`timeline`, `mindmap`, `journey`, `packet`, or chart |

### UML and SysML coverage

| UML / SysML diagram | Mermaid |
| --- | --- |
| Class, object, package | `classDiagram`; instances as `class o1["o1 : Order"]`; packages as `namespace` |
| Component, composite structure | `classDiagram` with `<<interface>>`, `C4Component`, or `block-beta` |
| Deployment | `architecture-beta` or `C4Deployment` |
| State, sequence, communication | `stateDiagram-v2`; `sequenceDiagram` with `autonumber` |
| Activity, interaction overview | `flowchart`; partition with `subgraph`; index separate sequence diagrams |
| Use case, timing, profile | Substitute `flowchart` or `gantt` only when their semantics fit; profiles are out of scope |
| SysML requirement | `requirementDiagram` |

`flowchart` models activity. Structure, interaction, state, cardinality,
topology, and traceability need their native forms.

### Detail that carries the meaning

| Mermaid | Keep |
| --- | --- |
| `classDiagram` | visibility; inheritance `<\|--`; composition `*--`; aggregation `o--`; multiplicity; interfaces; generics; namespaces |
| `sequenceDiagram` | call/reply/async arrows; activation; `alt`/`loop`/`par`/`critical`; `autonumber`; creation and destruction |
| `stateDiagram-v2` | `[*]`; `event / action`; nested states; choice/fork/join; concurrent regions `--` |
| `erDiagram` | cardinality; optionality; PK/FK/UK; a relationship verb |
| `requirementDiagram` | id, text, risk, verification method; satisfaction and verification links |
| `architecture-beta`, `C4*` | one level; explicit boundary; directed edge |

## Mermaid Syntax Catalog

| Category | Types |
| --- | --- |
| Design | `classDiagram`, `sequenceDiagram`, `stateDiagram-v2`, `erDiagram`, `requirementDiagram`, `C4*`, `architecture-beta`, `block-beta` |
| Process | `flowchart`, `swimlanes`, `journey`, `eventmodeling`, `mindmap`, `treeView`, `timeline`, `kanban` |
| Delivery | `gantt`, `gitGraph`, `packet` |
| Analysis | `xychart-beta`, `pie`, `quadrantChart`, `sankey-beta`, `radar-beta`, `treemap-beta`, `venn`, `ishikawa`, `wardley`, `cynefin` |
| Separate package | `zenuml` |

Renderer support differs. Load the specific syntax before use. `radar-beta`
renders in the VS Code validator; `zenuml` needs its separate package.

## Procedure

1. **Mine.** Inspect the supplied artifact and its nearest code, tests, docs,
   and configuration. Infer scope, audience, and the decision to support.
2. **Choose.** Select the strongest supported model. Under incomplete evidence,
   continue with verified facts; mark inferences and omissions explicitly.
   Never ask for diagramming choices, scope, or missing detail.
3. **Build.** Load its grammar with `get-syntax-docs-mermaid`; preserve
   source-system names and the required detail above.
4. **Prove.** Run `mermaid-diagram-validator` until clean, then
   `mermaid-diagram-preview`. Retry a timeout. Without these tools, preview in
   Mermaid Chart or render `mmdc -i diagram.mmd -o diagram.svg`.
5. **Deliver.** Insert a `mermaid` block beside its evidence, state scope and
   assumptions, then revalidate the final source.

## Quality Gate

- The type matches the decision, and `flowchart` appears only for a procedure.
- Every element traces to code, a test, a document, or a labeled assumption.
- Identifiers and labels match source-system vocabulary.
- Required model detail is present; validation is clean; preview is readable.
- The host text states scope and omissions, and matches the evidence.

## Output Shape

Give the diagram, supported decision, evidence, and assumptions. Requirements
state intent; architecture states observed structure; verification states checks.

## References

- [Mermaid introduction and syntax reference](https://mermaid.js.org/intro/)
- [Mermaid diagram syntax](https://mermaid.js.org/intro/syntax-reference.html)
- [Mermaid Chart VS Code extension](https://marketplace.visualstudio.com/items?itemName=MermaidChart.vscode-mermaid-chart) — in-editor Mermaid preview and diagram assistance.
- [`@mermaid-js/mermaid-cli`](https://www.npmjs.com/package/@mermaid-js/mermaid-cli) — command-line rendering when validator/preview tools are unavailable.