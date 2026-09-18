# Testing Verification

## Entries

### Trust hook logs over model self-report

A `sessionStart` hook's context delivery was checked by running real `copilot` CLI requests and reading debug logs. Logs showed the text present while the model once answered `NONE`, so delivery claims must use runtime logs, not model self-report.

### Test the deployed hook path

Running a hook command directly proves only the command output. The actual claim is that `.github/hooks/*.json` loads and executes through the runtime, so verification must exercise the real Copilot hook path.

### Rule out implementation style with paired runs

Inline `command` hooks and separate script hooks both produced `NONE` in plain `copilot -p` self-report tests while debug logs contained the injected context. That rules out static-versus-script implementation style as the cause.

### Same-name artifacts need source verification

The `sequential-thinking` classification was verified by checking the official MCP package, `skills.sh`, and the raw skill repository. Both implementations exist, so artifact structure and source documentation, not name matching, decide what belongs in the manifest.

### Missing CLI keeps compatibility open

`apm` was unavailable on `PATH`, so `apm.yml` source syntax, `copilot` target support, and real installation for the intended skill were not verified. The correct result was a blocked dependency addition, not a guessed manifest entry.

### Verify dependency graphs with a real install

An APM dry-run parsed the manifest but did not validate every remote ref. A real isolated `apm install --target copilot` integrated 418 skills from `github/awesome-copilot`, then failed because the existing `#v2.1` refs do not exist upstream. The manifest was therefore not operational end to end.

### Syntax checks close only syntax claims

Removing an accidental manifest block was validated with editor diagnostics, which proved no YAML error was introduced. It did not prove the intended dependency could be installed, so the correction and follow-up gate stayed separate.

### Verify function tools in layers

Function-tool integration evidence should be separated into exact tool-call emission, local execution and output, normalized source production, grounded generation, and persistence. A successful tool call is not evidence that later workflow layers preserved the data.

### Test external adapters at both boundaries

Transport tests prove authentication, retries, and redaction; live contract tests prove provider parameters and payload shape; workflow tests prove normalized data survives selection, persistence, and publication. Unit success alone cannot close an external adapter.

### Validate examples at their claimed contract

JSON parsing proves syntax, schema validation proves payload shape, runtime model validation proves application compatibility, and render checks prove diagrams display. State unavailable verification honestly instead of upgrading a weaker check into a pass.

### Treat quota blocks as open gates

When provider quota blocks a live acceptance gate, stop consuming retries, run non-consuming checks, preserve the gate as open, and record the recovery command. Prior live results are supporting evidence only when touched source and tests are unchanged.

### Match coverage evidence to required gates

Report package, feature-core, and integration coverage separately when a plan names separate thresholds. An aggregate percentage does not close a required module gate, especially when credentials or live providers leave branches unexercised.

### Verify generated packages internally

For spreadsheets, documents, decks, and archives, verify headers, row counts, embedded media, package internals, and dimensions from source-scale calculations. A rendered preview can miss embedded objects that the package still contains.

### Use real commands when tests are waived

If the user exempts experiment tooling from unit tests, validation still needs an observed command run and named artifacts. Inspection is weaker than a real CLI invocation against representative input or live dependencies.

### Re-run Windows logs as UTF-8

On Windows, classify output-decoding failures separately from application failures. Re-run CLI or GitHub log inspection with UTF-8 output before treating a CP949 or `UnicodeDecodeError` failure as the workflow result.
