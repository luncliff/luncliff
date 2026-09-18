# luncliff's GitHub Workspace

## Posts

- [Exploring MSVC Coroutine](./posts/Exploring-MSVC-Coroutine.md) / [한국어](./posts/MSVC-Coroutine-알아보기.md)
- [libjpeg C API](./posts/working-with-libjpeg.md)
- [NDK Change Log 읽으면서 한 생각들](./posts/ndk-changelog-comments.md)
- [OpenSSL 3.0 빌드 방법](./posts/build-openssl3.md)
- 2023-10-28 [C++ Korea 2023년 10월 MeetUp: Conan C++ 패키지 매니저 살짝 맛보기](./posts/2023-10-28%20conan_cpp_for_kor.md)
- 2025-04-23 [구름 COMMIT 2504](./posts/2025-04-23%20구름%20COMMIT.md)
- 2025-08-11 [민주동덕에 봄은오는가](./posts/민주동덕에_봄은오는가.md)
- 2025-09-18 [한빛 Devground 2025 메모](./posts/note-hanbit-devground-2025.md)
- 2025-09-24 [구름 COMMIT 2509](./posts/2025-09-24%20구름%20COMMIT.md)
- 2025-10 [Stable Diffusion WebUI 학습](./posts/2025-learning-stable-diffusion-webui.md)
- 2026-09-01 [더불어민주당 분당갑 지역위원회 단체채팅방 관련](./posts/2026-09-01%20분당갑논란.md)

## How To

### Setup

Install .agents/skills using [Microsoft Agent Package Manager (APM)](https://microsoft.github.io/apm/):

```powershell
# see apm.yml for the details
apm install
```

The manifest also installs the latest default-branch contents from
`github/awesome-copilot`. Use `apm install --update` to refresh the resolved
revision after the lockfile has been created.

### Lint

Install the dependencies in [package.json](./package.json)

```powershell
npm install
```

Then run the lint command.

```powershell
npm run lint
```
