# OpenSSL 3.0 빌드 방법

OpenSSL 3.0.7 버전이 배포된다는 소식이 들렸는데, 평소와 달리 이번엔 치명적(Critical)인 취약점이 발견된 모양.
https://news.hada.io/topic?id=7699
내일 출근하면 관련 업데이트가 시작될 것이기에 사전준비를 겸해서 OpenSSL 3.0 빌드 방법에 대해 정리해두고자 한다.

전체 과정은 [개인 Vcpkg Registry](https://github.com/luncliff/vcpkg-registry/blob/main/ports/openssl3)와 같고,
약간의 주해를 같이 남겨놓기 위한 목적의 글.

## With Vcpkg and Registry

Vcpkg Registry 자세한 사용법에 대해서는 [공식문서 Using Registries](https://github.com/microsoft/vcpkg/blob/master/docs/users/registries.md)를 정독하는 것이 가장 빠르다.

### 편의를 위한 코드 조각

(2022/10/31 기준)

#### PowerShell

```ps1
git clone "https://github.com/microsoft/vcpkg"
Push-Location "vcpkg"
    git clone "https://github.com/luncliff/vcpkg-registry"
    # ./bootstrap-vcpkg.bat # download vcpkg.exe
    ./vcpkg.exe install --triplet="x64-windows" openssl3 `
        --overlay-ports=vcpkg-registry/ports 
Pop-Location
```

#### Bash

```bash
git clone "https://github.com/microsoft/vcpkg"
pushd "vcpkg"
    git clone "https://github.com/luncliff/vcpkg-registry"
    # ./bootstrap-vcpkg.sh # download vcpkg executable
    ./vcpkg.exe install --triplet="x64-linux" openssl3 \
        --overlay-ports=vcpkg-registry/ports 
popd
```

## How To

OpenSSL은 오래된 라이브러리. 검색 결과가 본인에게 적합할 가능성은 낮다.
혼란스러울때는 검색에 앞서서 아래 5개 문서를 우선 확인.
그 후에도 내용을 찾을 수 없다면 소스폴더 내에서 관련 설명문을 찾아볼 것.

* https://github.com/openssl/openssl/blob/openssl-3.0.6/INSTALL.md
* https://github.com/openssl/openssl/blob/openssl-3.0.6/NOTES-PERL.md
* https://github.com/openssl/openssl/blob/openssl-3.0.6/NOTES-WINDOWS.md
* https://github.com/openssl/openssl/blob/openssl-3.0.6/NOTES-UNIX.md
* https://github.com/openssl/openssl/blob/openssl-3.0.6/NOTES-ANDROID.md

### 빌드환경 구성

Windows 에서는 빌드를 도와줄 도구들이 필요.

```ps1
choco install strawberryperl # --yes
choco install jom
choco install nasm
```

Linux 에서는 Perl + Unix Makefiles로 해결한다.

```
apt install perl --yes
```

Android 빌드라면 NDK에서 사용할 도구들의 경로를 확인할 수 있어야 한다.

```bash
export NDK_HOST_TAG="linux-x86_64"
export PATH="${ANDROID_NDK_ROOT}/toolchains/llvm/prebuilt/${NDK_HOST_TAG}/bin:$PATH"
```

### 빌드설정 입력

Configure는 CLI 인자(Argument)는 대략 아래와 같이 나눠서 볼 수 있다.
순서가 정해진 인자들이 있으므로 주의 필요함.

```bash
perl Configure ${SHARED} ${OPTIONS} \
        ${PLATFORM} \
        "--prefix=${HOME}/openssl3"
```

예를 들어,

```bash
perl Configure  shared  no-zlib no-modules no-makedepend no-asm \
        linux-x86_64 \
        "--prefix=${HOME}/openssl3"
```

```bash
perl Configure  no-shared  no-makedepend no-stdio no-ui no-asm \
        iossimulator-xcrun \
        "--prefix=${HOME}/out-iossimulator"
```

```ps1
perl Configure  shared  no-zlib no-asm -utf-8 -FS `
        VC-WIN64A `
        --prefix=output-win64
```

SHARED는 `shared`, `no-shared`중 1개를 선택.

PLATFORM의 경우 정해진 값들이 있으므로 [Configurations 폴더](https://github.com/openssl/openssl/tree/openssl-3.0.6/Configurations)에서 검색해서 사용한다.

#### 빌드 세부사항 변경

CLI인자로 제어할 수 없는 부분들은 .conf 파일들을 직접 수정해야 한다.

`inherit_from`을 사용해서 필요한 기반설정들을 조합해나간다는 부분이 중요하다.

```perl
# 50-win-onecore.conf
my %targets = (
    "VC-WIN64A-ONECORE" => {
        inherit_from    => [ "VC-WIN64A" ],
        lflags          => add("/NODEFAULTLIB:kernel32.lib /APPCONTAINER"),
        defines         => add("OPENSSL_SYS_WIN_CORE"),
        ex_libs         => "onecore.lib",
    },

    "VC-WIN64A-UWP" => {
        inherit_from    => [ "VC-WIN64A-ONECORE" ],
        lflags          => add("/APPCONTAINER"),
        defines         => add("WINAPI_FAMILY=WINAPI_FAMILY_APP",
                               "_WIN32_WINNT=0x0A00"),
        dso_scheme      => "",
        disable         => sub { [ 'ui-console', 'stdio', 'async', 'uplink',
                                   @{ UWP_info()->{disable} } ] },
        ex_libs         => "WindowsApp.lib",
    },
)
```

VC-WIN64A의 내용은 10-main.conf에서 찾을 수 있다.

```perl
# 10-main.conf
my %targets = (
    "VC-WIN64A" => {
        inherit_from     => [ "VC-WIN64-common" ],
        AS               => sub { vc_win64a_info()->{AS} },
        ASFLAGS          => sub { vc_win64a_info()->{ASFLAGS} },
        asoutflag        => sub { vc_win64a_info()->{asoutflag} },
        asflags          => sub { vc_win64a_info()->{asflags} },
        sys_id           => "WIN64A",
        uplink_arch      => 'x86_64',
        asm_arch         => 'x86_64',
        perlasm_scheme   => "auto",
        multilib         => "-x64",
    },
)
```

iOS와 같이 Minimum SDK 버전을 확정해야 하는 경우, 아래 내용에서 `cflags`를 수정한다.
OpenSSL은 Assembly 코드를 포함하고 있으므로 `asmflags`를 추가하거나, `no-asm` 옵션을 써서 C only로 빌드하는게 실수를 예방할 수 있다.

```perl
# 15-ios.conf
my %targets = (
    "ios64-xcrun" => {
        inherit_from     => [ "ios-common" ],
        CC               => "xcrun -sdk iphoneos cc",
        cflags           => add("-arch arm64 -mios-version-min=7.0.0 -fno-common"),
        bn_ops           => "SIXTY_FOUR_BIT_LONG RC4_CHAR",
        asm_arch         => 'aarch64',
        perlasm_scheme   => "ios64",
    },
)
```

### 빌드/설치

설치와 관련해서는 `install_*` 패턴으로 명명된 작업들이 makefile에 들어있으므로, 파일 안에서 관련 내용을 검색하여 읽어볼 것.

`clean` 역시 지원한다.

#### Windows

OpenSSL 문서에서는 nmake를 사용하지만 병렬빌드를 위해 JOM을 사용한다.
위에서 `-FS` 옵션을 입력한 것도 이것 때문

```ps1
jom /K /J 10 /F makefile install_dev
```

#### Non-Windows

그 이외의 경우 Unix Makefile로 바로 빌드할 수 있다.
크로스 컴파일 중이라면 로그 파일을 저장해서 원인 분석에 대비해야 한다.

```bash
make -j 10 install_dev > install.log
```

### 테스트/배포

`--prefix` 옵션을 사용했다면 빌드 직후 해당 폴더에 설치된다.
적절히 복사해서 사용한다.
