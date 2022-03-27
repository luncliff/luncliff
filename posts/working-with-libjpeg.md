# libjpeg C API

## Customizing 가능한 타입들

`jmorecfg.h`에 정의된 `JMETHOD` 매크로를 사용해 함수포인터를 교체하는 방법으로 Customizing이 가능하다.

```c++
#ifdef HAVE_PROTOTYPES
#define JMETHOD(type,methodname,arglist)  type (*methodname) arglist
#else
#define JMETHOD(type,methodname,arglist)  type (*methodname) ()
#endif
```

이런 JMETHOD를 사용하는 타입들은 libjpeg에서는 `_mgr` 이름을 사용한다.

1. `jpeg_source_mgr`
2. `jpeg_destination_mgr`
3. `jpeg_memory_mgr`
4. `jpeg_error_mgr`
5. `jpeg_progress_mgr`

이 중 source/destination/memory는 건드려본 적이 없다.
특별히 그렇게 할 필요성이 없었던 것 같다.
이 타입들의 함수 타입들을 살펴보면 대부분 `j_common_ptr`를 사용한다.
실제로는 일정한 패턴으로 멤버변수를 배치한 struct들의 앞부분(`jpeg_common_fields`)을 가져오는 것이다.
(C++에서는 상속하는 것으로 layout을 재사용함)

```c++
typedef struct jpeg_common_struct * j_common_ptr;
typedef struct jpeg_compress_struct * j_compress_ptr;
typedef struct jpeg_decompress_struct * j_decompress_ptr;
```

`jpeg_compress_struct`와 `jpeg_decompress_struct`는 libjpeg 구현 라이브러리들마다 달라서 주의깊게 확인했던 적은 없는 것 같다.
디버깅하면서 멤버 변수 이름 찾으려고 훑어보는 정도...?

### jpeg_error_mgr

```c++
struct jpeg_error_mgr {
  JMETHOD(noreturn_t, error_exit, (j_common_ptr cinfo));
  JMETHOD(void, emit_message, (j_common_ptr cinfo, int msg_level));
  JMETHOD(void, output_message, (j_common_ptr cinfo));
  JMETHOD(void, format_message, (j_common_ptr cinfo, char * buffer));
#define JMSG_LENGTH_MAX  200
  // ...
};
```

libjpeg에서는 이 타입의 초기화를 위해 `jpeg_std_error`를 정의한다.

```c++
/* Default error-management setup */
EXTERN(struct jpeg_error_mgr *) jpeg_std_error
	JPP((struct jpeg_error_mgr * err));
```
```c++
GLOBAL(struct jpeg_error_mgr *)
jpeg_std_error (struct jpeg_error_mgr * err)
{
  err->error_exit = error_exit;
  err->emit_message = emit_message;
  err->output_message = output_message;
  err->format_message = format_message;
  err->reset_error_mgr = reset_error_mgr;
  // ...
  return err;
}
```

#### C++ exception 적용

요즘은 JPEG 파일이라고 해도 JPEG XT, JPEG XL, JFIF 같은 파생?포맷들이 많기 때문에, 오류처리에 신경쓸 수 있는만큼 써두는게 좋다.
가장 좋은 방법은 여러 JPEG 타입들을 고려해서 개발한 JPEG 라이브러리를 찾는 것이라고 생각한다.
지금은 편의상 이 라이브러리를 쓰고 있을 뿐...

