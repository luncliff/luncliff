---
name: workspace-maintenance
description: Maintain the luncliff workspace's APM dependencies and verify its agent configuration after updates.
disable-model-invocation: true
---

# Workspace maintenance

Use this skill when explicitly asked to refresh or check this repository's agent dependencies.

1. Read the root `apm.yml` and `apm.lock.yaml`. Run `apm outdated` to identify available updates; describe the proposed changes before updating dependencies.
2. When updating is in scope, run `apm update` and install the supported targets with `apm install --frozen`. Keep the lockfile and manifest together. Preserve unrelated local changes.
3. Run `apm audit --ci`, then check the installed CLI integrations: `copilot --plugin-dir ./plugins/luncliff-workspace plugin list` and, when Codex CLI is installed, `codex plugin marketplace list` and the `/plugins` browser in a trusted checkout.
4. Report which targets and checks passed, and distinguish a missing CLI or unavailable service from a package failure.
