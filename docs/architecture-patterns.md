# Architecture & Patterns

### Split retrospective notes by purpose, not by session

Context: one cumulative file becomes unsearchable once takeaways span unrelated concerns. Decision: seven flat `docs/` files by purpose (`tech-learning`, `business-value`, `code-quality`, `testing-verification`, `architecture-patterns`, `work-management`, `misc`), grounded in Diátaxis, Constantine/Yourdon cohesion/coupling, Nygard's ADR, and this repo's own verification rule. Status: accepted. Consequences: a takeaway can span several files, each phrased in that file's own terms; category is inferred from content, not a forced lens.

### Rewrite the whole file as its current best version — never append

Context: wanted files directly usable by humans and agents, not a changelog. Decision: every update rewrites the whole file, merging new material, headings capped at H3. Status: accepted. Consequences: stays worth re-reading later, at the cost of reading the whole file before any edit.

### Cross-agent awareness via a `sessionStart` hook, not a static `AGENTS.md` line

Context: wanted every agent aware these files exist, without a per-turn `AGENTS.md` cost. Decision: a `.github/hooks/retrospective-notes/` `sessionStart` hook, one shared `hooks.json` for both VS Code Copilot Chat (preferred) and Copilot CLI. Status: accepted. Consequences: reminder costs once per session, not every turn; existence-checking was dropped once we noticed a `view` on a missing file is harmless, collapsing the hook to one static `echo`.

### The retrospective skill never writes to `.wiki/`

Context: LLM Wiki ingestion already has its own human-gated workflow (drop a file in `.wiki/raw/`, or **LLM Wiki: Add Source**). Decision: the skill's responsibility stops at `docs/`; ingestion timing stays separate and human-initiated. Status: accepted.
