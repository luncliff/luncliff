# References

- <https://github.com/agentsmd/agents.md>
- <https://architecture.md/>

## Tools

### Microsoft Agent Package Manager (APM)

- <https://microsoft.github.io/apm/getting-started/installation/>
- <https://microsoft.github.io/apm/reference/>

### Visual Studio Code

- <https://code.visualstudio.com/docs/agents/overview>
- [Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Agent skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [Subagents](https://code.visualstudio.com/docs/copilot/agents/subagents)
- [Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Copilot CLI](https://code.visualstudio.com/docs/copilot/agents/copilot-cli)

## CLI Plugins

- [Portable Agent Plugins manifest and component paths](https://agent-plugins.org/): the root `plugin.json` identifies the shared package; `skills/` is discovered by both CLIs.
- [Copilot CLI plugin formats](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-cli-plugins): Agent Plugins 1.0 is the portable format; client-specific components have their own directory.
- [Copilot CLI marketplace setup](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace): `.github/plugin/marketplace.json` registers repo plugin sources.
- [Copilot CLI installation and inspection](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing): register a marketplace, install a plugin, and list installations.
- [Codex plugin packaging and repo marketplaces](https://developers.openai.com/plugins/build/plugins): `.agents/plugins/marketplace.json` exposes a local package that can be registered from a clone.
- [APM targets matrix](https://microsoft.github.io/apm/reference/targets-matrix/): APM installs agent dependencies separately from CLI plugin installation.

### CI Examples

Workflow sources from ten widely used plugin, skill, and agent-tool repositories (GitHub stars checked 2026-09-28):

| Repository | Stars | CI practice |
| --- | ---: | --- |
| [openai/codex](https://github.com/openai/codex/blob/main/.github/workflows/repo-checks.yml) | 126k | Tests repository release and installer scripts with unit tests. |
| [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/blob/main/.github/workflows/typescript.yml) | 90k | Runs package tests and builds after `npm ci`. |
| [wshobson/agents](https://github.com/wshobson/agents/blob/main/.github/workflows/validate.yml) | 40k | Checks JSON and marketplace paths, then runs plugin tests. |
| [github/awesome-copilot](https://github.com/github/awesome-copilot/blob/main/.github/workflows/validate-plugins.yml) | 39k | Runs a dedicated plugin validator on relevant changes. |
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/blob/main/.github/workflows/validate-plugins.yml) | 37k | Runs plugin validation on workflow changes as well as plugin changes. |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/blob/main/.github/workflows/react-best-practices-ci.yml) | 31k | Installs dependencies, validates, then builds. |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills/blob/main/.github/workflows/ci-quality-gate.yml) | 26k | Validates manifests, skill names, frontmatter, and paths. |
| [epoko77-ai/im-not-ai](https://github.com/epoko77-ai/im-not-ai/blob/main/.github/workflows/test.yml) | 5.7k | Runs pytest, generated-rule checks, and installer smoke tests. |
| [microsoft/apm](https://github.com/microsoft/apm/blob/main/.github/workflows/ci.yml) | 3.9k | Places a fast lint gate before heavier checks. |
| [microsoft/skills](https://github.com/microsoft/skills/blob/main/.github/workflows/skill-evaluation.yml) | 3k | Typechecks its test harness and runs skill evaluations. |

## Technical Writing

### For Engineering

- [Google Technical Writing courses](https://developers.google.com/tech-writing)
- [Docs for Developers: An Engineer's Field Guide to Technical Writing](https://docsfordevelopers.com/)
- [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/)
- [GitLab Documentation Style Guide](https://docs.gitlab.com/development/documentation/styleguide/)
- [Write the Docs software documentation guide](https://www.writethedocs.org/guide/)

## Prompting Guides

### For GitHub Copilot

- [Prompt engineering for GitHub Copilot Chat](https://docs.github.com/en/copilot/using-github-copilot/copilot-chat/prompt-engineering-for-copilot-chat)
- [How to write better prompts for GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/how-to-write-better-prompts-for-github-copilot/)
- [Best practices for using AI in VS Code](https://code.visualstudio.com/docs/agents/best-practices)
- [Add context to chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat-context)

### For ChatGPT Models

- [OpenAI Developers: Model guidance](https://developers.openai.com/api/docs/guides/latest-model)
