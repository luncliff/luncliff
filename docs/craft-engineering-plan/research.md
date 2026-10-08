# Research: craft-engineering-plan

Evidence behind the skill. Status per item: fetched directly, or summarized by a subagent and not re-fetched.

## Prompting and agent-engineering guides

- [OpenAI: Using GPT-6](https://developers.openai.com/api/docs/guides/latest-model), fetched directly: user instructions take precedence over skills; unclear or conflicting skill guidance makes the model pause; ask for approval only after preparing a concrete, reviewable result; specify when to use subagents; run tests suited to the change and widen only when justified.
- [Anthropic: Prompting Claude Fable 5.1](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1), fetched directly: the request or the approved plan sets the scope; proceed on reversible steps and stop only for destructive actions or scope changes; report extras as follow-ups; about one focused test per stated behavior; compaction must keep decisions and constraints exactly.
- [OpenAI: Using PLANS.md](https://developers.openai.com/cookbook/articles/codex_exec_plans), subagent summary: a self-contained living plan that a fresh agent can restart from; independently verifiable milestones; exact commands with expected results; proceed to the next milestone without asking.
- [OpenAI: Codex prompting guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide), subagent summary: avoid forcing upfront plans or status preambles during implementation; batch independent tool calls.
- [Anthropic: Claude Code best practices](https://code.claude.com/docs/en/best-practices), subagent summary: separate research and planning from implementation; approve the plan before coding; give the agent a runnable check; use fresh-context subagents for review.
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (2025-11-26), subagent summary: read the progress file and git log first; one feature per session; commit and leave a clean state.
- [Anthropic: Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (2025-09-29), subagent summary: structured notes outside the context window; subagents with clean contexts return condensed results.
- [Anthropic: Multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (2025-06-13), subagent summary: a brief needs an objective, output format, tools and sources, and task boundaries.
- [GitHub Spec Kit](https://github.com/github/spec-kit) and its [announcement](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) (2025-09-02), subagent summary: specify, plan, tasks, implement, with a checkpoint at each phase; mark parallel tasks.
- [Martin Fowler: Understanding spec-driven development](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) (2025-10-15), subagent summary: the full workflow is too heavy for small fixes; long Markdown output is hard to review.
- [VS Code: Best practices](https://code.visualstudio.com/docs/agents/best-practices) and [Context engineering guide](https://code.visualstudio.com/docs/agents/guides/context-engineering-guide) (2026-10-07), subagent summary: plan, then implement in a separate context; plan template with requirements, design, tasks, and one to three open questions; test first.
- [Ralph](https://ghuntley.com/ralph/) (2025-07-14), subagent summary: one fixed prompt per loop; one item per loop; tests and builds as backpressure; the author limits it to greenfield work.
- [AGENTS.md](https://agents.md/), subagent summary: living agent documentation; the closest file takes precedence.

## Planning guidance read together (T9)

- Alignment, fetched directly from [Claude Code best practices](https://code.claude.com/docs/en/best-practices): for larger features, have the agent interview the user: "Don't ask obvious questions, dig into the hard parts I might not have considered." Separate research and planning from implementation "to avoid solving the wrong problem." Plan when "uncertain about the approach"; skip it if the diff fits one sentence.
- Strategy, fetched directly from [ExecPlans](https://developers.openai.com/cookbook/articles/codex_exec_plans): "Purpose and intent come first"; "Do not outsource key decisions to the reader"; for "significant unknowns, use milestones to implement proof of concepts"; each milestone is "independently verifiable"; acceptance is phrased as observable behavior; plans describe "not just the what but the why."
- Subagent summaries: Spec Kit asks clarifying questions and keeps the spec on "WHAT users need and WHY"; the VS Code guide asks clarifying questions before planning and records "1-3 open questions"; the GPT-5 guide documents reasonable assumptions and proceeds; GPT-6 asks focused questions only when the answer could change the outcome; Fable 5.1 checks in only when readings lead to materially different work; Anthropic's research lead "develops a strategy" before delegating and updates it on discoveries.

## Local checks (2026-10-08, Windows)

- uv 0.9.10 ran a single-file script with an inline `# /// script` block.
- .NET SDK 10.0.401 ran `dotnet run` on a single C# file; `#:package Humanizer@2.14.1` restored and ran.
- codex-cli 0.159.1 `exec` has `-m`, `-s`, `-o`, and appends piped stdin as a `<stdin>` block; `--dangerously-bypass-approvals-and-sandbox` exists and must stay unused.
- Copilot CLI has `-p`, `--model`, `--allow-all-tools`, and `--allow-tool`.
- Not checked: whether either CLI accepts `gpt-6-luna`; that needs a paid call.

## Governance and prior alignments

- `~/.copilot/copilot-instructions.md` and the project `AGENTS.md` share one text: prefer GPT-6 Luna; "Confirm and review each phase before opening the next."
- `~/.codex/AGENTS.md`: proceed by default; pause between phases only for a scope change, a hard-to-reverse step, or a requested review; prefer GPT 5.6 Luna.
- `~/.codex/config.toml`: model `gpt-5.6-terra`, sandbox `workspace-write`.
- `~/.codex/hooks.json`: after compaction, re-read the newest Codex `PLAN.md` for the session; at session or subagent start, read `~/user-retrospectives/`.
- `~/user-retrospectives/` and `docs/`: model-judge output informs and does not decide; external CLI evaluators run under session control; reusable helpers stay deterministic and narrow; a handoff keeps failed attempts and forbidden retries; a model substitution needs approval; documents state current state.
- Existing worknotes: `winui3-experiment` (root, dated log), `buildercards-flava` (`docs/`, current state), `matome_app` (`eval_data/`, 187 lines with about 20 timestamped resume sections).
