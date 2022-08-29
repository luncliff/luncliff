# Windows C++ 프로젝트는 코드 커버리지를 어떻게 획득하나요?

> 이 글의 지식은 2019년에 생성되었습니다.
> 읽는이의 생각에 너무 오랜시간이 지났다면 무시하고 다른 정보를 검색해보세요.

## 왜 그런짓을?

### SonarCloud에서

SonarCloud에서 프로젝트를 생성하면 "Failed" 판정을 받는 이유 중 하나가 바로 코드 커버리지 부족입니다.
별도로 설정하지 않으면 Line Coverage 80% 이상을 요구하는데요.
`C++` `Code Coverage`등의 키워드로 방법을 검색해보면 여러 도구들과 예제들을 발견할 수 있습니다.

요즘 프로젝트들은 ReadMe.md에 뱃지 없으면 안되기 때문에 보통 [Codecov](https://about.codecov.io/)를 많이 고려하실 것 같습니다.
모종의 방법으로 GCC, Clang 컴파일러에 `-fcoverage` 명령줄 옵션을 주고 빌드한 다음, 테스트 코드를 실행하고, `gcov`나 `lcov`를 사용해서 커버리지파일(.gcda)을 얻어내는 것이죠.
마침 쉽고 간단한 예제도 제공하고 있네요.

* https://about.codecov.io/language/c-plus-plus/
* https://github.com/codecov/example-cpp11-cmake

### 그런데 왜 환경이...?

이 예제들은 전부 Linux, Unix 환경에서 GNU, LLVM 툴체인을 사용합니다.
Windows 환경만 지원하는 프로젝트에서는 방법이 없는걸까요?
물론 검색결과로는 몇가지 방법이 있는 것 같습니다.

* [OpenCppCoverage](https://github.com/OpenCppCoverage/OpenCppCoverage): 아직 살아있는 프로젝트인 것 같습니다만... 뭔가 만족스러운 예제를 찾을수가 없었습니다.
* [Bullseye](https://bullseye.com/): 체험판을 사용해본적도 있는데, 
GUI가 좀 오래된 느낌이 들었지만 꽤 괜찮았습니다. 다만 연간 사용료를 지불하기엔 부담스러워서 빠르게 포기해야 했죠.

차라리 [Windows환경에서 ClangCL을 사용해서 빌드를 진행한 다음, `.gcda`파일을 생성하는 것](https://marco-c.github.io/2018/01/09/code-coverage-with-clang-on-windows.html)도 가능하겠습니다만... 
ClangCL이 MSVC와 완전히 동일하지는 않기 때문에 빌드 관련 작업이 많아질 수 있습니다.
최근에야 ClangCL이 Visual Studio에 추가되면서 가능해졌습니다만,
오래된 버전의 Visual Studio를 사용하고 있다면 꼼짝없이 LLVM 툴체인 설치와 사용법부터 익혀야한단 말이죠.
어느정도의 경험을 보유하고 있지않다면 쉽지않은 일입니다.

### 답은 Visual Studio Enterprise가 아니라 Azure Pipelines?

사실 Microsoft Docs에 가면 [Use code coverage to determine how much code is being tested](https://docs.microsoft.com/en-us/visualstudio/test/using-code-coverage-to-determine-how-much-code-is-being-tested)
라는 문서가 이미 존재합니다.
요약하면 **Visual Studio Enterprise**에서 이미 "Analyze Code Coverage for All Tests"라는 명령을 지원한다는 내용이죠.
링크에 들어가보면 C# 또는 C++를 사용해서 Test Assembly로 사용할 수 있는 DLL을 만들어내면, 테스트케이스들의 Pass/Fail 뿐만 아니라 커버리지까지 획득할 수 있다는 내용입니다.

그런데 마침 Azure Pipelines에서 [Windows2022 이미지에 설치된 소프트웨어 목록을 찾아보면 Visual Studio Enterprise가 있습니다](https://github.com/actions/runner-images/blob/main/images/win/Windows2022-Readme.md).
요컨대, Azure Pipelines를 사용하기만 하면 코드 커버리지를 얻을 수 있다는 것입니다.
흠터레스팅하군요!

> 2019년까지만 해도 Azure Pipelines Classic Editor를 사용해서 쓰고 있었는데, 2022 연초부터 이걸 YAML로 모두 정리하고 싶다고 생각하고 있었습니다.
> 이제서야 뭐가 좀 진행되었네요.


## Azure Pipelines YAML 작성하기

### Sonar Task 설정

며칠 전에 https://sonarcloud.io/summary/new_code?id=luncliff-media 설정을 마쳤습니다.
이제 조금씩 키워나가는 일만 남았죠.
이 프로젝트의 `azure-pipelines.yml` 구조는 간단합니다.

1. SonarCloud 분석 준비(Prepare)
2. VSTest(`vstest.console.exe`)실행
3. SonarCloud 분석 실행(Analyze)
4. SonarCloud에 결과 업로드(Publish)

```yaml
jobs:
  - job: Analysis
    dependsOn: Build
    pool:
      vmImage: "windows-2022"
    steps:
      # ...
      - task: SonarCloudPrepare@1
        inputs:
          SonarCloud: "luncliff-sonarcloud"
          organization: "luncliff-github"
          projectKey: "luncliff-media"
          scannerMode: "CLI"
          configMode: "file"
      # ...
      - task: VSTest@2
        inputs:
          testSelector: 'testAssemblies'
          testAssemblyVer2: 'Debug\**.dll'
          searchFolder: 'build-x64-windows'
          codeCoverageEnabled: true
          otherConsoleOptions: '/ResultsDirectory:reports'
      # ...
      - task: SonarCloudAnalyze@1
      - task: SonarCloudPublish@1
        inputs:
          pollingTimeoutSec: "300"
```

GitHub이나 GitLab에서 Azure Pipelines로 SonarCloudPrepare를 사용하는 프로젝트를 검색해보면 `scannerMode`로는 MSBuild가 자주 보입니다.
[그나마 .NET 프로젝트들이 SonarCloud를 사용하는 모양이네요](https://docs.sonarcloud.io/advanced-setup/ci-based-analysis/sonarscanner-for-net/).
Visual Studio가 관련되어 있으면 C# 쪽에서 예제를 찾는게 빠를수도 있다는 교훈을 여기서 얻을 수 있습니다.
요즘 누가 C++로 개발하나요? (<-- 자기소개 중)

여튼, [SonarSource 예제](https://github.com/SonarSource/sonar-dotnet/blob/master/azure-pipelines.yml)에서 볼 수 있듯, `scannerMode`로 MSBuild를 사용하면 많은 내용을 `azure-pipelines.yml`에 내용을 적어줘야 합니다.
이렇게 말이죠...

```yaml
# 초기설정 참고: https://docs.sonarcloud.io/advanced-setup/ci-based-analysis/azure-pipelines/
jobs:
  - job: Analysis
    dependsOn: Build
    pool:
      vmImage: "windows-2022"
    steps:
      # ...
      - task: SonarCloudPrepare@1
        inputs:
          SonarCloud: "luncliff-sonarcloud"
          organization: "luncliff-github"
          scannerMode: "MSBuild" # <-- C# 프로젝트들을 따라했다...
          projectKey: "luncliff-media"
          projectName: "luncliff-media"
          projectVersion: "0.1.3"
          # sonar-project.properties에 작성할 내용을 다 여기에 넣어야 한다.
          extraProperties: | 
            sonar.language=c++
            sonar.cpp.std=c++20
            sonar.sourceEncoding=UTF-8
            sonar.sources=src/,test/
            sonar.exclusions=scripts/
            sonar.verbose=true
            sonar.cfamily.threads=4
            sonar.cfamily.build-wrapper-output=bw-output
```

아름답지 않습니다...
다른 프로그래밍 언어로 작성된 프로젝트들은 sonar-project.properties를 사용한단 말이죠.
`task: SonarCloudPrepare`, `scannerMode`로 검색해서 sonar-project.properties 파일로 대체하는 방법을 알아낸 게 이것입니다.
`scannerMode`에는 `CLI`. `configMode`에는 `file`을 설정하는 것이죠.

```yaml
- task: SonarCloudPrepare@1
  inputs:
    SonarCloud: "luncliff-sonarcloud"
    organization: "luncliff-github"
    projectKey: "luncliff-media"
    scannerMode: "CLI"
    configMode: "file"
```

properties 파일에 작성해야하는 내용은 [Sonar C Family](https://docs.sonarqube.org/latest/analysis/languages/cfamily/)의 설명을 따르면 됩니다.

```properties
sonar.host.url=https://sonarcloud.io

sonar.organization=luncliff-github
sonar.projectKey=luncliff-media
sonar.projectVersion=0.3

# sonar.verbose=true

sonar.language=c++
sonar.cpp.std=c++20
sonar.sourceEncoding=UTF-8
sonar.sources=src,test
sonar.exclusions=build,docs,scripts

sonar.cfamily.threads=4
sonar.cfamily.cache.enabled=false
sonar.cfamily.build-wrapper-output=bw-output
```
