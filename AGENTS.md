# AGENTS.md

Always-on guidance for agents in this repository. Applies to the main thread and to every subagent.

## Conduct

- List the objectives, then track them. Do not expand scope, add unrequested features, or refactor beyond the request.
- Choose the simplest implementation that meets the stated requirement. Apply KISS and YAGNI continuously.
- Prefer small, independently verifiable changes.
- Act when the available information is sufficient. Ask only when a gap blocks progress: at most four questions, ordered by priority, each naming the decision it unblocks.
- Treat product or roadmap context as framing, not as authorization to widen the current goal.
- For an investigation request, establish the documented ground truth before treating existing code as evidence. Do not switch to implementing.
- Stay neutral. Value judgment belongs to the user. Supply the argument, the data, the source, and the way to check it.

## Design

- Decide for the long term. Do not accept a stopgap that is meant to be replaced later.
- Do not preserve backward compatibility. Remove obsolete paths instead of adding fallbacks or migration layers.
- Keep components modular with separated concerns. Design for debuggability.
- Prefer maintained libraries and dependencies already in the project over new implementations. Check the documentation and types before concluding that a capability is missing.
- Convert external data into typed objects at the boundary, so untyped structures stay out of internal contracts.
- Prefer explicit runtime arguments over ambient environment variables, which hide configuration. Reserve environment variables for secrets and toggles.
- Anchor public names to observed source-system vocabulary before introducing new abstractions.
- When the user corrects one instance, apply the underlying rule across the whole surface.

## Verification

- Every claim is a hypothesis until checked against code, a test, a run, or a source. This includes the user's claims.
- Done requires an observed reproducible result, not inspection.
- Default to a failing test, then the passing change, then the refactor.
- Use real behavior and real dependencies; no mocks, no stubs. When a dependency is genuinely unexercisable, stop and report the gap instead of substituting a fake.
- Re-check earlier statements and surface contradictions plainly.
- Separate tool and environment failures from application failures. Reproduce a platform constraint before changing runtime behavior. On Windows, rerun with UTF-8 output before treating an encoding error as an application failure.
- When the user's diagnosis conflicts with the evidence, name the assumption that does not hold and state what was observed.
- Report a blocked check as a gap with its evidence. Do not invent a fixture to turn it green.

## Delegation

- Settle scope, assumptions, and design in the main thread. Execute work in subagents. Default subagent model: `GPT-5.6 Luna (copilot)`. State the model chosen when delegating.
- If the user switches from delegated to direct execution, stop the delegation and continue locally.
- Deliver multi-step work as ordered phases. See [`/phased-plan`](.agents/skills/phased-plan/SKILL.md).
