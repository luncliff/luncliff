# Conan C++ 패키지 매니저 살짝 맛보기

* https://conan.io/
* https://docs.conan.io/2/index.html
* https://github.com/conan-io/conan
* Slack https://cpplang.slack.com/ #conan

2.0+ 버전 기준입니다.
매뉴얼을 자세히 읽어야할 것 같은 기분이 드는(?) 정도로만 다룹니다.

## [Installation](https://docs.conan.io/2/installation.html)

Python, `pip`를 사용해 설치할 수 있습니다.

* https://pypi.org/project/conan/
* https://pypi.org/user/conan-io/

```
python -m pip install conan>=2.0
python -m pip install conan --upgrade
```

### Windows

#### Windows Chocolatey

Chocolatey 를 사용해 설치하는 방법

* https://community.chocolatey.org/packages/conan

```ps1
choco install conan --yes
```

#### WinGet

Windows Package Manager 를 사용해 설치하는 방법

* https://learn.microsoft.com/ko-kr/windows/package-manager/
* https://github.com/microsoft/winget-cli
* https://winstall.app/apps/JFrog.Conan

```ps1
winget install --id=JFrog.Conan -e
```

## [Tutorial](https://docs.conan.io/2/tutorial.html)

우선 Browser를 열어서 패키지를 검색할 준비를 합니다

* https://conan.io/center
* https://github.com/conan-io/conan-center-index

가끔 서버에 문제가 생길수도 있습니다.
침착하게 "상태창"을 외칩니다.

* https://status.conan.io/

### [Consuming Package](https://docs.conan.io/2/tutorial/consuming_packages.html)

