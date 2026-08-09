# Tech Learning

## Hooks run at fixed lifecycle points, not by model choice

A GitHub Copilot hook is a shell command the runtime executes deterministically at a specific point (`sessionStart`, `preToolUse`, `postToolUse`, `agentStop`, ...), configured as JSON (`version: 1`, `hooks` keyed by event). Unlike an instruction, it always runs — the model can't forget it.

## `additionalContext` has two shapes across surfaces

Copilot CLI's `sessionStart` output is flat: `{"additionalContext": "..."}`. VS Code Copilot Chat (Preview) expects nested: `{"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": "..."}}`. Emit both keys in one object — each surface reads only its own shape.

## Prompt-type hooks are Copilot-CLI-only

`type: "prompt"` auto-submits text as if the user typed it, but only fires in Copilot CLI's interactive sessions (not `-p` mode); VS Code only documents `type: "command"`. A prompt hook telling the agent to self-check files would silently no-op in VS Code.

## `printf` is not a native PowerShell command

`echo` is a builtin/alias in both bash and PowerShell (Windows and Core); `printf` is bash-only — confirmed via `Get-Command printf` returning nothing on Windows. A hook's `command` field runs under both shells, so it must work in both.
