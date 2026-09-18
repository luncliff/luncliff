# GitHub Copilot hooks 조사

## 조사 기준

- 기준일: 2026-09-19
- 범위: Visual Studio Code GitHub Copilot hooks, GitHub Copilot CLI hooks, 그리고 CLI runtime을 제어하는 GitHub Copilot SDK의 programmatic hooks
- 우선 출처: 공식 VS Code 문서, GitHub Docs, `github/copilot-cli` 저장소와 release notes, `github/copilot-sdk` 저장소와 문서
- 표기:
  - `A`: 공식 문서, schema, source, release note에서 직접 확인
  - `B`: 둘 이상의 공식 1차 자료에서 교차 확인
  - `I`: 공식 자료에서 직접 보장하지 않아 동작 모델로부터 추론
- 문서의 URL과 날짜는 조사 시점에 직접 확인한 값이다. 제품 문서와 CLI는 빠르게 변경될 수 있다.

## TL;DR

GitHub Copilot의 hooks라는 이름은 제품별로 서로 다른 실행 계약을 가리킨다.

| 구분 | Visual Studio Code | GitHub Copilot CLI |
| --- | --- | --- |
| 상태 | Agent hooks Preview | CLI hooks configuration 및 reference |
| Native event 표기 | PascalCase | lowerCamelCase |
| Native event 수 | 8개 | 14개 |
| 설정 핵심 | `.github/hooks/*.json` 등의 JSON과 `command` 계열 필드 | `.github/hooks/*.json` 등의 JSON, `version: 1`, `bash`/`powershell`/`command`/`exec` |
| 통신 | command의 stdin/stdout JSON | command의 stdin/stdout JSON, HTTP POST, `sessionStart`용 prompt |
| 필터 | VS Code가 읽는 Claude-compatible 설정의 matcher는 현재 무시됨 | 지원 event별 matcher와 정규식 또는 Claude-compatible matcher |
| 권한 제어 | exit code와 stdout JSON으로 계속 진행, 차단, 추가 문맥 등을 제어 | event별 exit code, timeout, `permissionDecision`, `behavior` 등으로 제어 |
| 언어 선택 | 공식 전용 언어 SDK는 확인되지 않음. 실행 가능한 command라는 점에서 언어 중립적으로 작성 가능하다는 해석은 `I` | shell 또는 executable을 호출하는 command로 구현. CLI runtime을 애플리케이션에서 제어하는 공식 SDK는 Node.js/TypeScript, Python, Go, .NET, Java, Rust |

중요한 경계: CLI의 PascalCase compatibility input이 VS Code native hooks의 모든 event와 실행 동작이 같다는 뜻은 아니다. 설정 파일, native event 목록, matcher, timeout과 permission semantics는 제품별로 분리해야 한다. `A/B`

## 1. Visual Studio Code GitHub Copilot hooks

### 1.1 상태와 전제

VS Code Agent hooks는 Preview 기능이다. 설정 형식과 동작은 변경될 수 있다. 공식 hooks guide와 hooks reference는 2026-09-16에 갱신된 문서로 확인했다. `A`

