# GitHub Copilot SDK 학습자료

## 문서 범위와 기준

이 문서는 애플리케이션에서 GitHub Copilot 기반 Agent를 만들기 위해 공식 GitHub Copilot SDK 자료를 학습 순서로 정리한 연구 문서다. 조사 기준일은 2026-09-19이며, 공식 SDK 저장소와 그 저장소가 연결한 GitHub 문서만 1차 출처로 사용했다.

- **사실**: 공식 README 또는 공식 문서에 명시된 내용이다.
- **권고**: 조사한 사실을 바탕으로 한 학습 순서와 언어 선택 의견이다.
- **주의**: SDK와 Copilot CLI/runtime은 빠르게 변경될 수 있으므로 실제 설치 전 각 언어 README의 최신 내용을 다시 확인한다.

주요 출처는 [github/copilot-sdk](https://github.com/github/copilot-sdk) 저장소의 `main` 브랜치다. 저장소 루트 README에 표시되는 언어 수만 세지 않고, 공식 SDK 디렉터리와 [Getting Started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md)의 언어별 링크를 교차 확인했다.

## 공식 자료를 읽는 순서

1. [Getting Started 튜토리얼](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md)로 첫 메시지, streaming, custom tool을 한 번 실행한다.
2. 선택한 언어의 SDK README에서 설치, Quick Start, API Reference를 확인한다.
3. [공식 Cookbook](https://github.com/github/awesome-copilot/tree/main/cookbook/copilot-sdk)에서 실제 기능 조합 예제를 찾는다.
4. [MCP](https://github.com/github/copilot-sdk/blob/main/docs/features/mcp.md), [Custom Agents](https://github.com/github/copilot-sdk/blob/main/docs/features/custom-agents.md), 인증과 관측성 문서로 운영 설계를 확장한다.
5. 언어별 개발 보조 지침은 [awesome-copilot의 SDK instruction 목록](https://github.com/github/copilot-sdk#are-there-instructions-or-sdk-guidance-for-copilot-to-speed-up-development)을 참고한다. 이 목록에서 Rust는 SDK README가 안내 자료이고, 나머지 언어는 별도 instruction 파일도 제공된다.

## 1. SDK의 역할과 구조

### 확인된 사실

Copilot SDK는 애플리케이션이 GitHub Copilot CLI/runtime을 프로그래밍 방식으로 제어하도록 하는 언어별 SDK다. SDK는 클라이언트와 세션을 만들고, 메시지를 보내며, 세션 이벤트를 수신하고, 애플리케이션의 도구 핸들러를 runtime에 연결한다. 기본 통신은 CLI/runtime과의 JSON-RPC이며, 세부 transport와 프로세스 수명주기는 언어별 SDK가 관리한다. ([Node.js README](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md), [Rust README - Architecture](https://github.com/github/copilot-sdk/blob/main/rust/README.md#architecture), [호환성 문서](https://github.com/github/copilot-sdk/blob/main/docs/troubleshooting/compatibility.md#overview))

```text
Your application
      |
      v
Language SDK: Client -> Session -> event/tool handlers
      |
      | JSON-RPC over stdio, TCP, or supported in-process transport
      v
Copilot CLI/runtime
      |
      v
Copilot models, built-in tools, MCP servers, session storage
```

### 핵심 객체

1. **Client**: runtime 연결, 시작/종료, 세션 목록과 삭제, 상태 확인을 담당한다.
2. **Session**: 하나의 대화와 작업 상태를 나타낸다. 메시지 전송, 이벤트 구독, 중단, 재개를 담당한다.
3. **Event**: `assistant.message`, `assistant.message_delta`, `tool.execution_start`, `session.idle` 등의 실행 신호다. 실제 이벤트 타입은 언어별 SDK README를 확인한다.
4. **Tool**: 모델이 호출할 수 있는 애플리케이션 함수다. SDK가 JSON Schema를 runtime에 전달하고, 모델의 호출이 애플리케이션 핸들러로 돌아온다.
5. **Permission handler**: 파일 쓰기, shell, URL, MCP 등 도구 실행 전에 허용 또는 거부를 결정한다.

SDK의 `onPermissionRequest` 계열 핸들러가 없으면 permission 요청은 자동 승인되지 않고 보류되며, 공식 호환성 문서는 이를 deny-by-default 모델로 설명한다. 학습용 샘플의 `approveAll`은 프로덕션 정책의 예가 아니라 API 흐름을 확인하기 위한 편의 기능으로 취급한다. ([Permission control](https://github.com/github/copilot-sdk/blob/main/docs/troubleshooting/compatibility.md#permission-control), [Node.js permission handling](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#permission-handling))

## 2. 공식 지원 언어 비교

다음 표의 버전과 패키지명은 조사 기준일에 각 SDK README에서 확인한 값이다. 버전은 최신 릴리스 고정값이 아니라 README에 적힌 현재 요구사항 또는 예시일 수 있다.

| 언어 | 공식 패키지 또는 모듈 | README의 최소 요구사항 | 기본 runtime 조달과 설치 | 첫 학습 자료 |
| --- | --- | --- | --- | --- |
| TypeScript / Node.js | `@github/copilot-sdk` | Node.js `^20.19.0` 또는 `>=22.12.0` | `npm install @github/copilot-sdk`. 선택적 플랫폼 runtime 패키지를 사용하며 SDK 시작 시 runtime을 다운로드하지 않는다고 설명한다. `COPILOT_CLI_PATH`로 외부 설치를 지정할 수 있다. | [Node.js README](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md), [Getting Started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#step-1-install-the-sdk) |
| Python | `github-copilot-sdk` | Python 3.11+ | `pip install github-copilot-sdk`. `python -m copilot download-runtime`으로 사전 조달할 수 있고, managed stdio/TCP 사용 시 최초 사용 때 자동 staging도 지원한다. | [Python README](https://github.com/github/copilot-sdk/blob/main/python/README.md), [Getting Started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#step-1-install-the-sdk) |
| Go | `github.com/github/copilot-sdk/go` | Go 1.24+ | `go get github.com/github/copilot-sdk/go`. README의 기본 전제는 Copilot CLI가 `PATH`에 있거나 `COPILOT_CLI_PATH`가 설정된 상태다. 배포 시 `go tool bundler`로 CLI를 embedding하는 선택지도 있다. | [Go README](https://github.com/github/copilot-sdk/blob/main/go/README.md), [Getting Started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#prerequisites) |
| .NET / C# | `GitHub.Copilot.SDK` | .NET Standard 2.0 호환 구현체. SDK 저장소 개발에는 .NET SDK 10+가 필요하다. | `dotnet add package GitHub.Copilot.SDK`. build RID에 맞는 pinned runtime을 release에서 조달하며, `CopilotCliBinaryPath` 또는 `CopilotSkipCliDownload=true`로 조정할 수 있다. | [.NET README](https://github.com/github/copilot-sdk/blob/main/dotnet/README.md), [Getting Started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#step-1-install-the-sdk) |
| Java | `com.github:copilot-sdk-java` | Java 17+. JDK 25 권장 | Maven Central 의존성으로 설치한다. 조사 시 README 예시는 `1.0.14-preview.1`이며, managed stdio/TCP는 플랫폼 runtime과 `runtime.node`를 materialize하는 방식으로 설명된다. in-process는 별도 native runtime classifier와 JNA가 필요한 실험 기능이다. | [Java README](https://github.com/github/copilot-sdk/blob/main/java/README.md), [Getting Started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#prerequisites) |
| Rust | `github-copilot-sdk` | Rust 1.94.0+ | `github-copilot-sdk = "1"`. 기본 `bundled-cli` feature가 CLI/runtime을 번들하는 방식이며, `default-features = false`로 끄면 배포 시 runtime을 별도로 제공해야 한다. | [Rust README](https://github.com/github/copilot-sdk/blob/main/rust/README.md), [Getting Started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#step-1-install-the-sdk) |

### 언어별 설치 예시

아래 명령은 학습을 시작하기 위한 최소 형태다. SDK 버전을 고정하거나 샘플 프로젝트에 맞게 조정할 때는 각 README의 Installation 절을 기준으로 한다.

#### TypeScript / Node.js

```bash
npm install @github/copilot-sdk tsx
```

#### Python

```bash
python -m venv .venv
.venv\Scripts\activate
python -m pip install github-copilot-sdk
python -m copilot download-runtime
```

#### Go

```bash
go mod init copilot-demo
go get github.com/github/copilot-sdk/go
```

Go는 별도 CLI 설치 또는 `COPILOT_CLI_PATH` 설정이 필요할 수 있다. 애플리케이션에 runtime을 포함하는 배포 경로는 [Go README의 embedded CLI 절](https://github.com/github/copilot-sdk/blob/main/go/README.md#distributing-your-application-with-an-embedded-github-copilot-cli)을 따른다.

#### .NET

```bash
dotnet new console -n CopilotDemo
dotnet add package GitHub.Copilot.SDK
```

#### Java

```xml
<dependency>
  <groupId>com.github</groupId>
  <artifactId>copilot-sdk-java</artifactId>
  <version>1.0.14-preview.1</version>
</dependency>
```

위 버전은 조사 시점 README 예시다. 새 프로젝트에서는 [Maven Central의 최신 artifact](https://central.sonatype.com/artifact/com.github/copilot-sdk-java)를 확인해 버전을 결정한다.

#### Rust

```bash
cargo add github-copilot-sdk
```

## 3. 단계별 학습 경로

각 단계는 작은 실행 결과를 남긴 뒤 다음 단계로 이동하는 방식으로 진행한다. 한 언어로 끝까지 따라간 다음 다른 언어는 동일한 개념을 옮겨보는 것이 API 차이를 구분하기 쉽다.

| 단계 | 학습 목표 | 구현할 결과 | 공식 자료 |
| --- | --- | --- | --- |
| 0. 환경 준비 | 언어 runtime, SDK, Copilot CLI/runtime, 인증 상태를 확인한다. | 선택한 SDK의 runtime과 인증이 준비된다. Go, Java, Rust는 별도 CLI 설치 또는 해당 SDK의 bundling 경로를 확인한다. | [Getting Started - Prerequisites](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#prerequisites), [Bundled CLI](https://github.com/github/copilot-sdk/blob/main/docs/setup/bundled-cli.md) |
| 1. 첫 세션 | Client를 만들고 Session을 생성한 뒤 첫 메시지를 보낸다. | `What is 2 + 2?`에 대한 응답을 출력한다. | [Getting Started - Step 2](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#step-2-send-your-first-message) |
| 2. 이벤트와 대기 | `send`와 `sendAndWait`의 차이, `session.idle`, 오류 이벤트를 이해한다. | 완료 이벤트를 기준으로 리소스를 정리한다. | [Node.js README - API Reference](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#api-reference), 각 언어 README의 Quick Start |
| 3. Streaming | delta 이벤트를 구독하고 최종 메시지와 구분한다. | 응답이 생성되는 동안 터미널 또는 UI에 출력한다. | [Getting Started - Step 3](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#step-3-add-streaming-responses), [Streaming](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#streaming) |
| 4. Custom tool | 이름, 설명, JSON Schema, handler를 갖는 도구를 등록한다. | 날씨 조회처럼 애플리케이션 코드가 모델 호출에 응답한다. | [Getting Started - Step 4](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#step-4-add-a-custom-tool), [Tools](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#tools) |
| 5. 상호작용 UI | 사용자 입력, 명령, 첨부파일을 연결한다. | 반복 대화와 `/deploy` 같은 애플리케이션 명령을 제공한다. | [Commands](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#commands), [User Input Requests](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#user-input-requests), [Image Support](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#image-support) |
| 6. MCP | local stdio 또는 remote HTTP/SSE MCP 서버를 session에 연결한다. | 기존 MCP 도구를 재구현하지 않고 Agent 기능으로 노출한다. | [MCP Servers Guide](https://github.com/github/copilot-sdk/blob/main/docs/features/mcp.md), [Getting Started - MCP](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#connect-to-mcp-servers) |
| 7. Custom agents | 전문 역할, prompt, 사용 도구를 정의하고 session에서 선택한다. | `pr-reviewer` 같은 역할별 Agent를 만든다. | [Custom Agents Guide](https://github.com/github/copilot-sdk/blob/main/docs/features/custom-agents.md), [Getting Started - Custom agents](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#create-custom-agents) |
| 8. 정책과 안전 | permission handler와 hook을 설계한다. | shell, 파일 쓰기, URL, MCP 호출을 정책에 따라 허용하거나 거부한다. | [Hooks overview](https://github.com/github/copilot-sdk/blob/main/docs/hooks/hooks-overview.md), [Permission Handling](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#permission-handling) |
| 9. 세션 지속성 | resume, session store, infinite sessions, memory를 구분한다. | 재시작 후 대화를 재개하고 긴 작업을 compaction과 함께 처리한다. | [Session persistence](https://github.com/github/copilot-sdk/blob/main/docs/features/session-persistence.md), 각 언어 README의 Infinite Sessions와 Memory |
| 10. 인증과 모델 제공자 | GitHub 인증, token provider, BYOK를 분리해 이해한다. | 사용자 인증 또는 자체 OpenAI-compatible endpoint를 사용한다. | [Authentication](https://github.com/github/copilot-sdk/blob/main/docs/auth/authenticate.md), [BYOK](https://github.com/github/copilot-sdk/blob/main/docs/auth/byok.md) |
| 11. 배포와 관측성 | runtime 조달, 외부 headless server, OpenTelemetry를 검토한다. | 컨테이너 또는 별도 runtime 환경에서 연결하고 trace를 수집한다. | [External CLI server](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#connecting-to-an-external-cli-server), [OpenTelemetry](https://github.com/github/copilot-sdk/blob/main/docs/observability/opentelemetry.md) |
| 12. 호환성과 한계 | SDK가 CLI protocol에 의존하는 지점을 확인한다. | SDK로 가능한 기능과 CLI 전용 기능을 구분한다. | [SDK and CLI compatibility](https://github.com/github/copilot-sdk/blob/main/docs/troubleshooting/compatibility.md) |

### 단계별 검증 질문

- Client와 Session을 종료하지 않아도 되는가? 각 언어의 context manager, `await using`, `defer`, `Drop` 등 자원 정리 방식을 확인했는가?
- Streaming delta와 최종 메시지를 중복 출력하지 않는가?
- Custom tool의 입력 schema와 실제 handler의 검증이 일치하는가?
- permission handler가 없을 때 요청이 보류되는 동작을 테스트했는가?
- MCP 도구 이름이 서버 키와 도구 이름의 조합으로 노출된다는 점을 고려했는가?
- session ID, token, API key, trace content를 로그에 남기지 않는가?
- `sendAndWait`의 timeout이나 취소가 runtime의 작업 자체를 중단하는지 언어별 문서를 확인했는가?

## 4. 언어 선택 권고

아래는 공식 사실이 아니라 이 학습자료를 위한 권고다.

### 첫 프로토타입

**TypeScript/Node.js**를 우선 권고한다. 공식 Getting Started 예제가 Node.js/TypeScript로 가장 완결된 CLI assistant 흐름을 보여 주고, 이벤트 구독과 custom tool을 짧은 코드로 확인할 수 있다. Node.js runtime 조건과 runtime package 동작은 [Node.js README](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#prerequisites)를 그대로 따른다.

### 데이터 처리와 Python 생태계

**Python**은 async/await, Pydantic 기반 tool schema, Python 관측성 도구와 결합해야 할 때 적합하다. Python SDK는 Python 3.11+와 `github-copilot-sdk`를 요구하며 runtime 사전 조달 명령도 제공한다. ([Python README](https://github.com/github/copilot-sdk/blob/main/python/README.md))

### 기존 서비스에 편입

**.NET 또는 Java**는 기존 기업 서비스가 해당 생태계에 있을 때 선택한다. .NET은 .NET Standard 호환 범위와 `Microsoft.Extensions.AI` 계열 tool 정의를 활용할 수 있고, Java는 Java 17+와 Maven/Gradle 배포 경로를 제공한다. 두 경우 모두 소비자 프로젝트의 runtime 조달과 개발 저장소의 build 요구사항을 구분한다. ([.NET README](https://github.com/github/copilot-sdk/blob/main/dotnet/README.md), [Java README](https://github.com/github/copilot-sdk/blob/main/java/README.md))

### 배포 제어와 저수준 통합

**Go**는 단일 바이너리와 embedding이 중요할 때 검토하고, **Rust**는 강한 타입, trait 기반 handler, transport와 runtime bundling을 세밀하게 제어해야 할 때 검토한다. 이는 성능 우열이 아니라 배포 모델과 팀의 언어 숙련도를 기준으로 한 권고다. ([Go embedded CLI](https://github.com/github/copilot-sdk/blob/main/go/README.md#distributing-your-application-with-an-embedded-github-copilot-cli), [Rust bundled runtime](https://github.com/github/copilot-sdk/blob/main/rust/README.md#bundled-runtime-artifacts))

## 5. 운영에 들어가기 전 확인할 사항

### 인증과 비밀값

GitHub 로그인 상태를 사용하는 방식과 `gitHubToken` 또는 언어별 token provider를 사용하는 방식은 구분한다. 자체 모델 endpoint를 연결하는 BYOK는 별도 provider 설정이며, custom provider 사용 시 model을 명시해야 한다. API key와 token은 소스 코드, 예제 커밋, 일반 로그에 직접 넣지 않는다. ([Authentication](https://github.com/github/copilot-sdk/blob/main/docs/auth/authenticate.md), [BYOK](https://github.com/github/copilot-sdk/blob/main/docs/auth/byok.md), [Node.js Custom Providers](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md#custom-providers))

### 권한 정책

학습 샘플의 `approveAll`을 운영 기본값으로 복사하지 않는다. 최소한 다음을 도구 종류별로 결정한다.

- shell: 허용 명령, 작업 디렉터리, 네트워크 접근
- write: 쓰기 가능한 경로와 파일 형식
- URL: 허용 host와 redirect 정책
- MCP/custom tool: 도구별 입력 검증과 승인 범위
- hook: 실패 시 retry, skip, abort 중 동작

### 외부 runtime과 네트워크

별도 headless runtime에 연결하면 SDK가 runtime 프로세스를 생성하지 않고 기존 서버에 연결할 수 있다. 공식 시작 가이드는 기본적으로 loopback만 허용하고, 다른 호스트에 노출하려면 방화벽, 사설 네트워크, reverse proxy, 인증을 함께 구성하라고 경고한다. ([External CLI server](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#connecting-to-an-external-cli-server))

### 관측성

SDK는 OpenTelemetry 설정을 client에 전달해 session, message, tool call trace를 수집하고 SDK와 CLI 사이에 W3C trace context를 전파할 수 있다. `captureContent` 같은 콘텐츠 수집 설정은 개인정보와 비밀값 노출 위험을 검토한 뒤 켠다. ([OpenTelemetry guide](https://github.com/github/copilot-sdk/blob/main/docs/observability/opentelemetry.md))

## 6. 호환성, 제한사항, 근거 공백

### 공식적으로 확인된 제한

- SDK는 CLI의 JSON-RPC protocol에 노출된 기능만 사용할 수 있다. CLI에만 있는 TUI 기능은 SDK API로 자동 제공되지 않는다. ([Protocol limitations](https://github.com/github/copilot-sdk/blob/main/docs/troubleshooting/compatibility.md#protocol-limitations))
- 공식 호환성 문서는 SDK가 protocol version 2부터 3까지 지원하고, v2 CLI 연결에는 자동 v2 adapter를 사용한다고 설명한다. 실제 연결 상태는 runtime에서 `getStatus()` 등으로 확인한다. ([Version compatibility](https://github.com/github/copilot-sdk/blob/main/docs/troubleshooting/compatibility.md#version-compatibility))
- `/login`, `/logout`, `/share`, 일부 TUI 명령과 대화형 UI는 SDK에서 직접 제공되지 않거나 별도 대체 API를 사용해야 한다. ([CLI-only features](https://github.com/github/copilot-sdk/blob/main/docs/troubleshooting/compatibility.md#-not-available-in-sdk-cli-only))
- 일부 API는 experimental로 표시되어 언어별 opt-in이나 추가 runtime 조건이 필요할 수 있다. 특히 Java README는 experimental API 사용 시 annotation 또는 compiler option을 요구한다고 설명한다. ([Java experimental APIs](https://github.com/github/copilot-sdk/blob/main/java/README.md#using-experimental-apis))
- runtime을 SDK에 포함하는지, 설치된 CLI를 사용하는지, 별도 서버에 연결하는지는 언어와 transport 및 배포 방식에 따라 달라진다. 표의 runtime 설명을 배포 설계의 확정 사실로 확대하지 말고 해당 언어 README의 Bundled CLI 또는 runtime 절을 다시 확인한다.

### 이 문서에서 다루지 않은 주장

- 모델별 비용, 사용량 한도, 조직별 Copilot 정책은 SDK README만으로 일반화하지 않는다.
- 각 SDK의 API 표면이 완전히 동일하다고 가정하지 않는다. Rust README는 trait, newtype, transport, prepared session 등 언어별 차이를 별도로 설명한다. ([Rust differences](https://github.com/github/copilot-sdk/blob/main/rust/README.md#differences-from-other-sdks))
- 특정 언어가 성능, 안정성, 비용 면에서 우월하다고 결론 내리지 않는다. 그런 결론에는 동일한 작업, runtime 버전, 모델, transport, 배포 환경을 통제한 별도 benchmark가 필요하다.
- Clojure, C++, 기타 커뮤니티 포트는 이 문서의 공식 지원 언어 목록에 포함하지 않는다. 학습 경로와 호환성 판단은 공식 `github/copilot-sdk` 저장소의 6개 언어만 대상으로 한다.

## 7. 공식 자료 목록

### 시작하기

- [GitHub Copilot SDK 저장소](https://github.com/github/copilot-sdk)
- [Build your first Copilot-powered app](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md)
- [Bundled CLI](https://github.com/github/copilot-sdk/blob/main/docs/setup/bundled-cli.md)
- [공식 Copilot SDK Cookbook](https://github.com/github/awesome-copilot/tree/main/cookbook/copilot-sdk)
- [언어별 SDK 지침 목록](https://github.com/github/copilot-sdk#are-there-instructions-or-sdk-guidance-for-copilot-to-speed-up-development)

### 언어별 SDK

- [TypeScript / Node.js README](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md)
- [Python README](https://github.com/github/copilot-sdk/blob/main/python/README.md)
- [Go README](https://github.com/github/copilot-sdk/blob/main/go/README.md)
- [.NET README](https://github.com/github/copilot-sdk/blob/main/dotnet/README.md)
- [Java README](https://github.com/github/copilot-sdk/blob/main/java/README.md)
- [Rust README](https://github.com/github/copilot-sdk/blob/main/rust/README.md)

### 기능과 운영

- [MCP Servers](https://github.com/github/copilot-sdk/blob/main/docs/features/mcp.md)
- [Custom Agents](https://github.com/github/copilot-sdk/blob/main/docs/features/custom-agents.md)
- [Session persistence](https://github.com/github/copilot-sdk/blob/main/docs/features/session-persistence.md)
- [Hooks overview](https://github.com/github/copilot-sdk/blob/main/docs/hooks/hooks-overview.md)
- [Authentication](https://github.com/github/copilot-sdk/blob/main/docs/auth/authenticate.md)
- [BYOK](https://github.com/github/copilot-sdk/blob/main/docs/auth/byok.md)
- [OpenTelemetry](https://github.com/github/copilot-sdk/blob/main/docs/observability/opentelemetry.md)
- [SDK and CLI compatibility](https://github.com/github/copilot-sdk/blob/main/docs/troubleshooting/compatibility.md)

## 다음 학습 과제

1. TypeScript 또는 Python으로 공식 Getting Started를 끝까지 실행한다.
2. 같은 예제를 다른 한 언어로 옮기되 Client, Session, event, tool, permission의 개념 대응만 기록한다.
3. `approveAll` 대신 shell과 write를 구분하는 permission handler를 작성한다.
4. custom tool 하나를 MCP 서버 연결로 교체하고, 두 방식의 입력 schema와 권한 흐름을 비교한다.
5. session resume과 OpenTelemetry file export를 추가해 재시작 및 오류 상황을 재현한다.
6. 실제 배포 언어를 결정하기 전에 runtime bundling, token 관리, tool 권한, trace 콘텐츠 수집 여부를 팀의 운영 요구사항과 대조한다.
