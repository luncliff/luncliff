# Architecture Patterns

## Entries

### Split retrospectives by purpose

Use flat purpose files in `docs/`, not one session log or role-based archive. Accepted categories are `tech-learning`, `business-value`, `code-quality`, `testing-verification`, `architecture-patterns`, and `work-management`; add another only when a durable lesson has no honest fit.

### Rewrite the current best version

Every retrospective update rewrites the whole target file instead of appending dated notes. Headings stay at H3, entries stay compact, and overlapping lessons are merged so the document remains a readable state statement rather than a changelog.

### Keep retrospective ingestion human gated

The retrospective skill writes only inside `docs/`. LLM Wiki ingestion remains a separate human action through `.wiki/raw/` or **LLM Wiki: Add Source**, so repository notes can be reviewed before they become long-lived retrieval material.

### Remind agents through session hooks

Use a `sessionStart` hook for cross-agent awareness instead of adding recurring instruction cost to `AGENTS.md`. Emit the shared reminder once per session; keep the hook simple and shell-compatible across VS Code Copilot Chat and Copilot CLI.

### Classify integrations by runtime boundary

Names alone do not identify artifact type. `sequential-thinking` can mean an Agent Skill or an MCP server, so inspect source structure and runtime contract before editing `apm.yml`; a skill dependency must not be represented as an MCP server.

### Leave unverified dependencies out

Do not encode a dependency whose manifest syntax or target compatibility was not checked. When `apm` is unavailable, removing a wrong entry is complete work, while adding the intended dependency remains blocked until installation behavior is verified.

### Prefer explicit primitive imports over unverified repository roots

APM supports virtual subdirectory references such as `github/awesome-copilot/skills/<name>`, while a repository-root import requires the source to behave as an installable package. Keep narrow, pinned imports when they are the verified contract; add a broad root only after a real install proves its package structure and collision behavior.

### Isolate artifacts by storage root

Separate experiment, debug, or test artifacts with distinct roots instead of filename tags inside a shared location. A separate root enforces isolation by construction and avoids extra tracking code that later reports must reconcile.

### Keep one source of truth per decision

Record a verdict, measurement, or status in exactly one canonical place. Dual recording creates future reconciliation work; prefer per-unit files with the directory listing as the index when a manual index would drift.

### Hide workflow policy until callers need it

Keep source enablement, provider selection, and acquisition-path state inside the workflow until a caller must choose it or a result must reproduce it. Public requests and results should widen only for demonstrated consumer operations.

### Convert external data at the boundary

External payloads become typed domain objects in the adapter before they reach workflow, persistence, or API code. Provider-native identity and relationship data stay internal unless consumers need direct navigation or independent addressing.

### Keep orchestration shallow

The public entry method should show lifecycle order, while private methods own one state transition or external boundary each. This keeps workflow failure paths visible to review and test without adding speculative service layers.