- [VS Code hooks guide](https://code.visualstudio.com/docs/agent-customization/hooks)
- [VS Code hooks reference](https://code.visualstudio.com/docs/agents/reference/hooks-reference)
- [VS Code 1.138 release notes](https://code.visualstudio.com/updates/v1_138)

### 1.2 설정 위치와 로드 범위

공식 guide에서 확인되는 위치는 다음과 같다.

| 범위 | 위치 또는 형식 |
| --- | --- |
| Workspace | `.github/hooks/*.json` |
| Claude-compatible workspace | `.claude/settings.json`, `.claude/settings.local.json` |
| User | `~/.copilot/hooks`, `~/.claude/settings.json` |
| Custom agent | `.agent.md` frontmatter의 `hooks` |
| Plugin | `hooks.json` 또는 `hooks/hooks.json` |

`chat.hookFilesLocations` 설정으로 hook 폴더와 개별 JSON 경로를 추가하거나 기본 위치를 비활성화할 수 있다. 같은 event에 대해 workspace hooks가 user hooks보다 우선한다. Agent-scoped hooks를 사용하려면 `chat.useCustomAgentHooks: true`가 필요하며 이 기능도 Preview다. `A`

주의할 점은 문서의 경로 표와 기본 검색 경로 설명 사이에 차이가 있다는 것이다. 경로 표에는 `~/.copilot/hooks`가 나오지만, `chat.hookFilesLocations`의 문서화된 기본 JSON에는 `.github/hooks`, `.claude/*`, `~/.claude/settings.json`만 보인다. `~/.copilot/hooks`의 기본 자동 로드 여부는 이 조사에서 확정하지 않는다. `A`, unresolved`

### 1.3 Native JSON 형식

VS Code native hook은 `hooks` 아래에 PascalCase event를 키로 두고, event별 command entry 배열을 둔다. CLI 설정에서 요구하는 `version: 1`은 VS Code native 예제에 없다.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/validate-tool.sh",
        "timeout": 15
      }
    ]
  }
}
```

Hook entry에서 확인되는 command 관련 field는 다음과 같다.

- `type: "command"`
- `command`
- `windows`
- `linux`
- `osx`
- `cwd`
- `env`
- `timeout`

`timeout`의 기본값은 30초다. OS별 command 선택은 extension host platform 기준이다. 따라서 SSH, Container, WSL을 사용하는 경우 로컬 Windows의 OS가 아니라 hook을 실제 실행하는 extension host 환경을 기준으로 command가 선택될 수 있다. `A`

### 1.4 지원 lifecycle event

VS Code native reference에서 확인되는 event는 다음 8개다.

1. `SessionStart`
2. `UserPromptSubmit`
3. `PreToolUse`
4. `PostToolUse`
5. `PreCompact`
6. `SubagentStart`
7. `SubagentStop`
8. `Stop`

CLI에만 문서화된 `sessionEnd`, `postToolUseFailure`, `errorOccurred`, `permissionRequest`, `notification`, `userPromptTransformed`를 VS Code native event라고 단정하면 안 된다. `A`

### 1.5 Input protocol

VS Code는 외부 command의 stdin으로 JSON object를 전달한다. 공통 field는 다음과 같다.

- `timestamp`: ISO 8601 string
- `cwd`
- `session_id`
- `hook_event_name`
- `transcript_path`

event별 주요 input은 다음과 같다.

| Event | 주요 input |
| --- | --- |
| `PreToolUse` | `tool_name`, `tool_input`, `tool_use_id` |
| `PostToolUse` | `tool_name`, `tool_input`, `tool_use_id`, `tool_response` |
| `UserPromptSubmit` | `prompt` |
| `SessionStart` | `source` |
| `Stop` | `stop_hook_active` |
| `SubagentStart` | `agent_id`, `agent_type` |
| `SubagentStop` | `agent_id`, `agent_type`, `stop_hook_active` |
| `PreCompact` | `trigger` |

`transcript_path`가 가리키는 transcript format은 stable API로 보장되지 않는다. Hook 구현은 reference에 명시된 field를 우선 사용해야 한다. `A`

### 1.6 Output protocol과 종료 코드

stdout은 agent 동작에 영향을 주는 JSON 출력 채널이다. 공통 output field는 다음과 같다.

- `continue`
- `stopReason`
- `systemMessage`

event별 주요 제어 출력은 다음과 같다.

| Event | 주요 output |
| --- | --- |
| `PreToolUse` | `hookSpecificOutput.hookEventName`, `permissionDecision` (`allow`, `deny`, `ask`), `permissionDecisionReason`, `updatedInput`, `additionalContext` |
| `PostToolUse` | `decision: "block"`, `reason`, `hookSpecificOutput.additionalContext` |
| `Stop` | `hookSpecificOutput.decision: "block"`, `reason` |
| `SubagentStart` | `additionalContext` |
| `SubagentStop` | `decision`, `reason` |

종료 코드는 다음 의미를 가진다.

- `0`: stdout을 JSON으로 parsing한다.
- `2`: blocking error다. stderr가 model context로 전달된다.
- 그 밖의 non-zero: non-blocking warning이다.

여러 제어 방식이 함께 사용되면 가장 restrictive한 결과가 적용된다. `A`

### 1.7 Matcher, 권한과 보안

VS Code가 읽는 Claude-compatible 설정의 matcher는 현재 무시되며 모든 tool invocation에 hook이 실행될 수 있다. 따라서 CLI용 matcher를 VS Code 설정에 복사해도 동일한 필터 동작을 기대할 수 없다. `A`

Hook은 VS Code와 같은 권한으로 shell command를 실행한다. 공식 권고는 다음과 같다.

- 신뢰하지 않는 repository의 hook을 실행하기 전에 내용을 검토한다.
- hook process에 필요한 최소 권한만 부여한다.
- stdin input을 검증하고 shell escaping을 적용한다.
- secret을 hook script에 hardcode하지 않는다.
- agent가 hook script를 수정할 수 있는 자동 승인 설정을 신중하게 사용한다.

근거: [VS Code hooks guide의 security와 debugging 설명](https://code.visualstudio.com/docs/agent-customization/hooks) `A`

### 1.8 Windows와 구현 언어

Windows에서는 `windows` command override를 사용할 수 있다. VS Code native field 이름은 `powershell`이 아니라 `windows`다. `powershell`은 CLI 설정에서 사용하는 field이며 VS Code native schema에 그대로 넣는 field로 확인되지 않았다. `A`

공식 문서는 VS Code hook 전용 언어 SDK를 제공한다고 설명하지 않는다. 확인된 계약은 command process가 stdin으로 JSON을 받고 stdout으로 JSON을 반환하는 것이다. 따라서 PowerShell, `cmd`, Python, Node.js, 또는 compiled executable처럼 해당 process 계약을 지킬 수 있는 구현을 호출할 수 있다는 해석은 가능하지만, 언어별 공식 지원 목록이라는 뜻은 아니다. 이 언어 중립성은 실행 모델에 대한 `I`다.

Windows에서 특히 확인할 사항:

1. `windows` command가 실제 extension host에서 실행되는지 확인한다.
2. WSL, SSH, Container를 사용하면 hook script와 interpreter가 다른 환경에 있어야 할 수 있다.
3. stdout에는 protocol JSON만 출력하고 진단 메시지는 stderr 또는 VS Code hook log로 보낸다.
4. timeout 30초 기본값을 넘지 않도록 command를 직접 실행해 측정한다.

### 1.9 디버깅과 테스트

공식 guide가 제시하는 확인 경로는 다음과 같다.

1. `Developer: Show Agent Debug Logs`를 실행한다.
2. Output panel의 `GitHub Copilot Chat Hooks` 채널을 확인한다.
3. Logs의 `Load Hooks`에서 로드된 경로와 오류를 확인한다.
4. stdin fixture를 command에 pipe해 JSON parsing과 exit code를 확인한다.
5. stdout JSON은 `jq` 또는 사용 언어의 JSON library로 검증한다.

근거: [VS Code hooks guide](https://code.visualstudio.com/docs/agent-customization/hooks) `A`

## 2. GitHub Copilot CLI hooks

### 2.1 버전과 상태

조사 기준일에 공식 `github/copilot-cli` 최신 stable release는 `1.0.86`이며 release date는 2026-09-17로 확인했다. `1.0.86-1`과 `1.0.86-2`는 prerelease로 표시된다. CLI는 release가 빠르고 hook 동작도 changelog에 계속 추가되므로 실제 배포 전에는 설치한 버전의 reference와 changelog를 다시 확인해야 한다. `A`

- [Copilot CLI repository](https://github.com/github/copilot-cli)
- [Copilot CLI releases](https://github.com/github/copilot-cli/releases)
- [Copilot CLI changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)

### 2.2 설정 위치와 적용 순서

공식 CLI 문서에서 확인되는 위치는 다음과 같다.

| 범위 | 위치 또는 형식 |
| --- | --- |
| Repository hooks | `.github/hooks/*.json` |
| User hooks, Windows | `%USERPROFILE%\\.copilot\\hooks\\*.json` |
| User hooks, macOS/Linux | `~/.copilot/hooks/*.json` |
| `COPILOT_HOME` 사용 시 | `$COPILOT_HOME/hooks/` |
| Repository inline | `.github/copilot/settings.json`, `.github/copilot/settings.local.json`, `.claude/settings.json`, `.claude/settings.local.json` |
| User inline | `~/.copilot/settings.json` |
| Plugin | plugin directory의 `hooks.json` 또는 `hooks/hooks.json` |
| Enterprise policy, Windows | `C:\\ProgramData\\GitHub\\Copilot\\policy.d\\*.json` 또는 `HKLM\\Software\\Policies\\GitHub\\Copilot` |

Load order는 policy, user, repository, plugin 순서다. 같은 event에 여러 hook이 있으면 모두 실행된다. Policy hook은 `disableAllHooks`로 끌 수 없다. `A`

### 2.3 Configuration schema

CLI hook 설정은 `version: 1`을 포함한다.

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "./scripts/check.sh",
        "powershell": ".\\scripts\\check.ps1",
        "cwd": ".",
        "env": {
          "LOG_LEVEL": "INFO"
        },
        "timeoutSec": 30
      }
    ]
  }
}
```

Command type에서 확인되는 field는 다음과 같다.

- `type: "command"`
- `bash`
- `powershell`
- `command`: cross-platform fallback
- `cwd`
- `env`
- `timeoutSec`
- `timeout`: `timeoutSec` alias
- `exec`
- `args`

`exec`와 `bash`/`powershell`/`command`는 함께 사용할 수 없다. `exec`는 shell interpretation, pipe, redirection, glob expansion을 제공하지 않는다. `exec`와 `args`는 CLI 전용이다. `A`

CLI는 command 외에도 다음 hook type을 지원한다.

- `http`: JSON POST
- `prompt`: `sessionStart`에서 text 또는 slash command를 자동 제출

### 2.4 지원 lifecycle event

CLI native event는 lowerCamelCase다.

1. `sessionStart`
2. `sessionEnd`
3. `userPromptSubmitted`
4. `userPromptTransformed`
5. `preToolUse`
6. `postToolUse`
7. `postToolUseFailure`
8. `permissionRequest`
9. `agentStop`
10. `subagentStart`
11. `subagentStop`
12. `errorOccurred`
13. `preCompact`
14. `notification`

CLI는 PascalCase event도 지원한다. 다만 이 경우 input은 VS Code-compatible snake_case format을 사용한다. 이는 payload compatibility이며 VS Code native hooks가 CLI의 14개 event를 모두 지원한다는 의미는 아니다. `A`

### 2.5 Input protocol

Command hook은 JSON input을 stdin으로 받는다. Native lowerCamelCase event에서는 camelCase field를 사용하고, PascalCase compatibility event에서는 VS Code-compatible snake_case field를 사용한다.

예를 들어 다음 대응이 있다.

| CLI native | PascalCase compatibility |
| --- | --- |
| `sessionId` | `session_id` |
| `toolName` | `tool_name` |
| `toolArgs` | `tool_input` |
| `timestamp`: Unix milliseconds | `timestamp`: ISO 8601 string |

주요 input field는 다음과 같다.

- Session: `sessionId`, `timestamp`, `cwd`, `source`, `initialPrompt`, `reason`
- Prompt: `prompt`, `transformedPrompt`
- Tool: `toolName`, `toolArgs`, `toolResult`, `error`
- Stop: `transcriptPath`, `stopReason`, `stop_hook_active`
- Subagent: `agentId`, `agentType`, `agentName`, `agentDisplayName`, `agentDescription`, `response`
- Error: `error.message`, `error.name`, `error.stack`, `errorContext`, `recoverable`
- Compact: `trigger`, `customInstructions`

### 2.6 Output protocol

최종 stdout 결과는 하나의 JSON document다. 빈 stdout 또는 invalid JSON은 output 없음으로 처리된다. 다음 progress object는 특별히 처리된다.

```json
{"type":"progress","message":"Checking policy...","temporary":true}
```

Progress object는 stdout에서 제거된다. 그 밖의 stdout은 합쳐져 하나의 `JSON.parse` 입력으로 처리되므로, progress가 아닌 JSON object를 여러 개 출력하면 parsing에 실패할 수 있다. Command와 HTTP hook output에는 invocation당 10 MiB 제한이 있다. `A`

주요 decision/output은 다음과 같다.

| Event | 주요 output |
| --- | --- |
| `preToolUse` | `permissionDecision` (`allow`, `deny`, `ask`), `permissionDecisionReason`, `modifiedArgs` |
| `postToolUse` | `modifiedResult`, `additionalContext` |
| `postToolUseFailure` | `additionalContext` |
| `agentStop`, `subagentStop` | `decision` (`block`, `allow`), `reason`; `subagentStop`은 `modifiedResponse`도 지원 |
| `permissionRequest` | `behavior` (`allow`, `deny`), `message`, `interrupt` |
| `notification` | `additionalContext` |
| `sessionStart` | `additionalContext` |
| `userPromptSubmitted` | config-file command/HTTP hook의 `modifiedPrompt`는 무시됨 |
| `userPromptTransformed` | `modifiedTransformedPrompt` |

`sessionEnd`, `errorOccurred`, `preCompact`에서는 command output이 decision으로 처리되지 않는다. `A`

### 2.7 Exit code, timeout과 fail-open/fail-closed

CLI command hook의 종료 동작은 event별로 다르다.

- `0`: 성공. stdout JSON을 parsing한다.
- `2`: 일반 event에서는 warning이며 stderr가 사용자에게 표시된다.
- `2` on `preToolUse`, `permissionRequest`: deny로 처리된다.
- `2` on `postToolUseFailure`: additional context로 취급된다.
- 그 밖의 non-zero: 일반 event에서는 failure를 기록하고 계속 진행한다.
- 그 밖의 non-zero on `preToolUse`: fail-closed로 tool call을 deny한다.
- 기본 timeout은 30초이며 timeout 후 process를 kill한다.
- timeout은 모든 event에서 fail-open이다.
- `preToolUse` timeout은 normal permission flow로 진행된다.
- HTTP `preToolUse`는 network error, timeout, non-2xx에서 fail-open이다.

따라서 “exit 2는 항상 차단” 또는 “timeout은 항상 허용”이라고 일반화하면 안 된다. event와 hook type을 함께 봐야 한다. `A`

### 2.8 Matcher와 필터 semantics

Matcher가 지원되는 event는 다음과 같다.

| Event | Matcher 대상 |
| --- | --- |
| `notification` | `notification_type` |
| `permissionRequest` | `toolName` |
| `postToolUse` | `toolName` |
| `preCompact` | `trigger` |
| `preToolUse` | `toolName` |
| `subagentStart` | `agentName` |

Native CLI matcher는 정규식으로 처리하며 전체 값에 대해 `^(?:PATTERN)$` 형태로 match한다. Invalid regex면 해당 hook entry를 skip한다. `A`

PascalCase `PreToolUse`와 `PermissionRequest`는 Claude/Open Plugins matcher semantics를 사용한다. `*`, `**`, 빈 matcher는 모두 match하고, `Bash`, `Edit|Write` 같은 literal 또는 alternation을 사용할 수 있다. 이 경우 tool name도 Claude-compatible 이름으로 전달될 수 있다. `A`

### 2.9 Permission과 security

- `preToolUse`는 tool 실행 전에 `allow`, `deny`, `ask`와 argument modification을 결정할 수 있다.
- `permissionRequest`는 permission service보다 먼저 실행되며 CLI 전용이다.
- Sandbox escape 요청에서는 `allow`가 bypass 승인을 의미하지 않고 `deny`만 전달된다.
- HTTP hook은 기본적으로 HTTPS만 허용한다.
- localhost HTTP는 `COPILOT_HOOK_ALLOW_LOCALHOST=1` 조건에서 허용된다.
- permission decision을 반환할 수 있는 HTTP hook은 HTTPS가 필요하다.
- `allowedEnvVars`로 HTTP header에 확장할 수 있는 환경 변수를 제한할 수 있다.
- `disableAllHooks`는 단일 `.github/hooks/*.json` 파일의 hook을 비활성화할 수 있다.
- repository `settings.json`의 top-level flag는 모든 non-policy hook을 비활성화할 수 있다.
- Policy hook은 `disableAllHooks`로 비활성화되지 않는다.
- Hook은 로컬 CLI shell과 동일한 개발자 권한으로 실행된다.

근거: [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) `A`

### 2.10 Windows와 구현 언어

CLI command 설정은 실행 경로에 따라 다음 field를 사용할 수 있다.

- `powershell`: Windows용 command
- `bash`: Bash 환경용 command
- `command`: cross-platform fallback
- `exec`와 `args`: shell 해석 없이 executable과 인자를 지정하는 CLI 전용 경로

공식 CLI README는 Windows에서 PowerShell v6 이상을 prerequisite로 표시한다. 반면 hooks 전용 how-to의 Windows 예제는 PowerShell 7.0 이상과 `pwsh`가 PATH에 있어야 한다고 설명한다. 두 공식 문서의 요구 버전이 다르므로, hooks 예제에는 PowerShell 7+를 권장 또는 요구 조건으로 두고, v6 표기는 일반 CLI prerequisite로 분리하는 것이 안전하다. `A`, documentation discrepancy

공식 changelog의 1.0.45 항목에는 Windows에서 PowerShell 7이 없을 때 Windows PowerShell로 fallback하는 동작이 기록되어 있다. 최신 버전의 실제 fallback은 설치 환경에서 직접 검증해야 한다. `A`

CLI hook 자체는 특정 애플리케이션 언어로 한정되지 않는다. 설정이 호출할 수 있는 shell command, script, 또는 executable이면 PowerShell, Bash, `cmd`, Python, Node.js, compiled executable 등을 사용할 수 있다는 해석이 가능하다. 다만 이 언어 목록은 CLI가 제공하는 공식 SDK 목록이 아니라 command 실행 모델에 대한 `I`다.

### 2.11 디버깅과 테스트

공식 CLI 문서가 제시하는 방법은 다음과 같다.

1. Verbose logging을 켜고 hook의 stdin payload를 stderr에 출력한다.
2. JSON fixture를 stdin으로 pipe해 hook을 직접 실행한다.
3. process exit code를 확인한다.
4. stdout은 `jq .`로 검증한다.
5. Windows PowerShell에서는 `ConvertTo-Json -Compress`로 compact JSON을 만든다.
6. 설정은 CLI 시작 시 로드되므로 변경 후 CLI를 재시작한다.
7. Unix에서는 hook script가 실행 가능하고 shebang을 갖는지 확인한다.

hook output은 stdout protocol과 섞이지 않게 유지해야 한다. 진단 출력은 stderr로 보내는 방식이 안전하다. `A`

## 3. Copilot SDK의 programmatic hooks

SDK는 CLI config-file hooks와 다른 경로다. Config-file hooks가 외부 command, HTTP, prompt를 호출하는 반면, SDK hooks는 애플리케이션 process 안에서 callback을 등록하는 programmatic API다. SDK callback은 command hook의 exit code/stdout/stderr protocol을 사용하지 않는다. `A/B`

공식 SDK repository가 제공하는 언어는 다음과 같다. 이는 CLI config-file hook script의 언어 목록이 아니라, CLI runtime을 애플리케이션에서 제어하는 SDK 목록이다.

- Node.js/TypeScript
- Python
- Go
- .NET
- Java
- Rust

SDK와 Copilot CLI runtime은 JSON-RPC로 통신한다. 따라서 SDK 언어 목록은 CLI config-file hook script의 언어 목록과 같은 의미가 아니다. `A`

공식 hook 문서의 언어별 근거 범위는 다음과 같다.

| 언어 | 공식 hook 근거 | 의미 |
| --- | --- | --- |
| Node.js / TypeScript | SDK hooks guide와 hook reference에 handler signature와 예제가 있음 | 공식 hook API 문서와 예제 |
| Python | SDK hooks guide와 hook reference에 handler signature와 예제가 있음 | 공식 hook API 문서와 예제 |
| Go | SDK hooks guide와 hook reference에 handler signature와 예제가 있음 | 공식 hook API 문서와 예제 |
| .NET / C# | SDK hooks guide와 hook reference에 handler signature와 예제가 있음 | 공식 hook API 문서와 예제 |
| Java | SDK hooks guide와 hook reference에 handler signature와 예제가 있음 | 공식 hook API 문서와 예제 |
| Rust | 공식 Rust SDK README의 `SessionHooks`, `HookEvent`, `HookOutput` 섹션에 구현 예제가 있음 | 공식 SDK API 문서와 예제. 공통 hooks guide의 언어별 접이식 예제에는 Rust가 포함되지 않음 |

근거: [SDK hooks guide](https://raw.githubusercontent.com/github/copilot-sdk/main/docs/features/hooks.md), [SDK hook reference index](https://raw.githubusercontent.com/github/copilot-sdk/main/docs/hooks/README.md), [Rust SDK README의 Session Hooks](https://raw.githubusercontent.com/github/copilot-sdk/main/rust/README.md) `A`

공식 SDK hook 문서에서 확인되는 callback 예시는 다음과 같다.

- `onPreToolUse`
- `onPostToolUse`
- `onPostToolUseFailure`
- `onUserPromptSubmitted`
- `onUserPromptTransformed`
- `onSessionStart`
- `onSessionEnd`
- `onErrorOccurred`
- 일부 SDK 문서의 `onAgentStop`

SDK의 `preToolUse` callback은 typed input과 return value로 allow, deny, ask, modified arguments, context, output suppression 등을 표현한다. 이 방식은 CLI JSON 설정의 `preToolUse` command hook과 목적은 비슷할 수 있지만 API surface와 오류 처리 계약은 다르다. `A/B`

근거:

- [Copilot SDK repository](https://github.com/github/copilot-sdk)
- [Copilot SDK README](https://raw.githubusercontent.com/github/copilot-sdk/main/README.md)
- [SDK hooks guide](https://raw.githubusercontent.com/github/copilot-sdk/main/docs/features/hooks.md)
- [SDK pre-tool-use reference](https://raw.githubusercontent.com/github/copilot-sdk/main/docs/hooks/pre-tool-use.md)
- [SDK post-tool-use reference](https://raw.githubusercontent.com/github/copilot-sdk/main/docs/hooks/post-tool-use.md)

정확한 표현은 “CLI hooks에 SDK가 있다”가 아니라 다음과 같다.

> GitHub Copilot CLI는 config-file hooks 경로와, CLI runtime을 애플리케이션에서 제어하는 Copilot SDK의 programmatic hooks 경로를 별도로 제공한다.

## 4. 제품별 practical path

### 4.1 VS Code에서 시작하는 순서

1. VS Code Agent hooks가 Preview임을 확인한다.
2. Workspace라면 `.github/hooks/` 아래 JSON을 만들고 native PascalCase event를 사용한다.
3. `type: "command"`와 `command` 또는 OS별 command를 지정한다.
4. hook process가 stdin JSON을 읽고 stdout에 유효한 JSON만 출력하도록 만든다.
5. `PreToolUse`의 `permissionDecision`처럼 해당 event에서 허용된 output만 사용한다.
6. timeout, shell escaping, secret, repository 신뢰 경계를 점검한다.
7. Agent debug logs와 `GitHub Copilot Chat Hooks` output channel로 로드와 실행을 검증한다.

### 4.2 Copilot CLI에서 시작하는 순서

1. 설치한 CLI version과 공식 changelog를 확인한다. 조사 기준일의 stable은 `1.0.86`이다.
2. Repository hook이면 `.github/hooks/`에 JSON을 두고, user hook이면 Windows에서 `%USERPROFILE%\\.copilot\\hooks\\`를 사용한다.
3. `version: 1`을 포함한다.
4. CLI native lowerCamelCase event와 지원되는 matcher를 선택한다.
5. Windows에서는 `powershell`, cross-platform fallback에는 `command`, shell 해석이 필요 없으면 `exec`와 `args`를 선택한다.
6. stdin payload, 단일 최종 stdout JSON, output 제한, exit code를 직접 테스트한다.
7. `preToolUse`와 `permissionRequest`의 deny semantics, timeout 예외, policy hook을 별도로 검증한다.
8. 설정 변경 후 CLI를 재시작하고 verbose logging으로 실행을 확인한다.

## 5. 비교표

| 항목 | VS Code native hooks | Copilot CLI config hooks |
| --- | --- | --- |
| 상태 | Preview | CLI release에 따라 변경 가능 |
| 설정 version | native 예제에 `version` 없음 | `version: 1` |
| Native event casing | PascalCase | lowerCamelCase |
| Event 목록 | `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PreCompact`, `SubagentStart`, `SubagentStop`, `Stop` | `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `userPromptTransformed`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `permissionRequest`, `agentStop`, `subagentStart`, `subagentStop`, `errorOccurred`, `preCompact`, `notification` |
| Command field | `command`, `windows`, `linux`, `osx`, `cwd`, `env`, `timeout` | `bash`, `powershell`, `command`, `exec`, `args`, `cwd`, `env`, `timeoutSec` 또는 `timeout` |
| 추가 hook type | 확인된 native 경로는 command | `http`, `prompt` |
| Input | stdin JSON, 공통 snake_case field | stdin JSON. Native는 camelCase, PascalCase compatibility는 VS Code-compatible snake_case |
| Output | stdout JSON. 공통 `continue`, `stopReason`, `systemMessage` | 최종 stdout 하나의 JSON document. progress JSON은 특별 처리 |
| `PreToolUse` decision | `permissionDecision`: `allow`, `deny`, `ask` | `permissionDecision`: `allow`, `deny`, `ask`, `modifiedArgs` |
| Error code | `0` parse, `2` blocking error, 기타 non-zero warning | `0` 성공, `2`는 event에 따라 warning/deny/context, 기타 non-zero는 보통 failure, `preToolUse`는 deny |
| Timeout | 기본 30초 | 기본 30초. timeout은 fail-open이며 `preToolUse`는 normal permission flow |
| Matcher | Claude-compatible matcher가 현재 무시됨 | 지원 event별 anchored regex 또는 Claude-compatible matcher |
| Windows selector | `windows` | `powershell`, `command`, `exec`/`args` |
| 실행 권한 | VS Code와 같은 권한 | CLI shell과 같은 개발자 권한 |

이 표는 공통 개념을 빠르게 비교하기 위한 것이다. 한 제품의 JSON을 다른 제품에 그대로 복사할 수 있다는 호환성 보장은 아니다. `A/B`

## 6. 공식 release history에서 확인한 hook 변화

다음 항목은 공식 CLI changelog에서 확인했다.

- `1.0.70`, 2026-07-09: `preToolUse` exit `2`를 deny로 처리
- `1.0.67`, 2026-06-30: hook timeout 후 tool이 계속 진행
- `1.0.61`, 2026-06-09: `/env`에서 hook source와 count 표시
- `1.0.49`, 2026-05-18: trusted repository의 `.github/hooks`가 `-p`에서도 로드
- `1.0.21`, 2026-04-07: PascalCase event에 VS Code-compatible snake_case payload 지원
- `1.0.85`, 2026-09-16: `/clear`에서 `sessionEnd` hook 실행
- `1.0.81`, 2026-08-27: hook trace context와 subagent hook lifecycle 기록

근거: [공식 Copilot CLI changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) `A`

## 7. 추천 학습 순서

1. 먼저 사용할 표면을 선택한다: VS Code extension host, Copilot CLI, 또는 SDK 애플리케이션.
2. 선택한 표면의 native event와 설정 경로만 읽는다.
3. 가장 영향이 적은 `SessionStart` 또는 `notification` 계열에서 stdin/stdout round trip을 검증한다.
4. 이후 `PreToolUse` 또는 `permissionRequest`로 권한 제어를 확장한다.
5. timeout, 실패 시 동작, repository 신뢰 경계, secret 전달을 테스트한다.
6. 마지막으로 제품 버전 release note와 reference를 다시 대조한다.

## 8. 공식 참고자료

### Visual Studio Code

- [Agent hooks in Visual Studio Code](https://code.visualstudio.com/docs/agent-customization/hooks): Preview 상태, 생성/설정 방법, 검색 경로, 프로세스 통신, 안전성, 디버깅.
- [VS Code hooks reference](https://code.visualstudio.com/docs/agents/reference/hooks-reference): command field, lifecycle event별 input/output schema, exit code.
- [VS Code 1.138 release notes](https://code.visualstudio.com/updates/v1_138): 조사 기준일에 확인한 관련 제품 릴리스 문맥.
- [Microsoft/vscode source repository](https://github.com/microsoft/vscode): 공식 구현 및 이슈 추적 경로. 이 문서는 source 내부 동작을 별도로 단정하지 않고 공개 문서 계약을 우선했다.

### GitHub Copilot CLI

- [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference): CLI hook 위치, configuration schema, event, payload, matcher, output, exit code, timeout, policy/security.
- [Using hooks with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks): CLI hook을 설정하고 사용하는 실습 경로. 이 URL은 reference의 Further reading 링크로 확인했다.
- [github/copilot-cli repository](https://github.com/github/copilot-cli): 공식 README, 지원 플랫폼, Windows prerequisite, 릴리스 링크.
- [Copilot CLI changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md): hook semantics 변경과 릴리스별 동작 기록.
- [Copilot CLI releases](https://github.com/github/copilot-cli/releases): 설치 버전과 prerelease 여부 확인 경로.

### Copilot SDK programmatic hooks

- [github/copilot-sdk repository](https://github.com/github/copilot-sdk): SDK 언어, CLI runtime 연동, JSON-RPC architecture.
- [Copilot SDK README](https://raw.githubusercontent.com/github/copilot-sdk/main/README.md): 지원 SDK와 설치/사용 진입점.
- [SDK hooks guide](https://raw.githubusercontent.com/github/copilot-sdk/main/docs/features/hooks.md): SDK callback 기반 hooks 개요.
- [SDK pre-tool-use reference](https://raw.githubusercontent.com/github/copilot-sdk/main/docs/hooks/pre-tool-use.md): programmatic pre-tool-use callback 계약.
- [SDK post-tool-use reference](https://raw.githubusercontent.com/github/copilot-sdk/main/docs/hooks/post-tool-use.md): programmatic post-tool-use callback 계약.
- [Rust SDK README](https://raw.githubusercontent.com/github/copilot-sdk/main/rust/README.md): Rust의 `SessionHooks`, `HookEvent`, `HookOutput` API와 구현 예제.

위 목록의 URL은 문서 작성 시점에 요청해 응답을 확인했다. 단, 빠르게 변경되는 문서의 내용과 버전별 runtime 동작까지 이 파일이 영구적으로 보장한다는 뜻은 아니다.

## 미해결 사항 및 검증 한계

- VS Code 문서의 경로 표에 있는 `~/.copilot/hooks`가 모든 설치에서 기본 자동 로드되는지는 `chat.hookFilesLocations` 기본값 설명과 차이가 있어 확정하지 않았다.
- VS Code와 CLI가 PascalCase compatibility payload를 공유해도 native event 전체, matcher, timeout, exit behavior가 같다는 보장은 확인되지 않았다.
- VS Code hooks reference에서 특정 언어 SDK가 제공된다는 근거는 확인하지 못했다. PowerShell, `cmd`, Python, Node.js, compiled executable을 사용할 수 있다는 언급은 command 실행 모델에 대한 inference다.
- CLI README의 일반 Windows prerequisite는 PowerShell v6 이상이고 hooks 전용 how-to의 예제 조건은 PowerShell 7 이상이다. 어느 조건이 모든 CLI hooks 시나리오의 최소 기준인지는 문서만으로 단정하지 않았다.
- CLI changelog의 PowerShell fallback 기록이 최신 version의 모든 Windows 설치 환경을 보장하는지 직접 runtime test는 수행하지 않았다.
- 이 문서는 hook process를 실제 실행해 성공 여부를 보장하는 설치 가이드가 아니라, 2026-09-19에 확인한 공식 문서와 source contract의 조사 결과다.
