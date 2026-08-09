# Testing & Verification

## The model's self-report about injected context is unreliable

Claim: a `sessionStart` hook's `additionalContext` reaches the model. Method: ran the real `copilot` CLI, asked it to list injected context, cross-checked against `--log-level debug`'s logged request. Result: the log showed the text present in the request every time checked, but the model's own answer was correct once and a false `NONE` once — trust the log, not the model's self-report.

## A script's output being correct doesn't prove the deployed hook works

Claim: the hook works. Method: first just ran the extracted shell command directly. Result: that only tests the artifact, not `.github/hooks/*.json`'s actual load/execution path — re-testing against the real `copilot` CLI is what surfaced the finding above.

## Inline-`command` and separate-script hooks behaved identically

Claim: implementation style (one static `echo` vs. separate `bash`/`powershell` scripts) explains the plain-mode `NONE` results. Method: same test, 4 plain `copilot -p` runs each. Result: 8/8 `NONE`, both debug-logged as correctly present in the request — rules out implementation style; left open whether it's a Windows process-spawn timing effect, the self-report issue above, or both.
