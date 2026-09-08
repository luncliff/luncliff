# Tech Learning

## Entries

### Hooks run at lifecycle points

A GitHub Copilot hook is a shell command executed by the runtime at configured events such as `sessionStart`, `preToolUse`, `postToolUse`, or `agentStop`. It is not a model choice, so a valid command hook is stronger than an instruction the model may forget.

### `additionalContext` has two shapes

Copilot CLI reads flat `{"additionalContext":"..."}`, while VS Code Copilot Chat Preview expects `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}`. Emitting both shapes in one object lets each surface read the form it understands.

### Prompt hooks are CLI-only

`type: "prompt"` submits text as if the user typed it, but it applies to interactive Copilot CLI sessions and not VS Code command hooks. Cross-surface reminders should use command hooks rather than prompt hooks.

### Hook commands must be shell portable

Hook commands can run under different shells. `echo` is available in bash and PowerShell, while `printf` is not native PowerShell, so portable hook output should use commands verified on both Windows and Unix-like shells.

### Same names can hide different artifacts

`sequential-thinking` names both an Agent Skill and an MCP server. Learn the artifact by source structure and runtime behavior: a `SKILL.md` workflow with scripts is not the same dependency as a separately launched protocol server package.

### APM dependency sections encode boundaries

`dependencies.apm` and `dependencies.mcp` describe different runtime mechanisms. Use the skill or plugin dependency path only after source format and target runtime are verified; an MCP block should launch a server, not stand in for a skill.

### Prompt, schema, and code enforce different things

Prompts express intent, schemas enforce shape, and deterministic code enforces mechanical guarantees. None substitutes for the others: schema validity does not prove factuality, and prompt wording does not prove runtime structure.

### External evidence has strength levels

Official documentation defines supported behavior, live requests show current provider behavior, repository tracing shows what the app preserves or drops, and accepted requirements define the target. Classify claims by the strongest evidence actually observed.

### Provider links are data, not patterns

Canonical URLs and permalinks returned by a provider should be treated as provider data. Do not infer deep links from IDs until alternate scopes, nested items, and unsupported cases have been tested.

### Iterative LLM failures need trajectory labels

For multi-iteration workflows, classify the whole trajectory before blaming the final stage. Separate early success, recovery success, late regression, sustained unavailable state, and final validation failure so the terminal error is not misread.

### Artifact previews prove only what they render

Rendered previews are layout evidence, not proof that every packaged object exists. Inspect package internals when preview tools omit supported embedded images, drawings, media, or document parts.
