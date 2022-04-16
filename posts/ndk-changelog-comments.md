
# NDK Change Log 읽으면서 한 생각들

* https://developer.android.com/ndk/guides
* https://github.com/android/ndk.wiki
* https://android.googlesource.com/platform/ndk/+/master/docs/BuildSystemMaintainers.md

몇년 전에 NDK r21을 바탕으로 CI 빌드를 구성해둔 것을 업데이트 할 필요가 생겼다.
요즘에는 Clang 컴파일러 몇 버전을 사용하는지, libc++ 관련해서 Compiler/Linker 옵션이 바뀐 부분이 있었는지 확인하려는 목적.
(나중에 RTFM 안했다고 잔소리 듣고싶지 않으니까...)

역시 [GitHub NDK 저장소](https://github.com/android/ndk)의 [Wiki](https://github.com/android/ndk/wiki)
또는 Android Developers 페이지 중에 [NDK Revision History](https://developer.android.com/ndk/downloads/revision_history)를 참고한다.
둘의 내용은 같다...

```
git clone https://github.com/android/ndk.wiki
```

## 예전에 봤던 버전들

그동안 (사용하지는 않았어도) 추적하고 있던 버전들에 대해서.

### [r21](https://github.com/android/ndk/wiki/Changelog-r21) LTS 2021/03

```groovy
// note: 개인적으로 사용하는 조합일 뿐, 반드시 이와 같이 사용할 필요는 없음
android {
    compileSdk 29
    ndkVersion "21.4.7075529"
    defaultConfig {
        minSdkVersion 23
        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a", "x86_64"
        }
    }
}
```

* r19부터 C++ 14가 기본이었는데, 이때쯤부터 C++ 17을 시도해볼만한 환경이 갖춰지기 시작함

#### Toolchain

1. Windows 32bit 실행환경 지원이 끊김
1. macOS 10.15 이상 실행환경. [Apple M1 지원은 언젠가 하겠지... Issue 1299번 참고](https://github.com/android/ndk/issues/1299)  
   macOS에서는 SDK Manager를 사용해서 NDK 설치할 것을 권장함.  
   _대충 Android Studio를 통해서만 설치하라는 뜻_
1. 디버깅에 LLD 사용가능
1. [Build System Maintainer Guide](https://android.googlesource.com/platform/ndk/+/master/docs/BuildSystemMaintainers.md) 배포
1. 2019년 8월 이후 64bit(`arm64-v8a`)는 필수

#### Android Gradle Plugin, CMake

1. AGP 3.1 이상 버전이 필요함
1. SDK 23 이상에서는 Neon을 자동으로 활성화. 명시적으로 Off 시켜야 한다. CMake 변수 이름은 `ANDROID_ARM_NEON`.
1. GNU 관련 툴체인들의 흔적을 일부 지움 (`cxx-stl` 폴더)

#### C++

1. `<stdatomic.h>`에서 C 언어 Type Qualifier [`_Atomic`](https://en.cppreference.com/w/c/language/atomic)를 계속 사용함. 이후 C++ 표준을 위해 지원하지 않을수도 있음
1. libc++(`libc++_shared`, `libc++_static`)은 더이상 [Neon](https://arm-software.github.io/acle/neon_intrinsics/?msclkid=21a7d423bd6911ec93eb23bac3e05d22)을 사용하지 않음.  
   _이제와서 생각해보면 이런 변경사항들은 ARMv8(`arm64-v8a`)로 넘어가라는 의미였던 것 같다._
1. `<stdbool.h>` 추가됨. C++에서 `<cstdbool>`은 C++17에서 Deprecated. C++20에서 제거되었음.
  계속 사용하려면 C 표준에서 사용하는 이름으로(`<stdbool.h>`) 사용해야 한다.
1. Android 11 API를 지원함
   * ImageDecoder
   * Camera
   * AAudio 추가: OpenSL ES를 Deprecated하고 AAudio를 권장함
   * Native Window
   * NN(NeuralNetworks) API 등

#### Known Issues

* `thread_local` 변수가 `dlclose`의 영향을 받지 않도록 주의
* Address Sanitizer를 사용하기 위해선 Android STL `c++_shared`가 필요함

### [r22](https://github.com/android/ndk/wiki/Changelog-r22) 2021/03

```groovy
android {
    compileSdk 30
    ndkVersion "22.1.7171670"
    defaultConfig {
        minSdkVersion 24
        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a", "x86_64"
        }
    }
}
```

* NDK의 파일구조가 변경되었다는 점이 중요함.  
  r21를 사용해 Android 환경으로 Cross Compile하던 절차들이 r22에서는 제대로 동작하지 않을수도 있음.

#### Toolchain

* **파일구조 변경 공지**. CMake 사용자 입장에서 굉장히 중요한 부분인데, Android 내장(Built-in) 라이브러리들의 경로를 조정해야 할 필요가 있음
* GNU 유틸리티들은 Deprecated하고, LLVM 툴이 기본이 된다.  
  세세한 내용은 Build System Maintainers Guide를 통해 계속 확인해야 함.
* LLDB 4.3을 사용

#### Android Gradle Plugin, CMake

1. AGP 4.1 권장: Prefab 지원으로 꽤 주목을 받았었음
1. CMake 3.19 이상 버전관련 버그 수정

이 시기에 AGP와 CMake 양쪽이 업데이트되면서 **빌드환경에 맞는 AGP-CMake 조합**이 조금씩 달랐던 것으로 기억한다. Windows 환경에서 빌드할때 맞는 옵션이 Linux 환경에서는 안맞다던가...

#### C++

https://android.googlesource.com/platform/ndk/+/master/docs/BuildSystemMaintainers.md#STL

1. `std::filesystem` 정식 지원. 이전까지는 filesystem 관련 라이브러리 옵션이 추가로 필요했음  
  일부 구형 단말에서는 잘못 동작할수도 있음. (예. `std::filesystem::canonical`)
1. `native_app_glue`에서 전달받는 message 추가

## 현재 사용중인 버전

### [r23](https://github.com/android/ndk/wiki/Changelog-r23) LTS 2021/08

```groovy
android {
    compileSdk 30
    ndkVersion "23.1.7779620"
    defaultConfig {
        minSdkVersion 26
        ndk {
            abiFilters "arm64-v8a", "x86_64"
        }
    }
}
```

* NEON이 없는 `armeabi-v7a`를 지원하는 마지막 버전

#### Toolchain

1. LLVM 12 개발버전으로 변경
* libgcc관련 ABI를 LLVM, libclang_rt로 이전(Migrate)함

#### Android Gradle Plugin, CMake

1. AGP는 Release build 시에 CMake `RelWithDebInfo`를 사용
1. CMake 3.21을 위해 `android.toolchain.cmake`가 재작성되었고, 이전 버전을 사용하기 위해서는 `ANDROID_USE_LEGACY_TOOLCHAIN_FILE`변수를 사용해야 함. Legacy를 사용할 때 Minimum 버전은 21.
1. CMake `find_library`는 이제 `lib{name}.so` 파일을 더 선호함

#### C++

* Vulkan Validation 레이어 삭제.
1. Android 12 API를 지원.  
   _sysroot 변경이 있으므로 System ABI를 사용중이라면 관련 Header 파일들에 유의미한 변화가 있는지 확인 필요_

#### Known Issues

앞서 버전에서 발견된 이슈들이 그대로 유지.
중요한 문제는 `thread_local`과 `dlclose` 관련 1개 뿐이라고 생각한다.

## 앞으로 적용할 버전들

2022년 3Q 부터 프로젝트의 CI를 구성할 때 기준으로 사용하려는 버전들에 대해서.


### [r24](https://github.com/android/ndk/wiki/Changelog-r24)

```groovy
android {
    compileSdk 31
    ndkVersion "24.0.8215888"
    defaultConfig {
        minSdkVersion 29
        ndk {
            abiFilters "arm64-v8a", "x86_64"
        }
    }
}
```

* Non-Neon 단말은 더이상 지원하지 않음
* RenderScript 지원 중단함. (Android 12에서 Deprecated 되었음)

#### Toolchain

1. Apple M1 지원 추가. (LLVM 툴들을 Universal binary로 배포)
1. LLVM 14 개발버전으로 변경

#### Android Gradle Plugin, CMake

1. `LOCAL_ALLOW_MISSING_PREBUILT`, `PREBUILT_SHARED_LIBRARY`, `PREBUILT_STATIC_LIBRARY` 관련 옵션 추가.  
   _Naming을 보면 Android.mk 관련인 것 같다. Prebuilt 관련 문제가 발생한다면 앞서 추가된 Prefab 지원과 관련이 있는 것 같은데, Prefab 기능을 사용하고 있다면 탐험적으로 문제가 무엇인지 조사해볼 필요가 있어보인다._
1. `ANDROID_NATIVE_API_LEVEL`이 잘못 처리되는 문제를 수정
1. `CMAKE_ANDROID_EXCEPTIONS` 옵션 수정.  
   _이 변수는 처음 보는데, 이제 cppFlags에서 Exception관련 컴파일러 옵션을 제공하지 않아도 괜찮은건가?_
1. CMake 3.22+ 버전

#### C++

1. Android 12L API를 지원.  
1. `mbstowcs`, `wcstombs` 제거
1. Minimum SDK 29일때 stack trace가 깨지는 문제 수정

#### Known Issues

`thread_local`, `dl_close`관련 설명이 좀 더 상세해졌다.
Wiki문서 참고.

