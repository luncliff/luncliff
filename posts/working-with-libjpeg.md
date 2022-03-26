
# libjpeg C API 사용하는 이야기

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
그냥 저런 포맷을 신경써서 다른 JPEG 라이브러리를 찾는게 더 좋은 방법이라고 생각한다.
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

| libjpeg | `jpeg_compress_struct` |
|-----:|-----:|
| IJG libjpeg   | 296 |
| Turbo JPEG(jpeg8) | 568 | 
| Mozilla JPEG  | 504 |


| libjpeg | `jpeg_decompress_struct` |
|-----:|-----:|
| IJG libjpeg   | 376 |
| Turbo JPEG(jpeg8) | 624 | 
| Mozilla JPEG  | 600 |

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