`jpeg_std_error`에서 사용하는 함수 `error_exit`는 [`[[noreturn]]`](https://en.cppreference.com/w/cpp/language/attributes/noreturn)인데, 구현코드를 보면 [`exit`](https://en.cppreference.com/w/c/program/exit)를 호출한다.

```c++
METHODDEF(noreturn_t)
error_exit (j_common_ptr cinfo)
{
  (*cinfo->err->output_message) (cinfo);
  jpeg_destroy(cinfo);
  exit(EXIT_FAILURE);
}

METHODDEF(void)
output_message(j_common_ptr cinfo)
{
  char buffer[JMSG_LENGTH_MAX];

  /* Create the message */
  (*cinfo->err->format_message) (cinfo, buffer);

#ifdef USE_WINDOWS_MESSAGEBOX
  /* Display it in a message dialog box */
  MessageBox(GetActiveWindow(), buffer, "JPEG Library Error",
             MB_OK | MB_ICONERROR);
#else
  /* Send it to stderr, adding a newline */
  fprintf(stderr, "%s\n", buffer);
#endif
}
```

이 부분을 `throw`로 바꿔주는 방법으로 libjpeg 내에서 발생하는 오류들을 try-catch 처리할 수 있다.
예외타입을 통해 libjpeg의 오류 메세지를 전달할 것이므로, `output_message`는 호출할 필요가 없다.

```c++
[[noreturn]] void on_jpeg_error(j_common_ptr ptr) {
    char msg[JMSG_LENGTH_MAX]{};
    (*ptr->err->format_message)(ptr, msg);
    jpeg_destroy(ptr);
    throw std::runtime_error{msg};
}

void reset(jpeg_error_mgr& ref) noexcept {
    jpeg_std_error(&ref);
    ref.error_exit = &on_jpeg_error;
}
```

### jpeg_progress_mgr

```c++
struct jpeg_progress_mgr {
  JMETHOD(void, progress_monitor, (j_common_ptr cinfo));

  long pass_counter;
  long pass_limit;
  int completed_passes;
  int total_passes;
};
```

언젠가는 Debug Log를 남기기 위한 목적으로 사용해보고 싶기는 한데, 굳이 이미지 한장에 그렇게까지 해야할 필요성을 느끼지 못하겠다...


## 다수의 libjpeg 라이브러리가 충돌하는 문제

동적 링킹 라이브러리 사용하는 경우, 정적 라이브러리를 사용하는 경우에도 발생할 수 있다.

### 상황1: 정적 링킹이 잘못되는 경우

상황은 대략 이렇다..

```cmake
find_package(mozjpeg CONFIG REQUIRED) # or libjpeg-turbo

add_library(gfx_texture STATIC)

target_link_libraries(gfx_texture
PRIVATE
    mozjpeg::jpeg
)
```

그런데, 실제 이 `gfx_texture`라는 라이브러리를 사용할 때 다른 JPEG 라이브러리를 사용하는 것이다.

```cmake
find_package(JPEG REQUIRED) # for example, IJG libjpeg

add_executable(main)

target_link_libraries(main
PRIVATE
    gfx_texture # This library expects Mozilla JPEG
    JPEG::JPEG  #   but the buildsystem provided IJG's libjpeg library
)
```

이때 `mozjpeg`과 `ijg-libjpeg`의 C API가 호환된다는 점이 중요하다. (C++ namespace의 중요성을 엿볼 수 있는 부분)
하지만 실제로는 호환되지 않는다. 컴파일 시간에 결정되는 부분들이 동일하지 않기 때문이다.

```c++
/* Initialization of JPEG compression objects.
 * jpeg_create_compress() and jpeg_create_decompress() are the exported
 * names that applications should call.  These expand to calls on
 * jpeg_CreateCompress and jpeg_CreateDecompress with additional information
 * passed for version mismatch checking.
 * NB: you must set up the error-manager BEFORE calling jpeg_create_xxx.
 */
#define jpeg_create_compress(cinfo) \
    jpeg_CreateCompress((cinfo), JPEG_LIB_VERSION, \
			(size_t) sizeof(struct jpeg_compress_struct))
#define jpeg_create_decompress(cinfo) \
    jpeg_CreateDecompress((cinfo), JPEG_LIB_VERSION, \
			  (size_t) sizeof(struct jpeg_decompress_struct))
EXTERN(void) jpeg_CreateCompress JPP((j_compress_ptr cinfo,
				      int version, size_t structsize));
EXTERN(void) jpeg_CreateDecompress JPP((j_decompress_ptr cinfo,
					int version, size_t structsize));
```

JPEG 파일로부터 픽셀 데이터를 메모리로 읽을때는 `j_decompress_ptr`가, 메모리의 픽셀들을 파일로 쓰기 위해선 `j_compress_ptr`를 만들어야 한다.
이 포인터 타입들이 사용하는 `struct jpeg_compress_struct`와 `struct jpeg_decompress_struct`는 컴파일 시간에 어느 libjpeg라이브러리의 jpeglib.h 파일을 사용했는지에 따라 달라질 수 있다. 
필자가 알고있는 3개 라이브러리를 조사해보면, 서로 `sizeof` 계산결과가 다른 것을 알 수 있다.

| libjpeg | jpeg_compress_struct | jpeg_decompress_struct |
|-----:|-----:|-----:|
| IJG libjpeg       | 296 | 376 |
| Turbo JPEG(jpeg8) | 568 | 624 |
| Mozilla JPEG      | 504 | 600 |

그냥 OpenJPEG 같이 C언어 함수를 제공하더라도, Version 값을 실행시간에 알 수 있는 다른 라이브러리를 사용하거나,
JPEG 라이브러리를 통일해두는게 정신건강에 이롭겠다는 것을 알 수 있다.
... **하지만 안타깝게도 이 부분은 동적 링킹으로 동작하는 상황에서도 문제가 된다.**

### 상황2: 동적 로딩에 의해 모호함이 발생한 경우

예를 들어, libjpeg-9d.so와 링킹도 잘 되었고, 실행도 잘 되었다고 하자.
그런데 다른 라이브러리에 의해 libjpeg-turbo.so가 현재 프로그램의 공간에 로딩되면 어떨까? 예를 들어, libyuv.so 같은 라이브러리에 의해서...

* libjpeg-9d.so: 빌드/배포에 사용한 라이브러리
* libjpeg-turbo.so: 실행시간에 동적으로 로딩된 라이브러리

두 라이브러리 모두 C 함수 `jpeg_CreateCompress`를 가지고 있다면, 로딩이 끝난 이후 이 함수로 jump해야 할 때가 되면 어느 so를 사용해야 하는지 알 수 없게된다.
이 문제를 고칠 방법은 필요한 **사용해야만 하는** libjpeg 함수들의 주소를 전부 획득해두는 것 밖에 없다.

## 코드를 작성한다면...

대충 아래와 같이 작성하면 libjpeg을 사용 문제를 예방할 수 있을 정도는 될 것 같다.
아직 어딘가에 적용해본 것은 아니므로 망상이다.

### Compress/Decompress functions

우선 Compress(Write to JPEG)/Decompress(Read from JPEG)를 위한 함수 포인터들을 struct로 묶는다.
libjpeg의 충돌 문제는 심볼 이름이 같아서 발생한 문제이므로, C++의 namespace를 써서 C API의 전철을 밟지 않도록 한다.

`sizeof(struct jpeg_decompress_struct)`같은 코드는 VSCode나 IDE를 열어서 봐야 그 값을 알 수 있는데,
개인적으로 이런 타입들은 `static_assert`를 써서 구체적인 크기값을 알려주는게 좋다고 생각한다.
나중에 필드가 추가되었을 때 크기 변화를 알 수 있는데, 여러 아키텍처를 지원한다면 꽤 지저분하게 매크로 처리를 해야할수도 있으므로, 포인터 타입이 아닌 멤버는 섞어쓰지 않는게 깔끔하다.
`sizeof(void*)`의 배수로 검사할 수 있으니까...

```c++
#include <cstdint>
#include <jpeglib.h>

namespace image {

/// @see `jpeg_compress_struct` and functions for it 
struct jpeg_compress_operation_t final {
    void (*create_compress)(j_compress_ptr, int, size_t) = nullptr;
    void (*destroy_compress)(j_compress_ptr) = nullptr;
    void (*abort_compress)(j_compress_ptr) = nullptr;

    void (*compress_set_defaults)(j_compress_ptr) = nullptr;
    void (*compress_set_colorspace)(j_compress_ptr, J_COLOR_SPACE) = nullptr;
    void (*compress_set_quality)(j_compress_ptr, int, boolean) = nullptr;
    void (*compress_stdio_dest)(j_compress_ptr, FILE*) = nullptr;
    void (*compress_mem_dest)(j_compress_ptr, unsigned char**, size_t*) = nullptr;
    void (*compress_start)(j_compress_ptr, boolean) = nullptr;
    JDIMENSION (*compress_write_scanlines)(j_compress_ptr, JSAMPARRAY, JDIMENSION) = nullptr;
    void (*compress_finish)(j_compress_ptr) = nullptr;
};
static_assert(sizeof(jpeg_compress_operation_t) == 88);

/// @see `jpeg_decompress_struct` and functions for it 
struct jpeg_decompress_operation_t final {
    void (*create_decompress)(j_decompress_ptr, int, size_t) = nullptr;
    void (*destroy_decompress)(j_decompress_ptr) = nullptr;
    void (*abort_decompress)(j_decompress_ptr) = nullptr;

    void (*decompress_stdio_src)(j_decompress_ptr, FILE*) = nullptr;
    void (*decompress_mem_src)(j_decompress_ptr, const unsigned char**, size_t*) = nullptr;
    int (*decompress_read_header)(j_decompress_ptr, boolean) = nullptr;
    boolean (*decompress_start)(j_decompress_ptr) = nullptr;
    JDIMENSION (*decompress_read_scanlines)(j_decompress_ptr, JSAMPARRAY, JDIMENSION) = nullptr;
    boolean (*decompress_finish)(j_decompress_ptr) = nullptr;
};
static_assert(sizeof(jpeg_decompress_operation_t) == 72);


} // namespace image
```

사용해본 경험이 있는 것들만 옮겼다. 
좀 더 상세하게 조작해야 한다면 아마 더 많은 함수 포인터들을 추가해야 할텐데, 그정도까지 알고 사용하는 것보다는 다른 JPEG 라이브러리를 배우는게 더 이득이 크리라 생각한다.

실제로 저 함수포인터들을 얻어내는 타입이 필요할텐데, Windows 기준으로 작성한다면 이런 느낌이겠다.
`<dlfcn.h>`를 사용해서 구현하는 것도 어렵지 않으리라 생각한다.

```c++
#include <Windows.h>
#include <cstdint>
#include <jpeglib.h>

namespace image {

class jpeg_operation_t final {
    HMODULE mod;
    /// @note Default error handling of libjpeg
    jpeg_error_mgr* (*std_error)(jpeg_error_mgr*) = nullptr;

  public:
    const int version = JPEG_LIB_VERSION;
    const int compress_size = sizeof(struct jpeg_compress_struct);
    const int decompress_size = sizeof(struct jpeg_decompress_struct);

  public:
    /// @throw std::runtime_error The function's name that is not found in the library
    explicit jpeg_operation_t(HMODULE mod) noexcept(false);

    /// @throw std::runtime_error The function's name that is not found in the library
    void get(jpeg_compress_operation_t& fn) const noexcept(false);
    /// @throw std::runtime_error The function's name that is not found in the library
    void get(jpeg_decompress_operation_t& fn) const noexcept(false);

    // ...
};
} // namespace image
```

함수 포인터들을 얻어오는 `get(jpeg_compress_operation_t&)`, `get(jpeg_decompress_operation_t&)` 외에는 별로 중요하지 않은 부분이다.
단순한 만큼 테스트 코드도 거의 필요없다.

```c++
#include <catch2/catch.hpp>

struct jpeg_operation_test_case {
    HMODULE mod = nullptr;

  public:
    jpeg_operation_test_case() {
        DWORD flags = LOAD_LIBRARY_SEARCH_APPLICATION_DIR;
        mod = LoadLibraryExW(L"jpeg.dll", nullptr, flags);
        if (mod == nullptr)
            throw std::system_error{static_cast<int>(GetLastError()), std::system_category(), "LoadLibraryExW"};
    }
    ~jpeg_operation_test_case() {
        FreeLibrary(mod);
    }
};

TEST_CASE_METHOD(jpeg_operation_test_case, "Load JPEG functions") {
    using namespace image;

    jpeg_operation_t jpeg{mod};
    CAPTURE(jpeg.version);

    jpeg_compress_operation_t compress{};
    REQUIRE_NOTHROW(jpeg.get(compress));

    jpeg_decompress_operation_t decompress{};
    REQUIRE_NOTHROW(jpeg.get(decompress));
}
```

구체적으로 함수를 얻는 코드는 편의상 매크로를 사용했다.
`jpeg_operation_t`은 멤버 변수로 `HMODULE mod`가 있으므로, 매번 `GetProcAddress`를 통해 주소값을 얻어올 수 있다. 
`nullptr`일때는 함수 이름만 `std::runtime_error`로 알려주면, 해당 DLL에 발생한 문제를 2 종류 정도로 예상해볼 수 있다.

* 잘못된 Compiler Option
  * C 언어로 컴파일 되어야 하는데 C++ 소스코드로 처리되어 Name Mangling이 적용되었다
* 잘못된 Linker Option
  * dllexport같은 Visibility가 잘못되어, 주소를 획득할 수 없다

```c++
namespace image {
#define GET(output, name)                                                                                              \
    if (output = reinterpret_cast<decltype(output)>(GetProcAddress(mod, name)); output == nullptr)                     \
        throw std::runtime_error{name};

jpeg_operation_t::jpeg_operation_t(HMODULE mod) noexcept(false) : mod{mod} {
    if (mod == nullptr)
        throw std::invalid_argument{__func__};
    GET(std_error, "jpeg_std_error");
}

void jpeg_operation_t::get(jpeg_compress_operation_t& fn) const noexcept(false) {
    GET(fn.create_compress, "jpeg_CreateCompress");
    GET(fn.destroy_compress, "jpeg_destroy_compress");
    GET(fn.abort_compress, "jpeg_abort_compress");
    GET(fn.compress_set_defaults, "jpeg_set_defaults");
    GET(fn.compress_set_colorspace, "jpeg_set_colorspace");
    GET(fn.compress_set_quality, "jpeg_set_quality");
    GET(fn.compress_stdio_dest, "jpeg_stdio_dest");
    GET(fn.compress_mem_dest, "jpeg_mem_dest");
    GET(fn.compress_start, "jpeg_start_compress");
    GET(fn.compress_write_scanlines, "jpeg_write_scanlines");
    GET(fn.compress_finish, "jpeg_finish_compress");
}

void jpeg_operation_t::get(jpeg_decompress_operation_t& fn) const noexcept(false) {
    GET(fn.create_decompress, "jpeg_CreateDecompress");
    GET(fn.destroy_decompress, "jpeg_destroy_decompress");
    GET(fn.abort_decompress, "jpeg_abort_decompress");
    GET(fn.decompress_stdio_src, "jpeg_stdio_src");
    GET(fn.decompress_mem_src, "jpeg_mem_src");
    GET(fn.decompress_read_header, "jpeg_read_header");
    GET(fn.decompress_start, "jpeg_start_decompress");
    GET(fn.decompress_read_scanlines, "jpeg_read_scanlines");
    GET(fn.decompress_finish, "jpeg_finish_decompress");
}
#undef GET
} // namespace image
```

지금은 `reinterpret_cast<F>`때문에 길어지는 코드를 읽기 편하도록 `GET` 매크로를 정의하고,
`if` statement를 써서 예외를 던지도록 작성했다.
매크로 안에 있는 분기문에 중단점을 찍을수는 없으므로 디버깅 편의성을 해치는 방법이다.
함수 마지막에 `nullptr` 검사를 몰아넣는게 가장 좋은 방법이라 생각한다.

### Error Handling

더해서 이 타입에는 `jpeg_error_mgr`를 커스터마이징 하는 `setup(jpeg_error_mgr&)`를 추가했는데, 이후의 코드에서 가독성이 좀 더 좋은 형태라고 생각했기 때문.
함수 정의를 분리하지 않았기 때문에 다소 길게 작성되었는데, 사실 별 내용 없다.

```c++
#include <spdlog/spdlog.h>
#include <stdexcept>

namespace image {

class jpeg_operation_t final {
    // ...

    void setup(jpeg_error_mgr& ref) const noexcept {
        std_error(&ref);
        ref.error_exit = &on_error;
    }

  private:
    /// @see jpeg_destroy in jerror.c
    static void destroy(j_common_ptr ptr) {
        if (ptr->mem)
            (*ptr->mem->self_destruct)(ptr);
        ptr->mem = nullptr;
        ptr->global_state = 0;
    }

    static void on_error(j_common_ptr ptr) {
        char msg[JMSG_LENGTH_MAX]{};
        (*ptr->err->format_message)(ptr, msg);
        destroy(ptr);
        throw std::runtime_error{msg};
    }

    static void on_message(j_common_ptr ptr, int msg_level) {
        // see jerror.c
        /*
         * msg_level is one of:
         *   -1: recoverable corrupt-data warning, may want to abort.
         *    0: important advisory messages (always display to user).
         *    1: first level of tracing detail.
         *    2,3,...: successively more detailed tracing messages.
         */
        auto level = [msg_level]() {
            switch (msg_level) {
            case -1:
                return spdlog::level::level_enum::critical;
            case 0:
                return spdlog::level::level_enum::info;
            case 1:
                return spdlog::level::level_enum::trace;
            case 2:
            default:
                return spdlog::level::level_enum::debug;
            }
        }();
        char msg[JMSG_LENGTH_MAX]{};
        (*ptr->err->format_message)(ptr, msg);
        spdlog::log(level, "{}", msg);
    }
};
} // namespace image
```

이런 코드가 있으면 아래와 같은 테스트 코드를 작성할 수 있다.
`create_compress`, `create_decompress`에 잘못된 인자를 전달한 다음, `std::runtime_error` 예외가 발생하는지 확인하는 것이다.
`jpeg_error_mgr`에 오류 코드가 저장되어 있으니 예외 타입을 세분화 할수도 있겠지만,
"중요한건 돈이 아니라 메시지"라는 말에 충실하기로 했다.

```c++
using namespace image;

SCENARIO_METHOD(jpeg_operation_test_case, "Create JPEG Compress(Invalid)") {
    jpeg_operation_t jpeg{mod};
    jpeg_error_mgr em{};
    jpeg.setup(em);
    GIVEN("Compress functions") {
        jpeg_compress_operation_t fn{};
        REQUIRE_NOTHROW(jpeg.get(fn));
        jpeg_compress_struct info{};
        info.err = &em;
        WHEN("Invalid struct size") {
            // create compress with decompress struct's size
            int structsize = jpeg.decompress_size;
            REQUIRE_THROWS_AS(fn.create_compress(&info, jpeg.version, structsize), std::runtime_error);
        }
        WHEN("Invalid version") {
            int version = -jpeg.version;
            REQUIRE_THROWS_AS(fn.create_compress(&info, version, jpeg.compress_size), std::runtime_error);
        }
    }
}

SCENARIO_METHOD(jpeg_operation_test_case, "Create JPEG Decompress(Invalid)") {
    jpeg_operation_t jpeg{mod};
    jpeg_error_mgr em{};
    jpeg.setup(em);
    GIVEN("Decompress functions") {
        jpeg_decompress_operation_t fn{};
        REQUIRE_NOTHROW(jpeg.get(fn));
        jpeg_decompress_struct info{};
        info.err = &em;
        WHEN("Invalid struct size") {
            // create decompress with compress struct's size
            int structsize = jpeg.compress_size;
            REQUIRE_THROWS_AS(fn.create_decompress(&info, jpeg.version, structsize), std::runtime_error);
        }
        WHEN("Invalid version") {
            int version = -jpeg.version;
            REQUIRE_THROWS_AS(fn.create_decompress(&info, version, jpeg.decompress_size), std::runtime_error);
        }
    }
}
```

소스코드 `jpeg.setup(em)`를 "JPEG will setup this error manager."라고 읽을 수 있는게 가독성 측면에서 괜찮은 느낌이 들었다.
(jerror.c에서 확인할 수 있는 구현코드를 생각하면 reset이라고 이름지어도 꽤 어울릴 것 같다).
또 `create_compress`, `create_decompress`할때 jpeg.version, jpeg.compress_size 등으로 값을 사용할 수 있는 것도 마음에 든다.


### 실제 개체로 사용할 타입 만들기

단순하게 libjpeg 함수들을 직접 사용하는 코드가 아니게 되었으므로 적당히 개체지향적으로 묶어버리는 것도 필요해졌다...
내부적으로는 operation_t를 멤버로 두어 필요한 함수들로 접근하도록 한다.
`jpeg_compress_struct` 같은 타입들은 복사했을떄 제대로 동작하지 않으므로 복사/이동에 대해서는 `delete`한다.

```c++
namespace image {

/// @see jpeg_compress_struct
class jpeg_compress_t final {
    jpeg_compress_struct info{};
    jpeg_error_mgr em{};
    jpeg_compress_operation_t fn{};

  public:
    explicit jpeg_compress_t(const jpeg_operation_t& jpeg) noexcept(false) {
        jpeg.get(fn);
        jpeg.setup(em);
        info.err = &em;
        fn.create_compress(&info, jpeg.version, jpeg.compress_size);
    }
    ~jpeg_compress_t() {
        fn.destroy_compress(&info);
    }
    jpeg_compress_t(const jpeg_compress_t&) = delete;
    jpeg_compress_t(jpeg_compress_t&&) = delete;
    jpeg_compress_t& operator=(const jpeg_compress_t&) = delete;
    jpeg_compress_t& operator=(jpeg_compress_t&&) = delete;

    void set_destination(FILE* fp) noexcept(false) {
        fn.compress_stdio_dest(&info, fp);
    }
    // ...
};

/// @see jpeg_decompress_struct
class jpeg_decompress_t final {
    jpeg_decompress_struct info{};
    jpeg_error_mgr em{};
    jpeg_decompress_operation_t fn{};

  public:
    explicit jpeg_decompress_t(const jpeg_operation_t& jpeg) noexcept(false) {
        jpeg.get(fn);
        jpeg.setup(em);
        info.err = &em;
        fn.create_decompress(&info, jpeg.version, jpeg.decompress_size);
    }
    ~jpeg_decompress_t() {
        fn.destroy_decompress(&info);
    }
    jpeg_decompress_t(const jpeg_decompress_t&) = delete;
    jpeg_decompress_t(const jpeg_decompress_t&) = delete;
    jpeg_decompress_t(jpeg_decompress_t&&) = delete;
    jpeg_decompress_t& operator=(const jpeg_decompress_t&) = delete;
    jpeg_decompress_t& operator=(jpeg_decompress_t&&) = delete;

    void set_source(FILE* fp) noexcept(false) {
        fn.decompress_stdio_src(&info, fp);
    }
    // ...
};

} // namespace image
```

앞서 Invalid한 경우는 이미 테스트 코드가 있으므로, 여기서는 성공하는 경우에 맞게 테스트를 작성하면 된다.
`jpeg_error_mgr`는 문제가 생기면 무조건 예외를 던지므로, No throw만 확인하면 된다.

```c++
using image::jpeg_operation_t;
using image::jpeg_compress_t;
using image::jpeg_decompress_t;

TEST_CASE_METHOD(jpeg_operation_test_case, "Create JPEG Compress") {
    jpeg_operation_t jpeg{mod};
    REQUIRE_NOTHROW(jpeg_compress_t{jpeg});
}

TEST_CASE_METHOD(jpeg_operation_test_case, "Create JPEG Decompress") {
    jpeg_operation_t jpeg{mod};
    REQUIRE_NOTHROW(jpeg_decompress_t{jpeg});
}
```

여전히 컴파일 시간에 결정되는 `jpeg_compress_struct`, `jpeg_decompress_struct`가 멤버 변수로 사용되고 있는 것은 아쉽지만, 그래도 제대로 된 `jpeg_operation_t`만 실행시간에 만들어줄 수 있다면
안정적일 것이라 생각한다.
Opaque Pointer를 사용하도록 정리하면 이런 Wrapper에서는 3개 타입만 노출하게 될 것이다.

* `jpeg_operation_t`
* `jpeg_compress_t`
* `jpeg_decompress_t`

멤버 변수 3개를 적당히 바꿔가면서 재시도 할 수 있도록 지원한다면 이렇지 않을까?

```c++
namespace image {

class jpeg_operation_t final {
    // ...
  public:
    int version = JPEG_LIB_VERSION;
    int compress_size = sizeof(struct jpeg_compress_struct);
    int decompress_size = sizeof(struct jpeg_decompress_struct);
};

} // namespace image
```

```c++
TEST_CASE_METHOD(jpeg_operation_test_case, "Try JPEG library values") {
    // 0: build-type provided values
    std::vector libs{jpeg_operation_t{mod}};
    // 1: IJG libjpeg
    jpeg_operation_t& ijg = libs.emplace_back(mod);
    ijg.version = 90;
    ijg.compress_size = 296;
    ijg.decompress_size = 376;
    // 2: TurboJPEG(default)
    jpeg_operation_t& turbo = libs.emplace_back(mod);
    turbo.version = 62;
    turbo.compress_size = 504;
    turbo.decompress_size = 600;
    // 3: TurboJPEG(With JPEG 8)
    jpeg_operation_t& turbo8 = libs.emplace_back(mod);
    turbo8.version = 80;
    turbo8.compress_size = 568;
    turbo8.decompress_size = 624;
    // Search the proper one...
    jpeg_operation_t* found = nullptr;
    for (jpeg_operation_t& lib : libs) {
        try {
            jpeg_compress_t writer{lib};
            jpeg_decompress_t reader{lib};
        } catch (const std::runtime_error& ex) {
            // error message will contain information about the size mismatch
            spdlog::error("{}", ex.what());
            continue;
        }
        found = &lib;
        break;
    }
    REQUIRE(found);
}
```

`HMODULE mod`까지도 적절하게 달라져야 할수도 있겠지만, 여기서 중요한 것은 함수 포인터들이 고정되어 있는 상황에서 적절한 version, struct size값을 찾는 것이니 이정도면 될 것이라 생각한다.