약식(略式)으로는 아래와 같은 [conanfile.txt](https://docs.conan.io/2/reference/conanfile_txt.html)을 사용합니다.
정식으로는 [conanfile.py](https://docs.conan.io/2/reference/conanfile.html)를 사용하는데, 이 부분은 [Creating Package](https://docs.conan.io/2/tutorial/creating_packages.html)에서 다룹니다.

* https://conan.io/center/recipes/openssl?version=3.1.2
* https://docs.conan.io/2/reference/conanfile_txt.html

```txt
# conanfile.txt
[requires]
openssl/3.1.2

[generators]
CMakeToolchain
```

이때 `[requires]`와 `[generators]`를 같이 작성해야 합니다.

* `[requires]`: `install` 명령을 사용해 설치할 패키지 목록
* `[generator]`: 설치한 라이브러리들을 빌드시스템에 전달하기 위해 생성할 파일들의 패턴

설치하면서 `[generator]`에서 생성한 파일들을 특정 폴더에 배치하도록 `--output-folder`를 사용해 지시할 수 있습니다.

* https://docs.conan.io/2/reference/commands/install.html

```bash
conan install conanfile.txt --output-folder=externals # 또는 --output-folder externals
```
```console
$ tree ./externals/
./externals/
├── CMakePresets.json
├── ...
└── conan_toolchain.cmake
```

개발환경에 따라서 소스코드로부터 빌드해야 할 수 있습니다.
상위버전의 툴체인으로 업그레이드 한 경우 이런 상황을 겪을 수 있습니다.  
Conan에서 사용한 빌드 환경들을 참고하거나, 재사용 할때는 https://hub.docker.com/u/conanio 를 확인해보는 것이 빠릅니다.

처음 Conan을 설치했다면, 위 명령을 실행할 때 default profile이 없다는 오류메세지를 확인했을 것입니다.  
빌드 관련 설정을 제어하기 위해서는 profile이 필요합니다.
(이후 Cross-Build에서 추가 설명)

* https://docs.conan.io/2/reference/commands/profile.html

```bash
conan profile detect --force
conan install conanfile.txt --build=missing # --output-folder=externals
```

```console
$ conan profile detect --force
detect_api: Found msvc 17

Detected profile:
[settings]
arch=x86_64
build_type=Release
compiler=msvc
compiler.cppstd=14
compiler.runtime=dynamic
compiler.version=193
os=Windows

WARN: This profile is a guess of your environment, please check it.
WARN: The output of this command is not guaranteed to be stable and can change in future Conan versions.
WARN: Use your own profile files for stability.
Saving detected profile to C:\Users\luncl\.conan2\profiles\default
```

여기서 가장 마지막 부분의 내용을 확인할 필요가 있습니다.

```ps1
Get-ChileItem "$env:USERPROFILE/.conan2/profiles"
Get-Content "$env:USERPROFILE/.conan2/profiles/default"
```

이렇게 생성된 profile 파일들은 install 명령의 `--profile` 로 지정할 수 있습니다.

```bash
conan install conanfile.txt --profile=default # --build=missing --output-folder=externals
```

#### 개발 환경에서 사용할 Tool 설치

`[requries]`에서는 빌드 결과물을 실행할 Target 환경에서 필요한 의존성을 기술하고,  
`[tool_requries]`에서는 빌드를 실행하는 개발환경에서 빌드를 수행하기 위해 필요한 도구들을 기술합니다.

예를 들어, [pkg-config](https://en.wikipedia.org/wiki/Pkg-config)를 사용하는 프로젝트라면 아래와 같이 pkg-config와 .pc 파일 생성을 동시에 요구할 수 있습니다.

* https://en.wikipedia.org/wiki/Pkg-config
* https://github.com/pkgconf/pkgconf

```txt
# conanfile.txt
[requires]
openssl/3.1.2

[tool_requires]
# https://conan.io/center/recipes/pkgconf?version=2.0.3
pkgconf/2.0.3
```

Windows에서 설치를 수행하고 나면 아래와 같이 cmdlet(.bat) 파일들이 생성됩니다.

```console
$ Get-ChildItem "externals"
Length Name
------ ----
    56 conanbuild.bat
  1002 conanbuildenv-release-x86_64.bat
    54 conanrun.bat
   686 conanrunenv-release-x86_64.bat
    67 deactivate_conanbuild.bat
    65 deactivate_conanrun.bat
```

Linux, Unix, Mac 환경이라면 아래와 같이 Shell Script 파일들이 생성될 것입니다.

```console
$ tree externals/
externals/
├── conanbuild.sh
├── conanbuildenv-release-x86_64.sh
├── conanrun.sh
├── conanrunenv-release-x86_64.sh
├── deactivate_conanbuild.sh
└── deactivate_conanrun.sh
```

`conanbuildenv-release-x86_64.bat`을 열어보면 `PATH`와 같은 환경변수들을 설정해주는 것을 볼 수 있습니다.

```console
$ Get-Content "externals/conanbuildenv-release-x86_64.bat"
```
```bat
@echo off
@REM ... skipped ...

set "PKG_CONFIG=C:/Users/luncl/.conan2/p/pkgco6062a3e090f7e/p/bin/pkgconf.exe"
set "ACLOCAL_PATH=C:\Users\luncl\.conan2\p\pkgco6062a3e090f7e\p\bin\aclocal;%ACLOCAL_PATH%"
set "AUTOMAKE_CONAN_INCLUDES=C:\Users\luncl\.conan2\p\pkgco6062a3e090f7e\p\bin\aclocal;%AUTOMAKE_CONAN_INCLUDES%"
set "PATH=C:\Users\luncl\.conan2\p\pkgco6062a3e090f7e\p\bin;%PATH%"
```

### [Creating Package](https://docs.conan.io/2/tutorial/creating_packages.html)

앞에서 conanfile.txt는 약식으로 사용하는 파일이라고 설명했는데,
정식(正式)으로 사용하는 파일은 [conanfile.py](https://docs.conan.io/2/reference/conanfile.html)입니다.

* https://docs.conan.io/2/tutorial/creating_packages/create_your_first_package.html
* https://docs.conan.io/2/reference/conanfile.html
   * https://docs.conan.io/2/reference/conanfile/attributes.html
   * https://docs.conan.io/2/reference/conanfile/methods.html

재사용가능한 패키지를 만들기 위해서는 패키지들의 생태계(Ecosystem)안으로 더 깊이 들어갈 필요가 있습니다.  
conanfile.py를 작성하는 것이 그 첫걸음이라고 생각하면 되겠습니다.  
(패키지들의 최종사용자인 Application을 개발한다면 conanfile.txt로도 충분할 것입니다.)

1개의 Conan 패키지는 `ConanFile`을 상속받아, 지정된 속성(attribute)과 메서드(method)들을 정의한 `class`입니다.  
고정값에 해당하는 (정적인) 부분을 속성으로 정의하고, 설치 환경에 맞게 대응하는 (동적인) 부분을 메서드로 구현합니다. 

* `name`, `version`, `settings`, `options`: Conan [패키지의 기본 4개 속성](https://docs.conan.io/2/reference/conanfile/attributes.html#package-reference)
* `package_type`: 이 패키지를 사용하는 [다른 패키지에 전달하는 패키지 파일 일람](https://docs.conan.io/2/reference/conanfile/methods/requirements.html#reference-conanfile-package-type-trait-inferring)을 결정합니다
* `requires`, `tool_requires`: 각각 `[requires]`, `[tool_requires]`와 동일
* `exports`, `exports_sources`: 패키지의 빌드/테스트에 사용되는 소스코드 일람

```python
# https://docs.conan.io/2/reference/conanfile.html
from conan import ConanFile

# https://docs.conan.io/2/reference/conanfile/attributes.html
class SampleConan(ConanFile):
    name = "sample"
    version = "1.1.0"

    package_type = "library"
    settings = "os", "arch", "compiler", "build_type"
    options = {
      "shared": [True, False]
    }
    default_options = {
      "shared": False
    }

    requires = [
        "openssl/3.1.2"
    ]
    # ...
```

* `generate()`: 패키지를 **사용**하기 위한 파일 생성
* `configure()`: 설치를 위한 빌드설정(settings,options)을 조정
* `build()`: 빌드/테스트 실행
* `package()`: 설치 후 패키징에 사용할 파일 선정
* `package_info()`: 패키지 정보 생성
* `test_package()`: 단위/통합 테스트와 분리된 `test_package/` 폴더에 작성된 패키징 결과물의 검증(validation)

반드시 모든 메서드를 정의해야 하는 것은 아닙니다.  
이미 존재하는 패키지들을 참고해 점차 추가해나가는 것이 좋습니다.
(ex. https://github.com/conan-io/conan-center-index/blob/master/recipes/abseil/all/conanfile.py)

#### `requires`, `generate()`

`requires`에서 기술한 내용은 `generate`에서 자동으로 사용됩니다.

```python
from conan.tools.cmake import CMakeToolchain

# https://docs.conan.io/2/reference/conanfile/methods.html
class SampleConan(ConanFile):
    # ...
    # requires = [ ... ]

    def generate(self):
        # create conan_toolchain.cmake
        tc = CMakeToolchain(self)
        tc.generate()
```

### Developing Packages Locally

* https://docs.conan.io/2/tutorial/developing_packages/local_package_development_flow.html#local-package-development-flow

이 부분부터는 conanfile.py를 바꿔가며 모의설치를 수행하는 과정을 반복하게 됩니다.
여기서 `conanfile.py`, `test_pacakge/`가 프로젝트의 소스코드와 분리되어있다는 점에 대해서 고민하여 이해할 필요가 있습니다.

```bash
conan source .
conan install . # --profile=default ...
conan build .
```

#### `requires`,`tool_requires` -> `requirements()`,`build_requirements()`

* https://docs.conan.io/2/reference/conanfile/methods/requirements.html
* https://docs.conan.io/2/reference/conanfile/methods/build_requirements.html

보다 본격적으로 패키지를 개발하게 되면 여러 조건과 특수화에 대응해야 합니다.
조건문을 사용하기 위해서는 `requires`, `tool_requires` 속성들을 `requirements()`, `tool_requirements()` 메서드로 교체해야 합니다.

```python
class SampleConan(ConanFile):

    # ... replace `tool_requires` ...
    def build_requirements(self):
        self.tool_requires("ninja/1.11.1")

    # ... replace `requires` ...
    def requirements(self):
        self.requires("openssl/[>=3.1]")
```

#### `configure()`

* https://docs.conan.io/2/reference/conanfile/methods/configure.html
* https://docs.conan.io/2/tutorial/consuming_packages/different_configurations.html#settings-and-options-difference

`SampleConan`에서 사용하는 패키지들의 옵션들을 조정할때는 `configure()`를 사용합니다.
[settings, options](https://docs.conan.io/2/tutorial/consuming_packages/different_configurations.html#settings-and-options-difference)에서 잘못된(Invalid) 조합이 발생하는 경우는 아래와 같이 예외처리 할 수 있습니다.

```python
from conan.errors import ConanInvalidConfiguration

class SampleConan(ConanFile):

    def configure(self):
        if self.settings.os == "Macos":
            raise ConanInvalidConfiguration("The package doesn't support Mac OS")

        if self.settings.os == "Windows":
            self.options["openssl/*"].shared = True
```

#### `exports_sources`

Conan의 패키지들은 저장소 전체를 사용해서 빌드하지 않고, 지정된 파일들만 "복사"해서 빌드/설치를 수행합니다.
빌드에 참여하는 파일들은 `exports_files`를 지시해줘야 합니다.

```python
class SampleConan(ConanFile):
    exports_sources = "CMakeLists.txt", "src/*", "include/*"

    # for more customization
    def export_sources(self):
        copy(self, "LICENSE.md", self.recipe_folder, self.export_sources_folder)
```

#### `build()`, `package()`

conanfile.py는 빌드시스템 파일이 아니라는 것에 주의해야 합니다.
빌드는 CMake, Meson과 같은 빌드시스템 생성기를 거쳐서 Visual Studio, Xcode, Ninja 빌드시스템에서 수행합니다.
conanfile.py에서는 아래와 같이 큰 흐름을 기술하기만 하면 됩니다.

```python
from conan.tools.cmake import CMake

class SampleConan(ConanFile):

    def build(self):
        cmake = CMake(self)
        cmake.definitions["WITH_OPENSSL"] = True
        cmake.configure()
        cmake.build()

    def package(self):
        cmake = CMake(self)
        cmake.install()
        # copyright files ...
        copyrightdir = join(self.package_folder, "licenses")
        copy(self, "LICENSE", src=self.source_folder, dst=copyrightdir)
```

예를 들어 MSBuild를 사용해 빌드하는 Visual Studio 프로젝트라면 아래와 같이 사용할 것입니다.

```python
from conan.tools.microsoft import MSBuild
from os.path import join
from conan.tools.files import copy

class SampleConan(ConanFile):

    def build(self):
        msbuild = MSBuild(self)
        msbuild.build_type = "Debug"
        msbuild.platform = "Win32"
        msbuild.build()

    def package(self):
        # program files
        outdir = join(self.source_folder, "out")
        copy(self, "*.lib", src=outdir, dst=join(self.package_folder, "lib"))
        copy(self, "*.dll", src=outdir, dst=join(self.package_folder, "bin"))
        # source(header) files
        includedir = join(self.source_folder, "include")
        copy(self, "*.hpp", src=includedir, dst=join(self.package_folder, "include"))

        # copyright files ...
```

#### `package_info()`

`package()` 가 구현되었다면 마저 작성해주어야 하는 것이 `package_info()` 입니다.
Conan에서 이미 "include" 폴더(`.includedirs`), "lib" 폴더(`.libdirs`)에 대한 기본값들을 제공하기 때문에, 보통은
다른 패키지의 컴파일 과정에서 필요한 매크로 선언들과 `package()`과정에서 포함된 라이브러리 목록을 정의해주면 됩니다.

* https://docs.conan.io/2/examples/conanfile/package_info.html

```python
class SampleConan(ConanFile):

    def package_info(self):
        if self.settings.os == "Windows":
            self.cpp_info.defines.append("NOMINMAX")
            self.cpp_info.system_libs = ["WindowsApp"]
        self.cpp_info.libs = ["sample"]  # ex) libsample.a, sample.lib

```

## [Integration](https://docs.conan.io/2/integrations.html)

빌드시스템과 연동하는 과정에서는 Conan의 버전과 툴체인의 버전이 영향을 줄 수 있습니다.
어느날 갑자기 오류가 발생해서 빌드를 못하는 상황을 예방하려면 주기적으로 확인할 필요가 있습니다.

유감스럽게도 이 부분은 매뉴얼에서 설명이 가장 짧은 부분들 중 하나입니다.
(반대로 2.0 버전이 한참 정비중인 지금이 개발자들이 기여할 수 있는 좋은 시기일지도 모릅니다)

### [Visual Studio](https://docs.conan.io/2/integrations/visual_studio.html)

* https://docs.conan.io/2/reference/tools/microsoft.html

```python
from conan.tools.microsoft import VCVars
from conan.tools.microsoft import MSBuildDeps, MSBuildToolchain, MSBuild
from conan.tools.microsoft import NMakeDeps, NMakeToolchain
```

* `MSBuildDeps`: 각 `[requires]`항목 마다, Visual Studio 프로젝트에서 사용할 수 있는 `.props`을 생성합니다
* `MSBuildToolchain`: **현재 패키지**의 Visual Studio의 Solution(`.sln`) 파일에서 사용 가능한 `conantoolchain.props`을 생성합니다
* `MSBuild`: `build()` 에서 `msbuild.exe` 를 실행할 수 있는 도우미(Helper)를 제공합니다. Solution 파일과 Target 목록을 전달받을 수 있습니다

```python
class SampleConan(ConanFile):

    def generate(self):
        # for each dependency
        deps = MSBuildDeps(self)
        deps.configuration = "Debug"
        deps.generate()
        # for solution file
        tc = MSBuildToolchain(self)
        tc.configuration = "Debug"
        tc.generate()

    def build(self):
        msbuild = MSBuild(self)
        msbuild.build_type = "Debug"
        msbuild.platform = "x64"
        # msbuild.build()
        sln = os.path.join(self.source_folder, "sample.sln")
        msbuild.build(sln, targets=["sample_cpp"])
```

### [Xcode](https://docs.conan.io/2/integrations/xcode.html)

* https://docs.conan.io/2/reference/tools/apple.html

```python
from conan.tools.apple import XcodeDeps, XcodeToolchain, XcodeBuild
from conan.tools.apple import XCRun
```

* `XcodeDeps`: 각 `[requires]`항목 마다, Xcode 프로젝트에서 사용할 수 있는 `.xcconfig`를 생성합니다
* `XcodeToolchain`: **현재 패키지**의 Xcode 프로젝트에서 사용할 수 있는 `conantoolchain.xcconfig`를 생성합니다
* `XcodeBuild`: `build()` 에서 `xcodebuild` 프로그램을 호출할 수 있도록 도우미(Helper)를 제공합니다

https://github.com/conan-io/conan-center-index 에서 찾아보면 `XcodeDeps`, `XcodeToolchain`, `XcodeBuild` 가 없습니다.
대신 Xcode에서 설치한 SDK 관련 정보를 얻기 위해 `XCRun`를 사용하는 경우는 발견할 수 있습니다.

```python
class SampleConan(ConanFile):

    def generate(self):
        tc = AutotoolsToolchain(self)
        # ...
        if self.settings.os == "Macos":
            xcrun = XCRun(self)
            tc.configure_args.append(f"--with-sysroot={xcrun.sdk_path}")
        tc.generate()
```

Apple 생태계의 프로젝트들은 Swift Package Manager로 이동하고 있기 때문에,
Conan 과 `xcodebuild`의 직접적인 통합보다는 간접적인 방법(Swift Package Manager의 BinaryTarget 등)을 고려할 필요가 있습니다.

### [Meson](https://docs.conan.io/2/integrations/meson.html)

* https://mesonbuild.com/index.html
* https://docs.conan.io/2/reference/tools/meson.html

```python
from conan.tools.meson import MesonToolchain, Meson
from conan.tools.gnu import PkgConfigDeps
```

Meson에서는 `pkg-config`에서 생성하는 `.pc`를 지원하기 때문에 `PkgConfigDeps`이 같이 사용됩니다.

```python
class SampleConan(ConanFile):

    def generate(self):
        # for each dependency
        deps = PkgConfigDeps(self)
        deps.generate()
        # for build system file generation
        tc = MesonToolchain(self)
        tc.project_options["tests"] = False
        tc.generate()

    def build(self):
        meson = Meson(self)
        meson.configure()
        meson.build()

    def package(self):
        meson = Meson(self)
        meson.install()
        # copyright files ...
```

### [CMake](https://docs.conan.io/2/integrations/cmake.html)

```python
from conan.tools.cmake import CMakeDeps, CMakeToolchain, CMake
from conan.tools.gnu import PkgConfigDeps
```

Conan 패키지 매니저의 대부분의 conanfile들은 CMake를 사용하고 있습니다.

* `CMakeDeps`: 각 `[requires]` 및 그 하위 component 항목 마다, CMakeLists.txt에서 사용할 수 있는 `Find*.cmake`를 생성합니다
* `CMakeToolchain`: **현재 패키지**의 CMakeLists.txt 에서 사용할 수 있는 `conan_toolchain.cmake`를 생성합니다
* `CMake`: `build()` 에서 `cmake` 프로그램을 호출할 수 있도록 도우미(Helper)를 제공합니다

`CMakeDeps`에서는 CMake Module 파일(`Find*.cmake`)을 생성하기 때문에, `find_package(* REQUIRED)` 와 같은 사용이 가능해집니다.

```cmake
# conan install --output-folder=externals
list(APPEND CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/externals")

# Expect Conan-generated FindOpenSSL.cmake(NOT CMake default)
find_package(OpenSSL REQUIRED)
```

`CMakeToolchain`에서 생성한 `conan_toolchain.cmake`는 `CMAKE_PROGRAM_PATH`, `CMAKE_LIBRARY_PATH`, `CMAKE_INCLUDE_PATH`를 설정해주기 때문에,  
경로를 찾아서 사용하는 방법을 간편하게 만들어줍니다.

```cmake
# conan install --output-folder=externals
list(APPEND CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/externals")
include(conan_toolchain.cmake)

find_path(OPENSSL_INCLUDE_DIR  NAMES "openssl/err.h" REQUIRED)
find_library(OPENSSL_SSL_LIBRARY    NAMES "ssl"    REQUIRED)
find_library(OPENSSL_CRYPTO_LIBRARY NAMES "crypto" REQUIRED)
```

## [Examples](https://docs.conan.io/2/examples.html)

패키지 매니저를 사용했을 때 얻을 수 있는 효용중 하나는 "툴체인 설정만 정리해두면 **Cross-Compile을 시도**하기 쉽다"는 것입니다.
Conan 에서는 이 과정을 Profile을 통해서 관리합니다.

현재 개발환경에서의 기본설정을 생성/확인하려면 아래와 같은 명령을 사용합니다.

```bash
conan profile detect --force
conan profile show
```

### [Cross-Building](https://docs.conan.io/2/examples/cross_build.html)

앞서 "Cross-Compile을 시도"라고 표현한 부분에서 위화감을 느낀 분들이 계실 것입니다.
단순히 `conan install`에서는 이미 잘 빌드가 끝나서 패키징/배포가 끝난 결과물(artifact)를 다운로드 받는 상황을 기준으로 사용하고 있습니다.

하지만 다운로드 받을 수 없다면 소스코드로부터 빌드를 실행해야 합니다.
작은 설정(setting) 차이에서 빌드/패키징 오류가 발생할 수 있고, 작은 툴체인 변화가 전체를 다시 빌드해야 하는 상황을 유발하곤 합니다.
통일된 빌드 환경에서 이 작업을 수행할 수 있도록 제어하고, 꾸준히 정기적으로 빌드가 가능한지 검사하는 절차를 정립할 필요가 있습니다.

#### Android

Android arm64-v8a 환경에 맞는 profile을 하나 만들어보면 아래와 같습니다

```txt
# $env:USERPROFILE/.conan2/profile/android_arm64
include(default)

[settings]
os=Android
os.api_level=28
arch=armv8
compiler=clang
compiler.version=14
compiler.libcxx=c++_shared
build_type=Release

[conf]
tools.cmake.cmaketoolchain:generator=Ninja
tools.android:ndk_path=C:/AndroidSDK/ndk/26.1.10909125
# tools.android:ndk_path=/usr/local/share/AndroidSDK/ndk/26.1.10909125
```

파일을 생성한 다음에는 list 명령으로 확인이 가능합니다.

```console
$ conan profile list
Profiles found in the cache:
android_arm64
default
```

간단한 conanfile.txt를 만들어서 패키지를 설치해보면...

```txt
[requires]
zlib-ng/2.1.4

[generators]
CMakeToolchain
```

```bash
conan install conanfile.txt --profile android_arm64 --build missing --output-folder externals
```

"Input profiles" 영역이 `default` profile을 사용할 때와는 다르게 출력되는 것을 확인할 수 있습니다.

```console
$ conan install ...
======== Input profiles ========
Profile host:
[settings]
arch=armv8
os=Android
os.api_level=28
...

Profile build:
[settings]
arch=x86_64
build_type=Release
compiler=msvc
compiler.cppstd=14
compiler.runtime=dynamic
compiler.runtime_type=Release
compiler.version=193
os=Windows
...
```

## 마치면서

C++ 개발자가 수동적인 상황에 빠지지 않기 위해서는 패키지 매니저를 기본기로 삼아야 합니다.

* https://www.jetbrains.com/lp/devecosystem-2022/cpp/#How-do-you-manage-your-third-party-libraries-in-C

개발자 생태계 설문조사에 따르면, 아직 많은 C/C++ 개발자들은 라이브러리를 관리할 때 사용자 프로젝트의 빌드에 포함시키거나, 각각의 기본 가이드를 따라서 빌드해 사용하거나, 이미 배포된 빌드결과물을 재사용하고 있습니다.

이런 행동들은 개발자/조직의 관리역량을 연쇄적으로 저하시킵니다.

1. 사용자 코드의 관리 방법이 파편화 되면서 수준 높은 코드가 새로 생겨나도 재사용성이 저하됩니다.
2. 사용자-제공자 사이에서 방법론의 일관성이 저하되고,  
   라이브러리를 사용할 때마다 생소하게 느끼거나 불편한 경험을 더 많이 겪게 됩니다.
3. 라이브러리를 잘 사용하지 않게 되면서, 관리에 필요한 규칙과 방법을 발전시키지 않습니다.
4. 능동적인 선택이 줄어들면서, 재사용보다는 재작성이 강제됩니다.  
   과도한 노력이 소비됩니다. (재작성을 선택하는 경우와는 다릅니다!)
5. 1번부터 반복합니다.

패키지 매니저의 지원이 있다면,

1. 패키지를 도입/제거하기 쉬워지면서 패키지들을 대체하기가 쉽습니다.
2. 재사용의 단위를 시스템에서 정의하며, 일관된 방법으로 제공하고 사용할 수 있습니다.
3. 보다 복잡한 규모를 가진, 많은 패키지들이 생태계에서 지속적으로 검증되고 발전합니다.
4. 1번부터 반복합니다.

코드의 재사용성과 생산성이 오롯이 개발자/조직의 역량에 맡겨지는 상황보다,
생태계와 시스템의 지원을 받는 상황이 더 능동적인 결정을 내릴 수 있고, 많은 선택지를 고려할 수 있습니다.

C++ 개발자 생태계에서 패키지 매니저 사용이 늘어나면서 쉽게 사용할 수 있는 프로그래밍 언어라는 인식이 제고되기를 바래봅니다.
